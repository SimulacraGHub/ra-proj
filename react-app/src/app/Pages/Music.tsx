import { useState } from 'react';
import '../Styles/music-styles.css';

import { searchArtists } from '../services/musicService';
import { Artist } from '../types/musicTypes';
import { getAlbumsByArtist } from '../services/musicService';
import { getTracksByAlbum } from '../services/musicService';

export function Music() {
  //Initial search
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Artist selection
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [albumsError, setAlbumsError] = useState<string | null>(null);

  //State for loading tracks per album
  const [loadingTracks, setLoadingTracks] = useState(false);

  //state to track which albums are expanded
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());

  const handleArtistClick = async (artist: Artist) => {
    setQuery(''); // optional: clear input
    setSelectedArtist(artist);
    setArtists([]); // hide artist search results
    setAlbums([]);
    setAlbumsError(null);
    setAlbumsLoading(true);

    try {
      const artistAlbums = await getAlbumsByArtist(artist.id);
      setAlbums(artistAlbums);
      await fetchTracksForAlbums(artistAlbums); // <-- fetch tracks and calculate average
    } catch (err: any) {
      setAlbumsError(err.message || 'Failed to load albums');
    } finally {
      setAlbumsLoading(false);
    }
  };
  /////////////
  const searchArtist = async () => {
    if (!query.trim()) return;

    // Clear previous artist selection & albums
    setSelectedArtist(null);
    setAlbums([]);
    setAlbumsError(null);

    setLoading(true);
    setError(null);

    try {
      const results = await searchArtists(query);
      setArtists(results);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  //Fetch tracks for album
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchTracksForAlbums = async (albums: Album[]) => {
    setLoadingTracks(true);
    try {
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
        } catch (err) {
          console.warn(`Failed to fetch tracks for album ${album.title}`);
          albumsWithTracks.push({
            ...album,
            tracks: [],
            averageTrackLengthMs: 0,
          });
        }

        // wait 1 second before the next request
        await sleep(1000);
      }

      setAlbums(albumsWithTracks);
    } catch (err: any) {
      setAlbumsError(err.message || 'Failed to fetch tracks');
    } finally {
      setLoadingTracks(false);
    }
  };

  const toggleAlbum = (albumId: string) => {
    setExpandedAlbums((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(albumId)) {
        newSet.delete(albumId); // collapse if already expanded
      } else {
        newSet.add(albumId); // expand if not expanded
      }
      return newSet;
    });
  };

  return (
    <div className="music-container">
      {(loading || albumsLoading) && (
        <div className="loading-overlay">
          <div className="loading-message">
            <div className="spinner"></div>
            <span>
              {loading
                ? 'Searching artists...'
                : 'Loading albums and tracks...'}
            </span>
          </div>
        </div>
      )}
      <h1 className="music-title">Music Analytics Dashboard</h1>

      {/* Search Section */}
      <div className="search-section">
        <input
          className="search-input"
          type="text"
          placeholder="Search for an artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              searchArtist();
            }
          }}
        />
        <button className="search-button" onClick={searchArtist}>
          Search
        </button>
      </div>

      {/* Artist Search Results */}
      {artists.length > 0 && (
        <div className="artist-results-container">
          <ul className="artist-list">
            {artists.map((artist) => (
              <li
                key={artist.id}
                className="artist-item"
                onClick={() => handleArtistClick(artist)}
              >
                <strong>{artist.name}</strong>
                {artist.country && ` (${artist.country})`}
                {artist.disambiguation && ` – ${artist.disambiguation}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Albums Display */}
      {selectedArtist && (
        <div className="album-results-container">
          <h2>Albums by {selectedArtist.name}</h2>

          {albumsLoading && <p>Loading albums...</p>}
          {albumsError && <p style={{ color: 'red' }}>{albumsError}</p>}

          {albums.length > 0 ? (
            <ul className="artist-list">
              {albums.map((album) => (
                <li key={album.id} className="artist-item">
                  {/* Album clickable to expand/collapse */}
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleAlbum(album.id)}
                  >
                    <strong>{album.title}</strong>
                    {album.releaseDate && ` (${album.releaseDate})`}
                    {album.averageTrackLengthMs !== undefined &&
                      ` – Avg: ${(album.averageTrackLengthMs / 60000).toFixed(
                        2
                      )} min`}
                  </div>

                  {/* Track list, visible only if album is expanded */}
                  {expandedAlbums.has(album.id) &&
                    album.tracks &&
                    album.tracks.length > 0 && (
                      <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                        {album.tracks.map((track) => (
                          <li key={track.id}>
                            {track.title} –{' '}
                            {(track.lengthMs / 60000).toFixed(2)} min
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          ) : (
            !albumsLoading && <p>No albums found.</p>
          )}
        </div>
      )}
    </div>
  );
}
