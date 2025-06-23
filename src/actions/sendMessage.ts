'use server';

export async function sendMessage(formData: FormData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const task = formData.get('task');

    console.log('New message:', { name, email, task });

    // Здесь можно добавить отправку письма или запись в БД
}
