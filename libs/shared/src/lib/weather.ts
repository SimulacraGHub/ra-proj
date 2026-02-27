// libs/shared/src/lib/weather.ts
export type WeatherData = {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string; id: number }[];
};

export async function getWeatherData(city: string): Promise<WeatherData> {
  const apiKey = "bfcb0f5aeb183f8493d9206815be19ae";
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  );
  if (!res.ok) throw new Error("Could not fetch weather data");
  return res.json();
}

export function kelvinToCelsius(kelvin: number): string {
  return (kelvin - 273.15).toFixed(1);
}

// export function displayError(message: string) {
//   console.error(message);
// }