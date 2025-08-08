"use server";

import nodemailer from "nodemailer";
import { OAuth2Client } from 'google-auth-library';

export type SendMessageResult = {
  success: boolean;
  message?: string;
  error?: string;
  debugInfo?: any; // Добавляем поле для отладочной информации
};

export async function sendMessage(formData: FormData): Promise<SendMessageResult> {
  // Собираем все данные для отладки
  const debugData: any = {
    timestamp: new Date().toISOString(),
    formData: {
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString(),
      task: formData.get("task")?.toString()
    },
    env: {
      clientId: !!process.env.OAUTH_CLIENT_ID,
      clientSecret: !!process.env.OAUTH_CLIENT_SECRET,
      refreshToken: !!process.env.OAUTH_REFRESH_TOKEN,
      senderEmail: process.env.GOOGLE_SENDER_EMAIL,
      recipientEmail: process.env.GOOGLE_RECIPIENT_EMAIL
    }
  };

  try {
    const name = formData.get("name")?.toString() || '';
    const email = formData.get("email")?.toString() || '';
    const task = formData.get("task")?.toString() || '';

    // Проверка обязательных полей
    if (!name || !email || !task) {
      debugData.validationError = "Missing required fields";
      console.error("Validation Error:", debugData);
      
      return {
        success: false,
        message: "Все поля обязательны для заполнения",
        error: "Missing required fields",
        debugInfo: debugData
      };
    }

    // Проверка переменных окружения
    if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET || !process.env.OAUTH_REFRESH_TOKEN) {
      debugData.envError = "Missing OAuth credentials";
      console.error("Environment Error:", debugData);
      
      return {
        success: false,
        message: "Ошибка сервера: не настроены параметры отправки",
        error: "Missing OAuth credentials",
        debugInfo: debugData
      };
    }

    // Создаем OAuth2 клиент
    const oauth2Client = new OAuth2Client(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.OAUTH_REFRESH_TOKEN
    });

    // Получаем токен с подробным логгированием
    let accessToken;
    try {
      const tokenResponse = await oauth2Client.getAccessToken();
      accessToken = tokenResponse.token;
      debugData.tokenInfo = {
        hasToken: !!accessToken,
        tokenExpiry: tokenResponse.res?.data.expiry_date
      };
    } catch (tokenError) {
      debugData.tokenError = {
        message: tokenError instanceof Error ? tokenError.message : "Unknown token error",
        stack: tokenError instanceof Error ? tokenError.stack : undefined
      };
      console.error("Token Error:", debugData);
      
      return {
        success: false,
        message: "Ошибка авторизации сервера",
        error: "Failed to get access token",
        debugInfo: debugData
      };
    }

    // Создаем transporter с OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_SENDER_EMAIL || 'go@rg.by',
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken || '',
      },
    });

    // Отправляем письмо с обработкой ошибок SMTP
    try {
      const mailOptions = {
        from: `"Форма обратной связи" <${process.env.GOOGLE_SENDER_EMAIL || 'go@rg.by'}>`,
        to: process.env.GOOGLE_RECIPIENT_EMAIL || 'go@rg.by',
        replyTo: email,
        subject: `Новая заявка от ${name}`,
        text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${task}`,
        html: `
          <h2>Новая заявка с сайта</h2>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Сообщение:</strong></p>
          <p>${task.replace(/\n/g, '<br>')}</p>
        `
      };

      debugData.mailOptions = mailOptions;
      
      const info = await transporter.sendMail(mailOptions);
      debugData.smtpResponse = info.response;

      console.log("Email Sent Successfully:", debugData);
      
      return { 
        success: true, 
        message: "Сообщение успешно отправлено!",
        debugInfo: debugData
      };

    } catch (smtpError) {
      debugData.smtpError = {
        message: smtpError instanceof Error ? smtpError.message : "Unknown SMTP error",
        stack: smtpError instanceof Error ? smtpError.stack : undefined
      };
      console.error("SMTP Error:", debugData);
      
      return { 
        success: false, 
        message: "Ошибка при отправке сообщения",
        error: "SMTP error",
        debugInfo: debugData
      };
    }

  } catch (error) {
    debugData.unexpectedError = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    };
    console.error("Unexpected Error:", debugData);
    
    return { 
      success: false, 
      message: "Неожиданная ошибка сервера",
      error: "Unexpected error",
      debugInfo: debugData
    };
  }
}