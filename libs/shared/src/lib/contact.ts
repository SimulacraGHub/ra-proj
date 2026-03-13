///file not in use

import { useState } from 'react';
import { Router, Request, Response } from 'express';
import { Resend } from 'resend';

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactStatus = 'idle' | 'sending' | 'success' | 'error';

export function useContactForm(initialData?: Partial<ContactFormData>) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    ...initialData,
  });

  const [status, setStatus] = useState<ContactStatus>('idle');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setStatus('sending');

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return { formData, status, handleChange, handleSubmit };
}

const router = Router();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/contact', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  try {
    const emailResponse = await resend.emails.send({
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

    return res.status(200).json({ success: true, response: emailResponse });
  } catch (error: any) {
    console.error('Resend error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
