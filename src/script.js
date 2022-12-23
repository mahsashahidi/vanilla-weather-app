//http://www.wdisseny.com/lluna/?lang=en
let apiKey = "701f06352d61835bc4fc894e7b084629";
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

//date using new Date()
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekDay = days[now.getDay()];

let hours = now.getHours();
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let date = now.getDate();
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];

let timeNow = `${weekDay} ${hours}:${minutes} ${date} ${month}`;

let time = document.querySelector("#exact-time");
time.innerHTML = timeNow;

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
function weatherForecast(response) {
  console.log(response);

  //city name
  let city = document.querySelector("#city-name");
  city.innerHTML = response.data.name;
  //temperature
  let temperature = response.data.main.temp;
  let tempHTML = document.querySelector("#temp-number");
  tempHTML.innerHTML = Math.round(temperature);
  let farenheit = document.querySelector("#fahrenheit");

  farenheit.addEventListener("click", () => {
    let F = Math.round((Math.round(temperature) * 9) / 5 + 32);
    tempHTML.innerHTML = F;
  });

  let celsius = document.querySelector("#celsius");
  celsius.addEventListener("click", () => {
    tempHTML.innerHTML = Math.round(temperature);
  });

  //wind
  let wind = response.data.wind.speed;
  let windHTML = document.querySelector("#wind");
  windHTML.innerHTML = Math.round(wind);
  //humidity
  let humidity = response.data.main.humidity;
  let humidityHTML = document.querySelector("#humidity");
  humidityHTML.innerHTML = Math.round(humidity);

  //description
  let description = response.data.weather[0].main;
  let descriptHTML = document.querySelector("#description");
  descriptHTML.innerHTML = description;
}
function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(weatherForecast);
}
function handleSubmit(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#searched-city").value;
  search(searchedCity);
}

let cities = document.querySelector("#city-searching");
cities.addEventListener("submit", handleSubmit);

function realtimePose(position) {
  console.log("here", position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(weatherForecast);
}
function realtimeWeather() {
  navigator.geolocation.getCurrentPosition(realtimePose);
}

let here = document.querySelector("#here");
here.addEventListener("click", realtimeWeather);

search("Tehran");
