
"use server";

import nodemailer from "nodemailer";

export async function sendMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const task = formData.get("task") as string;
  
  const userEmail = "go@rg.by";

  // Создаем transporter с настройками OAuth2 для Gmail
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true для порта 465
    auth: {
      type: "OAuth2",
      user: userEmail,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${userEmail}>`, // Имя отправителя из формы, email - ваш
      to: userEmail, // Отправляем на ваш email
      replyTo: email, // Устанавливаем поле Reply-To на email пользователя
      subject: `Новая заявка с сайта от ${name}`,
      text: `Имя: ${name}\nEmail: ${email}\nЗадача: ${task}`,
      html: `
        <h1>Новая заявка с сайта</h1>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Задача:</strong></p>
        <p>${task}</p>
      `,
    });
    return { success: true, message: "Сообщение успешно отправлено!" };
  } catch (error) {
    console.error("Ошибка отправки Nodemailer:", error);
    return { success: false, message: "Ошибка сервера при отправке сообщения." };
  }
}
