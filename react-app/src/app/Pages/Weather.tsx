import * as WeatherLib from '../../../../libs/shared/src/lib/weather';
import '../Styles/weather-styles.css';
import React, { useState } from 'react';

export function Weather() {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherLib.WeatherData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!city) {
      setError('Please enter a city');
      setWeatherData(null);
      return;
    }

    try {
      setLoading(true); //  start loading
      const data = await WeatherLib.getWeatherData(city);
      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setWeatherData(null);
      console.error(err.message);
    } finally {
      setLoading(false); // stop loading
    }
  }

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather Search Dashboard</h1>
      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="city-input"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="get-weather-button" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {error && <p className="error-display">{error}</p>}

      {weatherData && (
        <div className="weather-card">
          <h1 className="city-display">{weatherData.name}</h1>
          <p className="temperature-display">
            {WeatherLib.kelvinToCelsius(weatherData.main.temp)}°C
          </p>
          <p className="humidity-display">
            Humidity: {weatherData.main.humidity}%
          </p>
          <p className="description-display">
            {weatherData.weather[0].description}
          </p>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Fetching weather data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
