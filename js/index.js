import {
  getForecast,
  getInitialUserForecast,
  getLocation,
  getLocationsSuggestions,
  user,
} from "./api.js";
import { settings } from "./settings.js";

const searchInput = document.getElementById("searchInput");
const locationsSuggestionsSection = document.getElementById(
  "locationsSuggestions"
);
const currentLocationSection = document.getElementById("currentLocation");
const forecastSection = document.getElementById("forecast");

const loadingSpinner = `
  <div class="loading-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
`;

(function () {
  getInitialUserForecast();
  searchInput.addEventListener("input", suggestLocations);
})();

function suggestLocations(event) {
  const searchQuery = event.target.value.trim();
  searchQuery.length > 2
    ? getLocationsSuggestions(searchQuery)
    : clearLocationsSuggestions();
}

export function displayLocationsSuggestions(locations) {
  let locationsHtml = "";
  if (locations.length) {
    locationsHtml = `<p>${locations.length} Results</p>`;
    locations.forEach(({ id, name, country, region }) => {
      locationsHtml += `
      <div class="card location_card" data-id="${id}">
        <p>
          <span class="city">${name}</span><span class="country">, ${country}</span>
        </p>
        <span class="region">${region}</span>
      </div>
    `;
    });
    locationsSuggestionsSection.innerHTML = locationsHtml;

    const possiblelocations = document.querySelectorAll(
      "#locationsSuggestions .location_card"
    );
    possiblelocations.forEach((suggestion) => {
      suggestion.addEventListener("click", changeCurrentLocation);
    });
  } else clearLocationsSuggestions();
}

export function displayCurrentLocation() {
  const location = user.location;
  const currentWeather = user.current;
  const currentLocationHtml = `
    <div class="currentLocation_header">
      <h2>Current Location</h2>
      <span class="lastUpdated" title="Update the current location">Last Updated at ${
        user.current.lastRefresh
      }</span>
    </div>
    <div class="card location_card">
      <div class="location_card_header">
        <p>
          <span class="city">${location.name}</span
          ><span class="country">, ${location.country}</span>
        </p>
        <span class="region">${location.region}</span>
      </div>
      <div class="location_card_body">
        <div>
          <img
            src="${currentWeather.condition.icon}"
            width="64"
            alt="${currentWeather.condition.text}"
          />
          <div>
            <span class="temp">${
              settings.isCelsius
                ? `${currentWeather.temp_c}°C`
                : `${currentWeather.temp_f}°F`
            }</span>
            <span>${currentWeather.condition.text}</span>
          </div>
        </div>
        <div>
          <p class="card">Humidity: ${currentWeather.humidity}</p>
          <p class="card">Wind: Speed: ${
            settings.isMetered
              ? `${currentWeather.wind_kph}km/h`
              : `${currentWeather.wind_mph}m/h`
          } / Direction: ${currentWeather.wind_dir}</p>
        </div>
      </div>
    </div>
  `;
  currentLocationSection.innerHTML = currentLocationHtml;

  const lastUpdated = document.querySelector("#currentLocation .lastUpdated");
  lastUpdated.addEventListener("click", () => {
    const location = user.location;
    getLocation("coords", [location.lat, location.lon]);
  });
}

export function displayForecast() {
  let forecastHtml = `
    <div class="forecast_header">
      <h2>Forecast</h2>
      <span class="lastUpdated" title="Update the forecast"
        >Last Updated at ${user.forecast.lastRefresh}</span
      >
    </div>
  `;
  user.forecast.forecastday.forEach(({ date, day }) => {
    forecastHtml += `
      <div class="card">
        <img
          src="${day.condition.icon}"
          width="40"
          alt="${day.condition.text}"
        />
        <div class="forecast_body">
          <div>
            <span class="day">${getWeekDay(date)}</span>
            <span class="date">${getMonthDate(date)}</span>
          </div>
          <div>
            <span class="max_temp">${
              settings.isCelsius ? `${day.maxtemp_c}°C` : `${day.maxtemp_f}°F`
            }</span>
            <span class="avg_temp">${
              settings.isCelsius ? `${day.avgtemp_c}°C` : `${day.avgtemp_f}°F`
            }</span>
            <span class="min_temp">${
              settings.isCelsius ? `${day.mintemp_c}°C` : `${day.mintemp_f}°F`
            }</span>
          </div>
          <span>${day.condition.text}</span>
        </div>
      </div>
    `;
  });
  forecastSection.innerHTML = forecastHtml;

  const lastUpdated = document.querySelector("#forecast .lastUpdated");
  lastUpdated.addEventListener("click", () =>
    getForecast(settings.forecastDays)
  );
}

function changeCurrentLocation(event) {
  getLocation("id", event.target.getAttribute("data-id"));
  clearSearchInput();
  clearLocationsSuggestions();
}

export function clearLocationsSuggestions() {
  locationsSuggestionsSection.innerHTML = "";
}

function clearSearchInput() {
  searchInput.value = "";
}

export function loading(isLoading, loadingSection) {
  switch (loadingSection) {
    case "locationsSuggestions":
      isLoading
        ? insertLoadingSpinner(locationsSuggestionsSection)
        : removeLoadingSpinner(locationsSuggestionsSection);
      break;
    case "currentLocation":
      isLoading
        ? insertLoadingSpinner(currentLocationSection)
        : removeLoadingSpinner(currentLocationSection);
      break;
    case "forecast":
      isLoading
        ? insertLoadingSpinner(forecastSection)
        : removeLoadingSpinner(forecastSection);
      break;
    default:
      break;
  }
}

function insertLoadingSpinner(parentElement) {
  parentElement.innerHTML = loadingSpinner;
}

function removeLoadingSpinner(parentElement) {
  const spinner = parentElement.querySelector(".loading-ring");
  spinner.remove();
}

function getWeekDay(date) {
  const dayIndex = new Date(date).getDay();
  switch (dayIndex) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuseday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      break;
  }
}

function getMonthDate(date) {
  const day = new Date(date).getDate();
  const monthIndex = new Date(date).getMonth();
  let month;

  switch (monthIndex) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "Fabruary";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;
    default:
      break;
  }

  return `${day} ${month}`;
}

export function getLocalTime() {
  const houre = new Date().getHours();
  const minute = new Date().getMinutes();

  const houre12Based = houre < 12 ? houre : houre - 12;
  const finalMinutes = minute < 10 ? `0${minute}` : `${minute}`;
  const finalHoures = `${
    houre12Based < 10 ? `0${houre12Based}` : `${houre12Based}`
  }`;

  return `${finalHoures}:${finalMinutes} ${houre < 12 ? "AM" : "PM"}`;
}
