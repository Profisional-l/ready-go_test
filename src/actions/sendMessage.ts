"use server";

import nodemailer from "nodemailer";
import { OAuth2Client } from 'google-auth-library';

export type SendMessageResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function sendMessage(formData: FormData): Promise<SendMessageResult> {
  try {
    const name = formData.get("name")?.toString() || '';
    const email = formData.get("email")?.toString() || '';
    const task = formData.get("task")?.toString() || '';

    // Проверка обязательных полей
    if (!name || !email || !task) {
      return {
        success: false,
        message: "Все поля обязательны для заполнения",
        error: "Missing required fields"
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

    const accessToken = await oauth2Client.getAccessToken();

    // Создаем transporter с OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_SENDER_EMAIL || 'go@rg.by',
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken.token || '',
      },
    });

    // Отправляем письмо
    await transporter.sendMail({
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
      `,
    });

    return { 
      success: true, 
      message: "Сообщение успешно отправлено!" 
    };

  } catch (error) {
    console.error("Ошибка отправки:", error);
    return { 
      success: false, 
      message: "Ошибка при отправке сообщения",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}