const API_KEY = "9898e02d6af866ce7ab5c03326fcf48d";
const fiveDaysForecast = $("#five-day-forecast");
const weatherNow = $(".weather-now");
const searchHistory = $("#history");

async function getPlaceCoords(placeName) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=1&appid=${API_KEY}`;
  const response = await fetch(url);
  return await response.json();
}

async function getTodayWeather(coords) {
  if (coords) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0].lat}&lon=${coords[0].lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    return await response.json();
  }
}

async function getFiveDaysForecast(coords) {
  if (coords) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0].lat}&lon=${coords[0].lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    let forecasts = [];

    //Only show forecast for one hour every 24 hours from request time.
    for (let i = 0; i < data.list.length; i += 8) {
      forecasts.push(data.list[i]);
    }
    return forecasts;
  }
}

function getDayWeatherMarkup(weatherData, placeInfoMarkup = "") {
  const markup = `
  <div class="day-weather-card">
    ${placeInfoMarkup}
    <li>Temp: ${weatherData.main.temp} C</li>
    <li>Wind: ${weatherData.wind.speed} KM/H</li>
    <li>Humidity: ${weatherData.main.humidity} %</li>
  </div>`;
  return markup;
}

const _unixToDate = (unixStamp) => {
  return moment.unix(unixStamp).format("dddd, Do MMM YYYY");
};

function renderTodayWeather(weatherData) {
  const placeName = weatherData.name;
  const dateNow = _unixToDate(weatherData.dt);
  const placeInfoMarkup = `<li><h3>${placeName} (${dateNow})</h3></li>`;

  weatherNow.html(getDayWeatherMarkup(weatherData, placeInfoMarkup));
}

function renderFiveDaysForecast(weatherData) {
  fiveDaysForecast.html(getFiveDaysForecastMarkup(weatherData));
}

function getFiveDaysForecastMarkup(weatherData) {
  let markup = "";

  for (dayData of weatherData) {
    markup += getDayWeatherMarkup(dayData);
  }

  return markup;
}

function onSearchButtonClickEventHandler() {
  const placeName = $("#user-input").val();
  init(placeName);
}

function init(placeName) {
  syncLocalStorage(placeName);
  getPlaceCoords(placeName).then((coords) => {
    getTodayWeather(coords).then((todayWeatherData) => {
      renderTodayWeather(todayWeatherData);
    });

    getFiveDaysForecast(coords).then((fiveDayWeatherData) => {
      renderFiveDaysForecast(fiveDayWeatherData);
    });
  });
}

function syncLocalStorage(placeName) {
  if (!localStorage.getItem("placeName")) {
    localStorage.setItem("placeName", JSON.stringify([]));
  }
  const places = JSON.parse(localStorage.getItem("placeName"));
  const placeButtonMarkup = `
    <button onclick="onSearchButtonClickEventHandler(event)">
      ${placeName}
    </button>`;
  places.push(placeButtonMarkup);
  localStorage.setItem("placeName", JSON.stringify(places));
  searchHistory.html(places);
}

init("London");
