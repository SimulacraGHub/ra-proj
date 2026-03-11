// server/services/spotifyService.ts
//import fetch from 'node-fetch';
import { Artist, Album, Track } from '../types/musicTypes';

const BASE_URL = 'https://api.spotify.com/v1';

let cachedToken: { token: string; expiresAt: number } | null = null;

// Get access token using Client Credentials Flow
async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spotify auth failed: ${text}`);
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000 - 5000, // refresh 5s before expiry
  };
  return data.access_token;
}

// Search artists
export async function searchArtists(query: string): Promise<Artist[]> {
  if (!query) throw new Error('Missing query parameter "q"');

  const token = await getAccessToken();
  const res = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=artist&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify search failed: ${text}`);
  }

  const data = await res.json();

  return data.artists.items.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    country: artist.country,
    disambiguation: artist.disambiguation,
  }));
}

// Get all studio albums for an artist in the US, filter live and remasters
export async function getArtistAlbums(artistId: string): Promise<Album[]> {
  if (!artistId) throw new Error('Missing artistId parameter');

  const token = await getAccessToken();
  const limit = 10; // max per request
  let offset = 0;
  let albums: any[] = [];

  while (true) {
    const res = await fetch(
      `${BASE_URL}/artists/${artistId}/albums?include_groups=album&market=US&limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Spotify album fetch failed: ${text}`);
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) break;

    albums = albums.concat(data.items);
    offset += limit;
  }

  // Helper to detect live albums
  const isLiveAlbum = (name: string) => {
    const lower = name.toLowerCase();
    return (
      /\blive\b/.test(lower) ||
      lower.includes('live at') ||
      lower.includes('live from')
    );
  };

  // Helper to detect remasters/reissues/deluxe editions
  const isRemaster = (name: string) => {
    const lower = name.toLowerCase();
    return (
      lower.includes('remaster') ||
      lower.includes('deluxe') ||
      lower.includes('reissue')
    );
  };

  // remove duplicates and unwanted albums
  const uniqueAlbums = new Map<string, any>();
  albums.forEach((album) => {
    const name = album.name.trim();
    const key = name.toLowerCase();

    if (!isLiveAlbum(name) && !isRemaster(name) && !uniqueAlbums.has(key)) {
      uniqueAlbums.set(key, album);
    }
  });

  return Array.from(uniqueAlbums.values()).map((album) => ({
    id: album.id,
    title: album.name,
    releaseDate: album.release_date,
  }));
}

// Get tracks for an album
export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  if (!albumId) throw new Error('Missing albumId parameter');

  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/albums/${albumId}/tracks?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify track fetch failed: ${text}`);
  }

  const data = await res.json();

  return data.items.map((track: any) => ({
    id: track.id,
    title: track.name,
    lengthMs: track.duration_ms,
  }));
}
