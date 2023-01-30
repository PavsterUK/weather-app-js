const API_KEY = "9898e02d6af866ce7ab5c03326fcf48d";

async function getCoordinates(cityName) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  const response = await fetch(url);
  return await response.json();
}

async function getTodaysWeather(cityName) {
  if (cityName.length === 0) return;
  return getCoordinates(cityName).then(async (coords) => {
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0].lat}&lon=${coords[0].lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      return await response.json();
    }
  });
}

async function getFiveDaysForecast(cityName) {
  if (cityName.length === 0) return;
  return getCoordinates(cityName).then(async (coords) => {
    if (coords.length) {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0].lat}&lon=${coords[0].lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      let forecasts = [];

      //Only show forecast for one hour every 24 hours from current time.
      for (let i = 0; i < data.list.length; i += 8) {
        forecasts.push(data.list[i]);
      }

      return forecasts;
    }
  });
}

function weatherNowMarkup(dayWeatherData) {
  const year = dayWeatherData.dt_txt.substring(0, 4);
  const month = dayWeatherData.dt_txt.substring(5, 7);
  const day = dayWeatherData.dt_txt.substring(8, 10);
  const temperature = `Temp: ${dayWeatherData.main.temp} C`;
  const windSpeed = `Wind: ${dayWeatherData.wind.speed} KM/H`;
  const humidity = `Humidity: ${dayWeatherData.main.humidity} %`;

  const markup = `<div class="day-weather-card">
    <li><h3>${day}/${month}/${year}</h3></li>
    <li>${temperature}</li>
    <li>${windSpeed}</li>
    <li>${humidity}</li>
  </div>`;

  return markup;
}

function fiveDaysForecastMarkup(weatherData) {
  let markup = "";

  for (dayData of weatherData) {
    markup += `
    <div class="day-weather-card">
      <li><h3>London</h3></li>
      <li>img</li>
      <li>Temp${dayData.main.temp}C\` </li>
      <li>Wind: ${dayData.wind.speed} KM/H</li>
      <li>Humidity: ${dayData.main.humidity} %</li>
    </div>
    `;
  }

  return markup;
}

function renderFiveDaysForecast(forecastData) {
  const fiveDaysForecast = $("#five-day-forecast");
}

getFiveDaysForecast("london").then((data) =>
  console.log(fiveDaysForecastMarkup(data))
);
