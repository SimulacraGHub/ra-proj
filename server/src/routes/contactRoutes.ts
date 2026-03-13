import { Router, Request, Response } from 'express';
import { sendContactMessage } from '../services/contactService';

const router = Router();

router.post('/contact', async (req: Request, res: Response) => {
  try {
    const result = await sendContactMessage(req.body);
    res.status(200).json({ success: true, response: result });
  } catch (err: any) {
    console.error('Contact error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
