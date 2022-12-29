//http://www.wdisseny.com/lluna/?lang=en
let apiKey = "at39f76400o033e4bc6d122638679404";
function load_moon_phases(obj, callback) {
  var gets = [];
  for (var i in obj) {
    gets.push(i + "=" + encodeURIComponent(obj[i]));
  }
  gets.push("LDZ=" + new Date(obj.year, obj.month - 1, 1) / 1000);
  var xmlhttp = new XMLHttpRequest();
  var url = "https://www.icalendar37.net/lunar/api/?" + gets.join("&");
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      callback(JSON.parse(xmlhttp.responseText));
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
function example_1(moon) {
  var day = new Date().getDate();
  var html =
    "<div>" +
    "<b>" +
    "<div>" +
    "</div>" +
    "<div shadow>" +
    moon.phase[day].svg +
    "</div>" +
    `Moon Phase` +
    "</br>" +
    "<div>" +
    moon.phase[day].phaseName +
    " " +
    "" +
    (moon.phase[day].isPhaseLimit
      ? ""
      : Math.round(moon.phase[day].lighting) + "%") +
    "</div>" +
    "</div>";
  document.getElementById("ex1").innerHTML = html;
}
var configMoon = {
  lang: "en",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  size: 70,
  lightColor: "rgb(255,255,245)",
  shadeColor: "black",
  texturize: true,
};
load_moon_phases(configMoon, example_1);

function formartDate(timestamp) {
  let now = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let weekDay = days[now.getDay()];

  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let timeNow = `Last updated: ${weekDay} ${hours}:${minutes}`;
  return timeNow;
}
function convert2F(tempNumber) {
  let tempHTML = document.querySelector("#temp-number");
  let F = Math.round((tempNumber * 9) / 5 + 32);
  tempHTML.innerHTML = F;
}

function convert2C(tempNumber) {
  let tempHTML = document.querySelector("#temp-number");
  //let C = Math.round((temp.innerHTML - 32) * 5/9)
  tempHTML.innerHTML = tempNumber;
}

//citySearch
function weatherReport(response) {
  //time
  let date = new Date(response.data.time * 1000);
  let time = formartDate(date);
  let timeElement = document.querySelector("#exact-time");
  timeElement.innerHTML = time;
  //city name
  let city = document.querySelector("#city-name");
  city.innerHTML = response.data.name;
  //temperature
  let temperature = response.data.main.temp;
  let tempElement = document.querySelector("#temp-number");
  tempElement.innerHTML = `${Math.round(temperature)}°`;
  let farenheit = document.querySelector("#fahrenheit");

  farenheit.addEventListener("click", () => {
    let F = Math.round((Math.round(temperature) * 9) / 5 + 32);
    tempElement.innerHTML = `${F}°`;
  });

  let celsius = document.querySelector("#celsius");
  celsius.addEventListener("click", () => {
    tempElement.innerHTML = `${Math.round(temperature)}°`;
  });

  //wind
  let wind = response.data.wind.speed;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(wind);
  //humidity
  let humidity = response.data.temperature.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = Math.round(humidity);

  //description
  let description = response.data.condition.description;
  let descriptElement = document.querySelector("#description");
  descriptElement.innerHTML = description;
}
function search(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(weatherReport);
}
function handleSubmit(event) {
  event.preventDefault();
  let searchedCityElement = document.querySelector("#searched-city").value;
  search(searchedCityElement);
}

function realtimePose(position) {
  console.log("here", position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(weatherReport);
}
function realtimeWeather() {
  navigator.geolocation.getCurrentPosition(realtimePose);
}

let here = document.querySelector("#here");
here.addEventListener("click", realtimeWeather);

let cities = document.querySelector("#city-searching");
cities.addEventListener("submit", handleSubmit);

search("Tehran");
