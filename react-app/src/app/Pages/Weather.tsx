import '@styles/weather-styles.css';
import { useWeather, kelvinToCelsius } from '@weather';

export function Weather() {
  const { city, setCity, weatherData, loading, error, fetchWeather } =
    useWeather();

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
            service layer.
          </p>
          <p>Example cities: Cape Town, Johannesburg, Miami</p>
        </div>
      </div>

      <div className="weather-container">
        {error && <p className="error-display">{error}</p>}

        <h1 className="weather-title">Weather Search Dashboard</h1>
        <form className="weather-form" onSubmit={fetchWeather}>
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
              {kelvinToCelsius(weatherData.main.temp)}°C
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
