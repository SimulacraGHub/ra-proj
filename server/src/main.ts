import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import spotifyRoutes from './routes/spotifyRoutes';
import contactRouter from './routes/contactRoutes';

const app = express();

// Allow frontend requests
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api', contactRouter);

app.use('/api/spotify', spotifyRoutes);

// __dirname is server/dist/server after build
// React build is in raProj/react-app/dist
const reactBuildPath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../../../react-app/dist') // after nx build
    : path.join(__dirname, '../../react-app/dist'); // local dev
console.log('Serving React from:', reactBuildPath);

app.use(express.static(reactBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(reactBuildPath, 'index.html'));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
