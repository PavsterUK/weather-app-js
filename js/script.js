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
    const today = moment().format("DDD");

    //Only show forecast for one hour every 24 hours from request time.
    for (let i = 0; i < data.list.length; i++) {
      if (
        moment(data.list[i].dt_txt).format("DDD") > today &&
        moment(data.list[i].dt_txt).format("hh:mm A") === "12:00 PM"
      ) {
        forecasts.push(data.list[i]);
      }
    }
    return forecasts;
  }
}

const getWeatherIcon = (weatherConditionCode) => {
  return `http://openweathermap.org/img/wn/${weatherConditionCode}@2x.png`;
};

function getDayWeatherMarkup(weatherData) {
  const weatherIconUrl = getWeatherIcon(weatherData.weather[0].icon);
  const dateNow = moment(weatherData.dt_txt).format("dddd, MMMM Do YYYY");
  const markup = `
  <div class="day-weather-card">
    <li>${dateNow}</li>
    <img src="${weatherIconUrl}" />
    <li>Temp: ${weatherData.main.temp} C</li>
    <li>Wind: ${weatherData.wind.speed} KM/H</li>
    <li>Humidity: ${weatherData.main.humidity} %</li>
  </div>`;
  return markup;
}

function renderTodayWeather(weatherData) {
  weatherNow.html(getDayWeatherMarkup(weatherData));
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
  const places = JSON.parse(localStorage.getItem("placeName")) || [];
  const placeButtonMarkup = `
    <button onclick="onSearchButtonClickEventHandler(event)">
      ${placeName}
    </button>`;
  places.push(placeButtonMarkup);
  localStorage.setItem("placeName", JSON.stringify(places));
  searchHistory.html(places);
}

init("London");
