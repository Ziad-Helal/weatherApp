import { displayCurrentLocation, displayForecast } from "./index.js";
import { getForecast } from "./api.js";

const localSettings = JSON.parse(localStorage.getItem("settings"));
export let settings = localSettings || {
  forecastDays: 3,
  isCelsius: 1,
  isMetered: 1,
};

const forecastDaysSelect = document.getElementById("forecastDays");
const tempDegreeSelect = document.getElementById("tempDegree");
const lengthUnitSelect = document.getElementById("lengthUnit");

(function () {
  forecastDaysSelect.value = settings.forecastDays;
  forecastDaysSelect.addEventListener("change", (event) => {
    updateSettings(event, "forecastDays");
    getForecast(+event.target.value);
  });

  tempDegreeSelect.value = settings.isCelsius;
  tempDegreeSelect.addEventListener("change", (event) => {
    updateSettings(event, "isCelsius");
    displayCurrentLocation();
    displayForecast();
  });

  lengthUnitSelect.value = settings.isMetered;
  lengthUnitSelect.addEventListener("change", (event) => {
    updateSettings(event, "isMetered");
    displayCurrentLocation();
  });
})();

function updateSettings(event, setting) {
  settings[setting] = +event.target.value;
  localStorage.setItem("settings", JSON.stringify(settings));
}
