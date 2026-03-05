import { Artist, Album, Track } from '../types/musicTypes';

const BASE_URL = 'https://musicbrainz.org/ws/2';

// Search for artists
export async function searchArtists(query: string): Promise<Artist[]> {
  const response = await fetch(
    `${BASE_URL}/artist/?query=artist:${encodeURIComponent(query)}&fmt=json`
  );

  if (!response.ok) throw new Error('Failed to fetch artists');

  const data = await response.json();

  return data.artists.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    country: artist.country,
    disambiguation: artist.disambiguation,
  }));
}

// Get albums for artist
export async function getAlbumsByArtist(artistId: string): Promise<Album[]> {
  const response = await fetch(
    `${BASE_URL}/release?artist=${artistId}&fmt=json&type=album`
  );

  if (!response.ok) throw new Error('Failed to fetch albums');

  const data = await response.json();

  return data.releases.map((release: any) => ({
    id: release.id,
    title: release.title,
    releaseDate: release.date,
  }));
}

// Get tracks for an album
export async function getTracksByAlbum(albumId: string): Promise<Track[]> {
  const response = await fetch(
    `${BASE_URL}/release/${albumId}?inc=recordings&fmt=json`
  );

  if (!response.ok) throw new Error('Failed to fetch tracks');

  const data = await response.json();

  const tracks: Track[] = [];

  data.media?.forEach((medium: any) => {
    medium.tracks?.forEach((track: any) => {
      tracks.push({
        id: track.id,
        title: track.title,
        lengthMs: track.length ?? 0,
      });
    });
  });

  return tracks;
}

// rate-limiting API calls)
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch tracks for multiple albums and calculate average
export async function fetchTracksForAlbums(albums: Album[]): Promise<Album[]> {
  const albumsWithTracks: Album[] = [];

  for (const album of albums) {
    try {
      const tracks = await getTracksByAlbum(album.id);
      const totalLength = tracks.reduce((sum, t) => sum + t.lengthMs, 0);
      const avgLength = tracks.length ? totalLength / tracks.length : 0;

      albumsWithTracks.push({
        ...album,
        tracks,
        averageTrackLengthMs: avgLength,
      });
    } catch {
      albumsWithTracks.push({
        ...album,
        tracks: [],
        averageTrackLengthMs: 0,
      });
    }

    await sleep(1000); // rate limit
  }

  return albumsWithTracks;
}

// Sort albums by average track length
export function sortAlbumsByAvgTrackLength(
  albums: Album[],
  order: 'asc' | 'desc'
): Album[] {
  return [...albums].sort((a, b) => {
    const aAvg = a.averageTrackLengthMs ?? 0;
    const bAvg = b.averageTrackLengthMs ?? 0;
    return order === 'asc' ? aAvg - bAvg : bAvg - aAvg;
  });
}

// Convert albums to chart data
export function albumsToChartData(albums: Album[]) {
  return albums.map((album) => ({
    name: album.title,
    avg: (album.averageTrackLengthMs ?? 0) / 60000,
  }));
}
