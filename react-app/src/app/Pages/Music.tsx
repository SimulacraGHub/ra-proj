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
import { Artist, Album } from '../types/musicTypes';
import {
  searchArtists,
  getAlbumsByArtist,
  fetchTracksForAlbums,
  //sortAlbumsByAvgTrackLength,
  sortAlbums,
  albumsToChartData,
} from '../services/musicService';

export function Music() {
  // UI state
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [albumsError, setAlbumsError] = useState<string | null>(null);

  const [loadingTracks, setLoadingTracks] = useState(false);
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());
  const [albumSortField, setAlbumSortField] = useState<
    'avgTrackLength' | 'releaseDate'
  >('avgTrackLength');
  const [albumSortOrder, setAlbumSortOrder] = useState<'asc' | 'desc'>('asc');

  // Artist search
  const handleArtistClick = async (artist: Artist) => {
    setQuery('');
    setSelectedArtist(artist);
    setArtists([]);
    setAlbums([]);
    setAlbumsError(null);
    setAlbumsLoading(true);

    try {
      const artistAlbums = await getAlbumsByArtist(artist.id);
      const albumsWithTracks = await fetchTracksForAlbums(artistAlbums);
      setAlbums(albumsWithTracks);
    } catch (err: any) {
      setAlbumsError(err.message || 'Failed to load albums');
    } finally {
      setAlbumsLoading(false);
    }
  };

  const searchArtistHandler = async () => {
    if (!query.trim()) {
      setPopupMessage('Please enter an artist name');
      setTimeout(() => setPopupMessage(null), 2000);
      return;
    }

    setSelectedArtist(null);
    setAlbums([]);
    setAlbumsError(null);
    setLoading(true);
    setError(null);

    try {
      const results = await searchArtists(query);
      setArtists(results);
      if (results.length === 0) {
        setPopupMessage('No artists found');
        setTimeout(() => setPopupMessage(null), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Album toggle
  const toggleAlbum = (albumId: string) => {
    setExpandedAlbums((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(albumId)) newSet.delete(albumId);
      else newSet.add(albumId);
      return newSet;
    });
  };

  const sortedAlbums = sortAlbums(albums, albumSortField, albumSortOrder);
  const chartData = albumsToChartData(sortedAlbums, albumSortField);

  let yMin = 0;
  let yMax = 0;

  if (albumSortField === 'releaseDate') {
    const years = chartData.map((d) => d.avg); // avg is year, update this to value
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    yMin = minYear - 1; // 1 year before earliest
    yMax = maxYear + 1; // 1 year after latest
  }
  // Determine Y-axis label
  // const yAxisLabel =
  //   albumSortField === 'avgTrackLength'
  //     ? 'Avg Track Length (min)'
  //     : 'Release Year';

  return (
    <>
      <div className="info-hover" style={{ color: '#82ca9d' }}>
        <div className="info-hover-label">About this page</div>
        <div className="info-hover-popup">
          <h4>Music Analytics Dashboard</h4>
          <p>
            Search for an artist to view their albums and compare average track
            lengths visually using the bar chart.
          </p>
          <p>Click an album to expand and view individual track durations.</p>
          <p>
            This page integrates with the Spotify Web API to retrieve artist,
            album, and track data in real time. The application processes this
            data through a custom backend service and visualizes album
            statistics, such as average track length, using an interactive
            chart. While Spotify provides extensive music metadata, some details
            such as release dates, album classifications, or market availability
            may vary depending on Spotify’s catalog data.
          </p>
        </div>
      </div>

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
            onKeyDown={(e) =>
              e.key === 'Enter' && query.trim() && searchArtistHandler()
            }
          />
          <button className="search-button" onClick={searchArtistHandler}>
            Search
          </button>
        </div>

        {/* Artist Results */}
        {artists.length > 0 && (
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
        )}

        {/* Chart Section */}
        {selectedArtist && !albumsLoading && chartData.length > 0 && (
          <>
            {/* <button
              className="sort-button"
              onClick={() =>
                setAlbumSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              disabled={loadingTracks}
            >
              Sort by Avg Track Length ({albumSortOrder === 'asc' ? '↑' : '↓'})
            </button> */}
            <div className="sort-controls">
              <select
                value={albumSortField}
                onChange={(e) => setAlbumSortField(e.target.value as any)}
                disabled={loadingTracks}
              >
                <option value="avgTrackLength">Average Track Length</option>
                <option value="releaseDate">Release Date</option>
              </select>

              <button
                className="sort-button"
                onClick={() =>
                  setAlbumSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                disabled={loadingTracks}
              >
                {albumSortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>

            <div
              className="chart-container"
              style={{ width: '100%', height: 300 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 50 }}
                >
                  <CartesianGrid className="chart-grid" />
                  <XAxis
                    dataKey="name"
                    angle={-80}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fontSize: 12, fill: '#fff' }}
                    tickMargin={50}
                    tickFormatter={(name) =>
                      name.length > 15 ? name.slice(0, 15) + '…' : name
                    }
                  />
                  <YAxis
                    className="chart-axis"
                    label={{
                      value:
                        albumSortField === 'avgTrackLength'
                          ? 'Avg Track Length (min)'
                          : 'Release Year',
                      angle: -90,
                      position: 'insideLeft',
                      offset: -15,
                      fill: '#fff',
                    }}
                    domain={
                      albumSortField === 'releaseDate'
                        ? [yMin, yMax]
                        : undefined
                    }
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || payload.length === 0)
                        return null;
                      return (
                        <div className="chart-tooltip-wrapper">
                          <div className="tooltip-label">{label}</div>
                          <div className="tooltip-value">
                            {albumSortField === 'avgTrackLength'
                              ? `${payload[0].value.toFixed(2)} min`
                              : chartData.find((d) => d.name === label)
                                  ?.label || ''}
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
                {sortedAlbums.map((album) => (
                  <li
                    className="artist-item"
                    key={album.id}
                    onClick={() => toggleAlbum(album.id)}
                    //style={{ cursor: 'pointer' }}
                  >
                    <strong>{album.title}</strong>
                    {album.releaseDate && ` (${album.releaseDate})`}
                    {album.averageTrackLengthMs !== undefined &&
                      ` – Avg: ${(album.averageTrackLengthMs / 60000).toFixed(
                        2
                      )} min`}
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
    </>
  );
}
