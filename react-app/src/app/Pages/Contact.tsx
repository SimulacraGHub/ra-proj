import { useState } from 'react';
import '../Styles/contact-styles.css';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="contact-container">
      <h2>Contact Me</h2>

      <p>
        You can reach me at{' '}
        <a href="mailto:ruanadkruger@gmail.com" style={{ color: '#bb86fc' }}>
          {' '}
          ruanadkruger@gmail.com{' '}
        </a>
        or use the form below.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Email'}
        </button>
      </form>

      {status === 'success' && (
        <p className="success-message">Message sent successfully</p>
      )}
      {status === 'error' && (
        <p className="error-message">Something went wrong. Try again.</p>
      )}

      {status === 'sending' && (
        <div className="loading-overlay">
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Sending message...</p>
          </div>
        </div>
      )}
    </div>
  );
}
