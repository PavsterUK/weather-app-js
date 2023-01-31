const API_KEY = "9898e02d6af866ce7ab5c03326fcf48d";
const fiveDaysForecast = $("#five-day-forecast");
const weatherNow = $(".weather-now");

async function getPlaceCoords(placeName) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=1&appid=${API_KEY}`;
  const response = await fetch(url);
  return await response.json();
}

async function getTodayWeather(placeName) {
  if (placeName.length === 0) return;
  return getPlaceCoords(placeName).then(async (coords) => {
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0].lat}&lon=${coords[0].lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      return await response.json();
    }
  });
}

async function getFiveDaysForecast(placeName) {
  if (placeName.length === 0) return;
  return getPlaceCoords(placeName).then(async (coords) => {
    if (coords) {
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

function getDayWeatherMarkup(weatherData, placeInfoMarkup = "") {
  const markup = `
  <div class="day-weather-card">
    ${placeInfoMarkup}
    <li>Temp: ${dayWeatherData.main.temp} C</li>
    <li>Wind: ${dayWeatherData.wind.speed} KM/H</li>
    <li>Humidity: ${dayWeatherData.main.humidity} %</li>
  </div>`;
  return markup;
}

function renderTodayWeather(weatherData) {
  const year = weatherData.dt_txt.substring(0, 4);
  const month = weatherData.dt_txt.substring(5, 7);
  const day = weatherData.dt_txt.substring(8, 10);
  const placeInfoMarkup = `<li><h3>${day}/${month}/${year}</h3></li>`;

  weatherNow.append(getDayWeatherMarkup(weatherData, placeInfoMarkup));
}

function getFiveDaysForecastMarkup(weatherData) {
  let markup = "";

  for (dayData of weatherData) {
    markup += getDayWeatherMarkup(dayData);
  }

  return markup;
}

function onSearchButtonClickEventHandler(event) {
  const placeName = event.target.value;
  getPlaceCoords(placeName).then((coords) => {
    getTodayWeather(coords).then((todayWeatherData) => {
      renderTodayWeather(todayWeatherData);
    });

    getFiveDaysForecast(coords).then(fiveDayWeatherData => {

    })

  });
}
