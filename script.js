const CONFIG = {
  backgroundMode: 'photo', // 'photo' | 'gradient'
  maxDailyDays: 16,
  maxHourlyItems: 72,
  defaultLocation: { lat: 40.8518, lon: 14.2681, label: 'Napoli, Italia' }
};

const geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
const forecastBaseUrl = 'https://api.open-meteo.com/v1/forecast';

const el = {
  body: document.body,
  searchForm: document.getElementById('searchForm'),
  cityInput: document.getElementById('cityInput'),
  geoBtn: document.getElementById('geoBtn'),
  currentIcon: document.getElementById('currentIcon'),
  currentTemp: document.getElementById('currentTemp'),
  currentLabel: document.getElementById('currentLabel'),
  feelsLike: document.getElementById('feelsLike'),
  windSpeed: document.getElementById('windSpeed'),
  precipitation: document.getElementById('precipitation'),
  humidity: document.getElementById('humidity'),
  locationName: document.getElementById('locationName'),
  dailyTitle: document.getElementById('dailyTitle'),
  heroTitle: document.getElementById('heroTitle'),
  heroSubtitle: document.getElementById('heroSubtitle'),
  currentTime: document.getElementById('currentTime'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  maxMin: document.getElementById('maxMin'),
  rainChance: document.getElementById('rainChance'),
  hourlyTitle: document.getElementById('hourlyTitle'),
  hourlyHint: document.getElementById('hourlyHint'),
  dailyList: document.getElementById('dailyList'),
  hourlyList: document.getElementById('hourlyList'),
  status: document.getElementById('status'),
  statusText: document.getElementById('statusText'),
  dailyTemplate: document.getElementById('dailyItemTemplate'),
  hourlyTemplate: document.getElementById('hourlyItemTemplate')
};

const weatherMap = {
  0: { label: 'Sereno', emoji: '☀️', bgDay: 'bg-clear-day', bgNight: 'bg-clear-night' },
  1: { label: 'Prevalentemente sereno', emoji: '🌤️', bgDay: 'bg-clear-day', bgNight: 'bg-clear-night' },
  2: { label: 'Parzialmente nuvoloso', emoji: '⛅', bgDay: 'bg-cloudy-day', bgNight: 'bg-cloudy-night' },
  3: { label: 'Coperto', emoji: '☁️', bgDay: 'bg-cloudy-day', bgNight: 'bg-cloudy-night' },
  45: { label: 'Nebbia', emoji: '🌫️', bgDay: 'bg-cloudy-day', bgNight: 'bg-cloudy-night' },
  48: { label: 'Nebbia ghiacciata', emoji: '🌫️', bgDay: 'bg-cloudy-day', bgNight: 'bg-cloudy-night' },
  51: { label: 'Pioviggine leggera', emoji: '🌦️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  53: { label: 'Pioviggine', emoji: '🌦️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  55: { label: 'Pioviggine intensa', emoji: '🌧️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  56: { label: 'Pioggia gelata leggera', emoji: '🌧️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  57: { label: 'Pioggia gelata', emoji: '🌧️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  61: { label: 'Pioggia leggera', emoji: '🌦️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  63: { label: 'Pioggia moderata', emoji: '🌧️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  65: { label: 'Pioggia intensa', emoji: '🌧️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  66: { label: 'Pioggia gelata', emoji: '🌧️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  67: { label: 'Pioggia gelata intensa', emoji: '🌧️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  71: { label: 'Neve leggera', emoji: '🌨️', bgDay: 'bg-snow-day', bgNight: 'bg-snow-night' },
  73: { label: 'Neve', emoji: '🌨️', bgDay: 'bg-snow-day', bgNight: 'bg-snow-night' },
  75: { label: 'Neve intensa', emoji: '❄️', bgDay: 'bg-snow-day', bgNight: 'bg-snow-night' },
  77: { label: 'Cristalli di neve', emoji: '❄️', bgDay: 'bg-snow-day', bgNight: 'bg-snow-night' },
  80: { label: 'Rovesci leggeri', emoji: '🌦️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  81: { label: 'Rovesci', emoji: '🌧️', bgDay: 'bg-rain-day', bgNight: 'bg-rain-night' },
  82: { label: 'Rovesci forti', emoji: '⛈️', bgDay: 'bg-storm-day', bgNight: 'bg-storm-night' },
  85: { label: 'Rovesci di neve', emoji: '🌨️', bgDay: 'bg-snow-day', bgNight: 'bg-snow-night' },
  86: { label: 'Rovesci di neve forti', emoji: '❄️', bgDay: 'bg-snow-day', bgNight: 'bg-snow-night' },
  95: { label: 'Temporale', emoji: '⛈️', bgDay: 'bg-storm-day', bgNight: 'bg-storm-night' },
  96: { label: 'Temporale con grandine', emoji: '⛈️', bgDay: 'bg-storm-day', bgNight: 'bg-storm-night' },
  99: { label: 'Temporale forte con grandine', emoji: '⛈️', bgDay: 'bg-storm-day', bgNight: 'bg-storm-night' }
};

function weatherInfo(code = 0) {
  return weatherMap[code] || { label: 'Meteo non disponibile', emoji: '🌍', bgDay: 'bg-cloudy-day', bgNight: 'bg-cloudy-night' };
}

function setStatus(message, type = 'loading') {
  el.status.classList.remove('is-loading', 'is-ready', 'is-error');
  if (type === 'error') {
    el.status.classList.add('is-error');
  } else if (type === 'ready') {
    el.status.classList.add('is-ready');
  } else {
    el.status.classList.add('is-loading');
  }
  el.statusText.textContent = message;
}

function formatTemp(value) {
  return `${Math.round(value)}°`;
}

function formatHour(dateString, timeZone) {
  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone
  }).format(new Date(dateString));
}

function formatDay(dateString, timeZone) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('it-IT', { weekday: 'long', timeZone }).format(date);
}

function formatDateLabel(dateString, timeZone) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', timeZone }).format(date);
}

function applyBackground(weatherCode, isDay) {
  const info = weatherInfo(weatherCode);
  const themeClass = isDay ? 'theme-day' : 'theme-night';
  const weatherClass = isDay ? info.bgDay : info.bgNight;
  const modeClass = CONFIG.backgroundMode === 'gradient' ? 'bg-mode-gradient' : 'bg-mode-photo';
  el.body.className = `${themeClass} ${weatherClass} ${modeClass}`;
}

function buildForecastUrl(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day',
    hourly: 'temperature_2m,precipitation_probability,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
    forecast_days: String(CONFIG.maxDailyDays),
    timezone: 'auto'
  });
  return `${forecastBaseUrl}?${params.toString()}`;
}

async function fetchWeather(lat, lon, locationLabel = 'Posizione attuale') {
  try {
    setStatus('Recupero dati meteo in corso...', 'loading');
    const response = await fetch(buildForecastUrl(lat, lon));
    if (!response.ok) throw new Error('Risposta API non valida');
    const data = await response.json();
    renderWeather(data, locationLabel);
    setStatus(`Dati aggiornati per ${locationLabel}.`, 'ready');
  } catch (error) {
    console.error(error);
    setStatus('Impossibile recuperare i dati meteo. Controlla la connessione o riprova.', 'error');
  }
}

function renderWeather(data, locationLabel) {
  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;
  const timeZone = data.timezone;
  const currentInfo = weatherInfo(current.weather_code);

  el.locationName.textContent = locationLabel;
  el.dailyTitle.textContent = `Previsioni ${Math.min(CONFIG.maxDailyDays, daily.time.length)} giorni`;
  el.heroTitle.textContent = currentInfo.label;
  el.heroSubtitle.textContent = `${locationLabel} • lat ${Number(data.latitude).toFixed(2)}, lon ${Number(data.longitude).toFixed(2)}`;
  el.currentTemp.textContent = formatTemp(current.temperature_2m);
  el.currentLabel.textContent = currentInfo.label;
  el.currentIcon.textContent = currentInfo.emoji;
  el.feelsLike.textContent = formatTemp(current.apparent_temperature);
  el.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  el.precipitation.textContent = `${Number(current.precipitation).toFixed(1)} mm`;
  el.humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  el.currentTime.textContent = formatHour(current.time, timeZone);
  el.sunrise.textContent = formatHour(daily.sunrise[0], timeZone);
  el.sunset.textContent = formatHour(daily.sunset[0], timeZone);
  el.maxMin.textContent = `${formatTemp(daily.temperature_2m_max[0])} / ${formatTemp(daily.temperature_2m_min[0])}`;
  el.rainChance.textContent = `${Math.round(daily.precipitation_probability_max[0] ?? 0)}%`;
  el.hourlyHint.textContent = `Fuso orario: ${timeZone}`;
  applyBackground(current.weather_code, Boolean(current.is_day));

  renderDaily(daily, timeZone);
  renderHourly(hourly, timeZone);
}

function renderDaily(daily, timeZone) {
  el.dailyList.innerHTML = '';
  daily.time.slice(0, CONFIG.maxDailyDays).forEach((dateString, index) => {
    const fragment = el.dailyTemplate.content.cloneNode(true);
    const row = fragment.querySelector('.day-row');
    const info = weatherInfo(daily.weather_code[index]);
    fragment.querySelector('.day-name').textContent = `${capitalize(formatDay(dateString, timeZone))} • ${formatDateLabel(dateString, timeZone)}`;
    fragment.querySelector('.day-desc').textContent = `${info.emoji} ${info.label}`;
    fragment.querySelector('.day-temp').textContent = `${formatTemp(daily.temperature_2m_max[index])} / ${formatTemp(daily.temperature_2m_min[index])}`;
    if (index === 0) row.style.borderColor = 'rgba(255,255,255,0.35)';
    el.dailyList.appendChild(fragment);
  });
}

function renderHourly(hourly, timeZone) {
  el.hourlyList.innerHTML = '';
  const now = Date.now();
  const upcomingIndexes = [];

  hourly.time.forEach((timeValue, index) => {
    if (new Date(timeValue).getTime() >= now && upcomingIndexes.length < CONFIG.maxHourlyItems) {
      upcomingIndexes.push(index);
    }
  });

  if (upcomingIndexes.length === 0) {
    for (let i = 0; i < Math.min(CONFIG.maxHourlyItems, hourly.time.length); i += 1) {
      upcomingIndexes.push(i);
    }
  }

  el.hourlyTitle.textContent = `Prossime ${upcomingIndexes.length} ore`;

  upcomingIndexes.forEach((index) => {
    const fragment = el.hourlyTemplate.content.cloneNode(true);
    const info = weatherInfo(hourly.weather_code[index]);
    fragment.querySelector('.hour-time').textContent = formatHour(hourly.time[index], timeZone);
    fragment.querySelector('.hour-icon').textContent = info.emoji;
    fragment.querySelector('.hour-temp').textContent = formatTemp(hourly.temperature_2m[index]);
    fragment.querySelector('.hour-rain').textContent = `Pioggia ${Math.round(hourly.precipitation_probability[index] ?? 0)}%`;
    el.hourlyList.appendChild(fragment);
  });
}

async function searchCity(query) {
  const params = new URLSearchParams({ name: query, count: '1', language: 'it', format: 'json' });
  const response = await fetch(`${geocodingUrl}?${params.toString()}`);
  if (!response.ok) throw new Error('Ricerca città fallita');
  const data = await response.json();
  if (!data.results?.length) throw new Error('Nessuna località trovata');
  return data.results[0];
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

el.searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = el.cityInput.value.trim();
  if (!query) {
    setStatus('Inserisci una città prima di cercare.', 'error');
    return;
  }

  try {
    setStatus(`Cerco ${query}...`, 'loading');
    const result = await searchCity(query);
    const label = [result.name, result.admin1, result.country].filter(Boolean).join(', ');
    fetchWeather(result.latitude, result.longitude, label);
  } catch (error) {
    console.error(error);
    setStatus(error.message, 'error');
  }
});

el.geoBtn.addEventListener('click', () => {
  requestGeolocation();
});

function requestGeolocation() {
  if (!navigator.geolocation) {
    setStatus('Geolocalizzazione non supportata dal browser.', 'error');
    return;
  }

  setStatus('Recupero posizione in corso...', 'loading');
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => fetchWeather(coords.latitude, coords.longitude, 'Posizione attuale'),
    () => {
      setStatus('Accesso alla posizione negato. Carico una città di default.', 'error');
      fetchWeather(CONFIG.defaultLocation.lat, CONFIG.defaultLocation.lon, CONFIG.defaultLocation.label);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

requestGeolocation();
