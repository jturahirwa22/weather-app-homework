document.getElementById("searchBtn").addEventListener("click", getWeather);

const apiUrl = 'https://goweather.herokuapp.com/weather/';

async function getWeather() {
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value.trim();
  const weatherCard = document.getElementById('weatherCard');
  const error = document.getElementById('error');

  // Reset UI states
  weatherCard.classList.add('hidden');
  error.classList.add('hidden');
  error.textContent = '';

  if (!city) {
    error.textContent = 'Please enter a city name.';
    error.classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}${city}`);
    const data = await response.json();

    // Validate response
    if (!data || !data.temperature || data.temperature.trim() === '') {
      throw new Error('Invalid or missing data');
    }

    displayWeather(data, city);
    storeSearchHistory(city);

    // Show weather card and hide error
    error.classList.add('hidden');
    weatherCard.classList.remove('hidden');
  } catch (err) {
    console.error('Fetch or data error:', err);
    error.textContent = 'City not found or invalid input. Please try again!';
    error.classList.remove('hidden');
    weatherCard.classList.add('hidden');
  }
}

function displayWeather(data, city) {
  const cityName = document.getElementById('cityName');
  const temp = document.getElementById('temp');
  const wind = document.getElementById('wind');
  const description = document.getElementById('description');
  const weatherIcon = document.getElementById('weatherIcon');

  cityName.textContent = city;
  temp.textContent = `Temperature: ${data.temperature}`;
  wind.textContent = `Wind: ${data.wind}`;
  description.textContent = `Description: ${data.description}`;

  // Update icon
  const icon = getWeatherIcon(data.description);
  weatherIcon.src = icon;
  weatherIcon.alt = data.description;

  // Set background based on temperature
  const tempValue = parseInt(data.temperature);
  if (!isNaN(tempValue)) {
    if (tempValue <= 15) {
      document.body.style.backgroundColor = '#85C1E9'; // cold
    } else if (tempValue <= 25) {
      document.body.style.backgroundColor = '#FAD7A0'; // mild
    } else {
      document.body.style.backgroundColor = '#F1948A'; // hot
    }
  }
}

function getWeatherIcon(description = '') {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('cloud')) return 'https://img.icons8.com/ios-filled/50/cloud.png';
  if (lowerDesc.includes('rain')) return 'https://img.icons8.com/ios-filled/50/rain.png';
  if (lowerDesc.includes('sun')) return 'https://img.icons8.com/ios-filled/50/sun.png';
  return 'https://img.icons8.com/ios-filled/50/partly-cloudy-day.png'; // default
}

function storeSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

  if (!history.includes(city)) {
    history.push(city);
    if (history.length > 3) history.shift(); // keep last 3
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
    li.tabIndex = 0;
    li.title = 'Click to search again';
    li.addEventListener('click', () => {
      document.getElementById('cityInput').value = city;
      getWeather();
    });
    searchHistory.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
  displaySearchHistory(history);
});
