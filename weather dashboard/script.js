const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");

const weatherDescription =
    document.getElementById("weatherDescription");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");


searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});


cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city === "") {
            showError("Please enter a city name.");
            return;
        }

        getWeather(city);
    }
});


// Main weather function
async function getWeather(city) {

    try {

        errorMessage.textContent = "";

        loading.style.display = "block";

        weatherCard.style.display = "none";


     

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);


        if (!geoResponse.ok) {
            throw new Error("Unable to connect to server.");
        }


        const geoData = await geoResponse.json();


  
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found.");
        }


        // Get coordinates
        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const actualCity = location.name;


        

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;


        const weatherResponse = await fetch(weatherURL);


        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }


       
        const weatherData = await weatherResponse.json();


        
        const current = weatherData.current;


        

        cityName.textContent = actualCity;

        temperature.textContent =
            Math.round(current.temperature_2m);

        humidity.textContent =
            current.relative_humidity_2m + " %";

        windSpeed.textContent =
            current.wind_speed_10m + " km/h";

        feelsLike.textContent =
            Math.round(current.apparent_temperature) + "°C";


        
        weatherDescription.textContent =
            getWeatherDescription(current.weather_code);


        
        weatherCard.style.display = "block";

    }

    catch (error) {

        console.error(error);

        showError(error.message);

    }

    finally {

        loading.style.display = "none";

    }
}



function getWeatherDescription(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }

    if (code === 1 || code === 2) {
        return "🌤️ Mainly Clear";
    }

    if (code === 3) {
        return "☁️ Overcast";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️ Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "🌦️ Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "🌧️ Rain";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    }

    if (code >= 80 && code <= 82) {
        return "🌧️ Rain Showers";
    }

    if (code >= 95 && code <= 99) {
        return "⛈️ Thunderstorm";
    }

    return "🌍 Unknown Weather";
}


// Error function
function showError(message) {

    errorMessage.textContent = "❌ " + message;

    weatherCard.style.display = "none";
}