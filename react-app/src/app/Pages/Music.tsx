import { useState } from 'react';
import '@styles/music-styles.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { searchArtists } from '../services/musicService';
import { Artist, Album } from '../types/musicTypes';
import { getAlbumsByArtist } from '../services/musicService';
import { getTracksByAlbum } from '../services/musicService';
//import { Rectangle } from 'recharts';

// const CustomCursor = (props: any) => {
//   const { x, y, width, height } = props;
//   return (
//     <Rectangle
//       x={x}
//       y={y}
//       width={width}
//       height={height}
//       fill="rgba(130, 202, 157, 0.2)" // light green hover
//       stroke="#82ca9d" // border color
//       strokeWidth={2}
//       rx={6} // rounded corners
//       ry={6}
//     />
//   );
// };

export function Music() {
  //old popup when input is empty
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

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

  //album sort state
  const [albumSortOrder, setAlbumSortOrder] = useState<'asc' | 'desc'>('asc');

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
    //old custom popup
    if (!query.trim()) {
      // Show popup
      setPopupMessage('Please enter an artist name');

      // Hide it automatically after 2 seconds
      setTimeout(() => setPopupMessage(null), 2000);
      return;
    }

    // Clear previous artist selection & albums
    setSelectedArtist(null);
    setAlbums([]);
    setAlbumsError(null);

    setLoading(true);
    setError(null);

    try {
      const results = await searchArtists(query);
      setArtists(results);
      if (results.length === 0) {
        // Show popup if no artists found
        setPopupMessage('No artists found');
        setTimeout(() => setPopupMessage(null), 4000);
      }
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

  const sortedAlbums = [...albums].sort((a, b) => {
    const aAvg = a.averageTrackLengthMs ?? 0;
    const bAvg = b.averageTrackLengthMs ?? 0;
    return albumSortOrder === 'asc' ? aAvg - bAvg : bAvg - aAvg;
  });

  const avgTrackData = sortedAlbums.map((album) => ({
    name: album.title,
    avg: (album.averageTrackLengthMs ?? 0) / 60000,
  }));

  return (
    <div className="music-container">
      {(loading || albumsLoading) && (
        <div className="loading-overlay">
          <div className="loading-message">
            <div className="spinner"></div>
            <span>
              {loading
                ? 'Searching artists...'
                : 'Loading albums and tracks... Select an album to expand'}
            </span>
          </div>
        </div>
      )}
      <h1 className="music-title">Music Analytics Dashboard</h1>

      {popupMessage && <div className="popup-message">{popupMessage}</div>}
      {error && <div className="popup-message">{error}</div>}

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

      {/* Chart Section */}
      {selectedArtist && !albumsLoading && avgTrackData.length > 0 && (
        <>
          <button
            className="sort-button"
            onClick={() =>
              setAlbumSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
            disabled={loadingTracks}
          >
            Sort by Average Track Length ({albumSortOrder === 'asc' ? '↑' : '↓'}
            )
          </button>

          <div
            className="chart-container"
            style={{ width: '100%', height: 300, marginBottom: '1rem' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={avgTrackData}
                margin={{ top: 5, right: 20, left: 0, bottom: 50 }}
              >
                <CartesianGrid className="chart-grid" />
                <XAxis
                  dataKey="name"
                  angle={-80} // rotate labels
                  textAnchor="end" // rotation alignment
                  interval={0} // show all labels
                  height={60} // total space for labels
                  tick={{ fontSize: 12, fill: '#fff' }}
                  tickMargin={50} // moves labels down into empty space
                  label={{ value: '', offset: 0 }} // prevents extra chart space usage
                  //   tickFormatter={(value) =>          //truncation
                  //     value.length > 12 ? value.slice(0, 12) + '…' : value
                  //   }
                />
                <YAxis className="chart-axis" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0)
                      return null;

                    return (
                      <div className="chart-tooltip-wrapper">
                        <div className="tooltip-label">{label}</div>
                        <div className="tooltip-value">
                          {payload[0].value.toFixed(2)} min
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="avg" className="chart-bar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
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
                <li
                  key={album.id}
                  className="artist-item"
                  onClick={() => toggleAlbum(album.id)}
                  style={{ cursor: 'pointer' }} // pointer for whole item
                >
                  <strong>{album.title}</strong>
                  {album.releaseDate && ` (${album.releaseDate})`}
                  {album.averageTrackLengthMs !== undefined &&
                    ` – Avg: ${(album.averageTrackLengthMs / 60000).toFixed(
                      2
                    )} min`}

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
