"use server";

import nodemailer from "nodemailer";

export async function sendMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const task = formData.get("task") as string;

  // Создаем transporter с настройками
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,    // smtp.yourdomain.com
    port: Number(process.env.EMAIL_PORT), // 465 или 587
    secure: process.env.EMAIL_PORT === "465", // true для порта 465
    auth: {
      user: process.env.EMAIL_USER,   // go@rg.by
      pass: process.env.EMAIL_PASSWORD, // ваш пароль
    },
    tls: {
      rejectUnauthorized: false // ⚠️ Только для тестирования!
    }
  });

  try {
    await transporter.sendMail({
      from: `"Форма с сайта" <${process.env.EMAIL_USER}>`,
      to: "go@rg.by",
      subject: `Новая заявка от ${name}`,
      text: `Имя: ${name}\nEmail: ${email}\nЗадача: ${task}`,
      html: `
        <h1>Новая заявка</h1>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Задача:</strong> ${task}</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Ошибка отправки:", error);
    return { success: false, error: "Ошибка сервера" };
  }
}