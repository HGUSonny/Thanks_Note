// 현재 날씨를 가져오고 1시간 동안 캐싱하는 서비스
// Open‑Meteo API는 무료이며 등록이나 키가 필요 없다 [oai_citation:3‡open-meteo.com](https://open-meteo.com/#:~:text=Free%20Weather%20API).

export async function getCurrentWeather() {
  try {
    const cached = localStorage.getItem("currentWeather");
    const cachedTime = localStorage.getItem("currentWeatherTime");
    const now = Date.now();
    // 1시간 이내 캐시가 있으면 재사용
    if (cached && cachedTime && now - parseInt(cachedTime, 10) < 3600 * 1000) {
      return JSON.parse(cached);
    }

    // 포항 좌표 [oai_citation:4‡time-ok.com](https://time-ok.com/coordinates/pohang#:~:text=Latitude%2C%20Longitude%3A%2036)로 Open‑Meteo API 호출
    const url =
      "https://api.open-meteo.com/v1/forecast?" +
      "latitude=36.0292&longitude=129.365" +
      "&current=temperature_2m,weather_code,wind_speed_10m,is_day" +
      "&timezone=Asia%2FSeoul";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather");
    const data = await response.json();
    const current = data.current;
    const weather = {
      temperature: current.temperature_2m,
      weatherCode: current.weather_code,
      windSpeed: current.wind_speed_10m,
      isDay: Boolean(current.is_day),
    };
    // 캐싱
    localStorage.setItem("currentWeather", JSON.stringify(weather));
    localStorage.setItem("currentWeatherTime", String(now));
    return weather;
  } catch {
    return null; // 실패 시 null 반환
  }
}
