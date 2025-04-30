document.getElementById("searchBtn").addEventListener("click", getWeather);

const apiUrl = 'https://goweather.herokuapp.com/weather/';

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return; // Ignore empty input

  const weatherCard = document.getElementById('weatherCard');
  const error = document.getElementById('error');
  const searchHistory = document.getElementById('searchHistory');

  // Show loading
  weatherCard.classList.add('hidden');
  error.classList.add('hidden');

  try {
    const response = await fetch(`${apiUrl}${city}`);
    const data = await response.json();

    if (data.temperature === undefined) {
      throw new Error('City not found');
    }

    displayWeather(data);
    storeSearchHistory(city);

    error.classList.add('hidden');
    weatherCard.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    error.classList.remove('hidden');
  }
}

function displayWeather(data) {
  const cityName = document.getElementById('cityName');
  const temp = document.getElementById('temp');
  const wind = document.getElementById('wind');
  const description = document.getElementById('description');
  const weatherIcon = document.getElementById('weatherIcon');

  cityName.textContent = data.city;
  temp.textContent = `Temperature: ${data.temperature}`;
  wind.textContent = `Wind: ${data.wind}`;
  description.textContent = `Description: ${data.description}`;

  // Set weather icon based on description
  const icon = getWeatherIcon(data.description);
  weatherIcon.src = icon;

  // Set background color based on temperature
  const temperatureValue = parseInt(data.temperature);
  if (temperatureValue <= 15) {
    document.body.style.backgroundColor = 'blue'; // Cold
  } else if (temperatureValue <= 25) {
    document.body.style.backgroundColor = 'yellow'; // Warm
  } else {
    document.body.style.backgroundColor = 'red'; // Hot
  }
}

function getWeatherIcon(description) {
  if (description.includes('cloudy')) {
    return 'https://img.icons8.com/ios-filled/50/000000/cloud.png';
  } else if (description.includes('rain')) {
    return 'https://img.icons8.com/ios-filled/50/000000/rain.png';
  } else if (description.includes('sun')) {
    return 'https://img.icons8.com/ios-filled/50/000000/sun.png';
  } else {
    return 'https://img.icons8.com/ios-filled/50/000000/partly-cloudy-day.png'; // Default
  }
}

function storeSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
  if (!history.includes(city)) {
    history.push(city);
    if (history.length > 3) history.shift(); // Keep only last 3 searches
    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
  }
  displaySearchHistory(history);
}

function displaySearchHistory(history) {
  const searchHistory = document.getElementById('searchHistory');
  searchHistory.innerHTML = '';
  history.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
      document.getElementById('cityInput').value = city;
      getWeather();
    });
    searchHistory.appendChild(li);
  });
}

// Load previous search history on page load
document.addEventListener("DOMContentLoaded", () => {
  const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
  displaySearchHistory(history);
});
