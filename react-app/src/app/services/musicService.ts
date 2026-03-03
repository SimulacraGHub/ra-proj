import { Artist, Album, Track } from '../types/musicTypes';

const BASE_URL = 'https://musicbrainz.org/ws/2';

//Search Artist
export async function searchArtists(query: string): Promise<Artist[]> {
  const response = await fetch(
    `${BASE_URL}/artist/?query=artist:${encodeURIComponent(query)}&fmt=json`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch artists');
  }

  const data = await response.json();

  return data.artists.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    country: artist.country,
    disambiguation: artist.disambiguation,
  }));
}

//Get albums for artists
export async function getAlbumsByArtist(artistId: string): Promise<Album[]> {
  const response = await fetch(
    `${BASE_URL}/release?artist=${artistId}&fmt=json&type=album`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch albums');
  }

  const data = await response.json();

  return data.releases.map((release: any) => ({
    id: release.id,
    title: release.title,
    releaseDate: release.date,
  }));
}

//Get tracks for album
export async function getTracksByAlbum(releaseId: string): Promise<Track[]> {
  const response = await fetch(
    `${BASE_URL}/release/${releaseId}?inc=recordings&fmt=json`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tracks');
  }

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
