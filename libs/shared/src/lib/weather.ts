import { useState } from 'react';

export type WeatherData = {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string; id: number }[];
};

export async function getWeatherData(city: string): Promise<WeatherData> {
  const apiKey = 'bfcb0f5aeb183f8493d9206815be19ae';
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  );
  if (!res.ok) throw new Error('Could not fetch weather data');
  return res.json();
}

export function kelvinToCelsius(kelvin: number): string {
  return (kelvin - 273.15).toFixed(1);
}

// ---------------------------
// Hook to handle state & operations
// ---------------------------
export function useWeather() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeather(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!city) {
      setError('Please enter a city');
      setWeatherData(null);
      return;
    }

    try {
      setLoading(true);
      const data = await getWeatherData(city);
      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      setWeatherData(null);
      setError(err.message || 'Failed to fetch weather');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return { city, setCity, weatherData, loading, error, fetchWeather };
}
