import '@styles/contact-styles.css';
import { useContactForm } from '../hooks/useContactForm';

export function Contact() {
  const { formData, status, handleChange, handleSubmit } = useContactForm();

  return (
    <>
      <div className="info-hover" style={{ color: '#82ca9d' }}>
        <div className="info-hover-label">About this page</div>
        <div className="info-hover-popup">
          <h4>Contact Page</h4>
          <p>
            This page allows users to send messages directly through a contact
            form. Submitted data is securely processed through a backend
            service.
          </p>
          <p>
            The backend integrates with the Resend email API to deliver
            messages.
          </p>
          <p>
            Messages may occasionally fail due to third-party API limits,
            configuration issues, or network interruptions.
          </p>
          <p>
            Frontend manages form state; backend handles secure email delivery.
          </p>
        </div>
      </div>

      <div className="contact-container">
        <h2>Contact Me</h2>
        <p>
          You can reach me at{' '}
          <a href="mailto:ruanadkruger@gmail.com" style={{ color: '#bb86fc' }}>
            ruanadkruger@gmail.com
          </a>{' '}
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
    </>
  );
}
