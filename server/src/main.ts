import express, { Request, Response } from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import spotifyRoutes from './routes/spotifyRoutes';

const app = express();

// Allow frontend requests
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Initialize Resend with API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/contact', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  try {
    // Send email and log the response
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

    //console.log('Resend response:', emailResponse); // Log API response

    return res.status(200).json({ success: true, response: emailResponse });
  } catch (error: any) {
    console.error('Resend error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.use('/api/spotify', spotifyRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
