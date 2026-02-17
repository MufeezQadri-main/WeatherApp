const apiKey = "18fb88d85c3bfad6fcd7e901b088b04b"

const searchBtn = document.getElementById("searchBtn")
const city = document.getElementById("cityInput")
const weatherResult = document.getElementById("weatherResult")

searchBtn.addEventListener("click", getWeather)

function getWeather() {
    const getCity = city.value    

    if(getCity === ""){
        alert ("Enter a city name!!!")
        return 
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${getCity}&appid=${apiKey}&units=metric`

    fetch(url)
    .then (response => response.json())
    .then (weatherData => {
        displayWeather(weatherData)
        console.log(weatherData)
    })
    .catch(error => {
        console.log("Error")
    })
}

function displayWeather(weatherData){
    if(weatherData.cod === "404"){
        weatherResult.innerHTML = "City wasn't found"
        return
    }

    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    weatherResult.innerHTML = `
        <h2>${weatherData.name}</h2>
        <p>🌡 Temp: ${temperature}°C</p>
        <p>☁ Condition: ${description}</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p>💨 Wind Speed: ${windSpeed} m/s</p>
    `;
}