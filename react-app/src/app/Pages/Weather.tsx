import * as WeatherLib from '@weather';
import '@styles/weather-styles.css';
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
      setError(null); // reset first
      setTimeout(() => setError('Please enter a city'), 0); // then set again
      setWeatherData(null);
      return;
    }

    try {
      setLoading(true); //  start loading
      const data = await WeatherLib.getWeatherData(city);
      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      setWeatherData(null);
      setError(null); // reset first
      setTimeout(() => setError(err.message), 50); // show GET error popup
      console.error(err.message);
    } finally {
      setLoading(false); // stop loading
    }
  }

  return (
    <>
      <div className="info-hover" style={{ color: '#82ca9d' }}>
        <div className="info-hover-label">About this page</div>
        <div className="info-hover-popup">
          <h4>Weather Search Dashboard</h4>

          <p>
            Search for a city to retrieve real-time weather data including
            temperature, humidity, and conditions.
          </p>

          <p>
            This page fetches data from the OpenWeather API via a backend
            service layer. The backend handles API communication and response
            formatting before passing structured data to the frontend.
          </p>

          <p>
            As this relies on external API data, responses may occasionally be
            incomplete, delayed, or unavailable depending on API limits or
            third-party service issues.
          </p>

          <p>Examples cities to try: Cape Town, Johannesburg, Miami</p>
        </div>
      </div>
      <div className="weather-container">
        {error && <p className="error-display">{error}</p>}
        <h1 className="weather-title">Weather Search Dashboard</h1>
        <form className="weather-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="city-input"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            className="get-weather-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>

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
    </>
  );
}
