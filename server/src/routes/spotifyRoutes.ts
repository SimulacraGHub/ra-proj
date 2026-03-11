// server/src/routes/spotifyRoutes.ts
import express from 'express';
import {
  searchArtists,
  getArtistAlbums,
  getAlbumTracks,
} from '../services/spotifyService';
import { Artist, Album, Track } from '../types/musicTypes';

const router = express.Router();

/**
 * Helper to safely call Spotify service functions
 * and log raw responses.
 */
async function safeFetch<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (err?.response) {
      try {
        const text = await err.response.text();
        console.error('Spotify response body:', text);
      } catch {}
    }
    throw err;
  }
}

// ====== ROUTES ======

// Search artists
router.get('/search', async (req, res): Promise<void> => {
  const query = req.query.q as string;
  if (!query) {
    res.status(400).json({ error: 'Missing query parameter "q"' });
    return;
  }

  try {
    const data: Artist[] = await safeFetch(() => searchArtists(query));
    res.json(data);
    return;
  } catch (err: any) {
    console.error('Spotify /search error:', err);
    res.status(500).json({ error: err.message || 'Spotify search failed' });
    return;
  }
});

// Get albums for an artist
router.get('/albums/:artistId', async (req, res): Promise<void> => {
  const artistId = req.params.artistId;
  if (!artistId) {
    res.status(400).json({ error: 'Missing artistId parameter' });
    return;
  }

  try {
    const data: Album[] = await safeFetch(() => getArtistAlbums(artistId));
    res.json(data);
    return;
  } catch (err: any) {
    console.error('Spotify /albums error:', err);
    res.status(500).json({ error: err.message || 'Album fetch failed' });
    return;
  }
});

// Get tracks for an album
router.get('/tracks/:albumId', async (req, res): Promise<void> => {
  const albumId = req.params.albumId;
  if (!albumId) {
    res.status(400).json({ error: 'Missing albumId parameter' });
    return;
  }

  try {
    const data: Track[] = await safeFetch(() => getAlbumTracks(albumId));
    res.json(data);
    return;
  } catch (err: any) {
    console.error('Spotify /tracks error:', err);
    res.status(500).json({ error: err.message || 'Track fetch failed' });
    return;
  }
});

export default router;
