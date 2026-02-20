const api_key = "18fb88d85c3bfad6fcd7e901b088b04b"

const searchInput = document.querySelector(".searchInput")

const locationEL = document.querySelector(".location")
const temperature = document.querySelector(".temp")
const conditionEl = document.querySelector(".condition")
const dataEl = document.querySelector(".date")

const highAndLow = document.querySelector(".highLow")

const metrics = document.querySelectorAll(".metric strong")

const sunriseEl = metrics[0];
const sunsetEl = metrics[1];
const uvEl = metrics[2];
const aqiEl = metrics[3];

const cards = document.querySelectorAll(".metricsRow .metricCard h2")
const humd = cards[0]
const windSpeed = cards[1]
const pressure = cards[2]
const visibilty = cards[3]

const loaderOverlay = document.querySelector(".loader-overlay")

function showLoader() {
    loaderOverlay.classList.add('active');
}
function hideLoader() {
    loaderOverlay.classList.remove('active');
}


function timeFormat(unix, timezone) {
    const milliseconds = (unix + timezone) * 1000;
    
    const date = new Date(milliseconds);
    
    const hours = date.getUTCHours();      
    const minutes = date.getUTCMinutes();  
    
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    
    return `${hoursStr}:${minutesStr}`;
}

function getCurrentDate() {

    const now = new Date();
    return now.toDateString("en-US", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit"
    })
}

function fetchWeather(city) {
    console.log("Fetching weather for:", city);
      showLoader();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`)

        .then(function (response) {
            if (!response.ok) {
                throw new Error("City not fount")
            }
            console.log("Weather data received:", response);
            return response.json()
        })
        .then(function (weatherData) {
            console.log("Parsed weather data:", weatherData);
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${api_key}`)

                .then(function (response) {
                    return response.json()
                })
                .then(function (airData) {
                    console.log("Air pollution data received:", airData);
                    updateUI(weatherData, airData)
                    setTimeout(hideLoader, 1000);
                })
        })
        .catch(function (error) {
            setTimeout(function() {
                hideLoader();
                alert(error.message);
            }, 1000);
        console.error(error);
    })
}

function updateUI(weather, air) {
    console.log("Updating UI with:", weather, air);

    locationEL.textContent = `${weather.name}, ${weather.sys.country}`
    temperature.textContent = Math.round(weather.main.temp)
    conditionEl.textContent = weather.weather[0].description
    dataEl.textContent = getCurrentDate()
    sunriseEl.textContent = timeFormat(weather.sys.sunrise, weather.timezone)
    sunsetEl.textContent = timeFormat(weather.sys.sunset, weather.timezone)
    const aqiMap = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    aqiEl.textContent = aqiMap[air.list[0].main.aqi - 1];
    
    highAndLow.textContent = `HIGH: ${weather.main.temp_max}° | LOW: ${weather.main.temp_min}°`;
    console.log("Updated highAndLow to:", highAndLow.textContent);
    highAndLow.textContent =`HIGH: ${(weather.main.temp_max)}° | LOW: ${(weather.main.temp_min)}°`
    
    humd.textContent = `${(weather.main.humidity)}%`
    windSpeed.textContent = `${(Math.round(weather.wind.speed))}m/s`
    pressure.textContent = `${weather.main.pressure}hPa`
    visibilty.textContent = `${weather.visibility}km
    `

}


searchInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        const city = searchInput.value.trim();
        console.log("User searched for:", city);

        if (city) {
            fetchWeather(city);
        }
    }
});

fetchWeather("Srinagar");


