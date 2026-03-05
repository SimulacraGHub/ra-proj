import { useState } from 'react';

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
      const response = await fetch('http://localhost:3000/api/contact', {
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
