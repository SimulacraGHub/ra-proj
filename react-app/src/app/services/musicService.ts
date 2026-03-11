// react-app/src/app/services/musicService.ts
import { Artist, Album, Track } from '../types/musicTypes';

// fetch from backend; backend handles Spotify
export async function searchArtists(query: string): Promise<Artist[]> {
  const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to fetch artists');
  return res.json(); // already returns Artist[]
}

export async function getAlbumsByArtist(artistId: string): Promise<Album[]> {
  const res = await fetch(`/api/spotify/albums/${artistId}`);
  if (!res.ok) throw new Error('Failed to fetch albums');
  return res.json(); // already returns Album[]
}

export async function getTracksByAlbum(albumId: string): Promise<Track[]> {
  const res = await fetch(`/api/spotify/tracks/${albumId}`);
  if (!res.ok) throw new Error('Failed to fetch tracks');
  return res.json(); // already returns Track[]
}

//
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
  }

  return albumsWithTracks;
}

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

export function albumsToChartData(albums: Album[]) {
  return albums.map((album) => ({
    name: album.title,
    avg: (album.averageTrackLengthMs ?? 0) / 60000,
  }));
}
