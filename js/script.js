async function getCoordinates(cityName) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=9898e02d6af866ce7ab5c03326fcf48d`;
  const response = await fetch(url);
  const data = await response.json();

  return { lat: data[0].lat, lon: data[0].lon };
}

async function getTodayWeather(cityName) {
  const coords = await getCoordinates(cityName);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=9898e02d6af866ce7ab5c03326fcf48d&units=metric`;
  const response = await fetch(url);
  const weatherData = await response.json();

  return weatherData;
}

getTodayWeather("Chippenham").then(data => console.log(data));
