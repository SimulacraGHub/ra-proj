import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(msg: ContactMessage) {
  const { name, email, message } = msg;

  if (!name || !email || !message) {
    throw new Error('Missing fields: name, email, or message');
  }

  const response = await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>',
    to: 'ruanadkruger@gmail.com',
    subject: `New Portfolio Message from ${name}`,
    replyTo: email,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>${message}</p>
    `,
  });

  return response;
}
