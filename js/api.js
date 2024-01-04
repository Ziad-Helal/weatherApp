import {
  displayCurrentLocation,
  displayForecast,
  displayLocationsSuggestions,
  getLocalTime,
  loading,
} from "./index.js";
import { settings } from "./settings.js";

export let user = {};

const apiKey = "749a8cfca2ac4842850192058240201";
const baseUrl = "https://api.weatherapi.com/v1/";
const currentWeatherMethod = "current.json";
const forecastMethod = "forecast.json";
const searchMethod = "search.json";

export function getInitialUserForecast() {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => getLocation("coords", [coords.latitude, coords.longitude]),
    ({ message }) => alert(message)
  );
}

export async function getLocation(method, arg) {
  let link;
  switch (method) {
    case "id":
      link = `${baseUrl}${currentWeatherMethod}?key=${apiKey}&q=id:${arg}`;
      break;
    case "coords":
      link = `${baseUrl}${currentWeatherMethod}?key=${apiKey}&q=${arg[0]},${arg[1]}`;
      break;
    default:
      break;
  }

  loading(true, "currentLocation");
  user = await fetch(link)
    .then((response) => response.json().then((data) => data))
    .catch((error) => alert(error));
  user.current.lastRefresh = getLocalTime();

  loading(false, "currentLocation");
  displayCurrentLocation();
  getForecast(settings.forecastDays);
}

export async function getLocationsSuggestions(query) {
  loading(true, "locationsSuggestions");

  const locationsSuggestions = await fetch(
    `${baseUrl}${searchMethod}?key=${apiKey}&q=${query}`
  )
    .then((response) => response.json().then((data) => data))
    .catch((error) => alert(error));

  loading(false, "locationsSuggestions");
  displayLocationsSuggestions(locationsSuggestions);
}

export async function getForecast(days = 1) {
  const lastLocationReferesh = user.current.lastRefresh;
  loading(true, "forecast");

  user = await fetch(
    `${baseUrl}${forecastMethod}?key=${apiKey}&q=${user.location.name}&days=${days}`
  )
    .then((response) => response.json().then((data) => data))
    .catch((error) => alert(error));
  user.current.lastRefresh = lastLocationReferesh;
  user.forecast.lastRefresh = getLocalTime();

  loading(false, "forecast");
  displayForecast();
}
