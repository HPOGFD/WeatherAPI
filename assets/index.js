async function fetchWeather() {
    // Step a. Get the search input and reference the section to display data
    let searchInput = document.getElementById('search').value; // User-provided city name
    const weatherDataSection = document.getElementById("weather-data"); // Section to show weather info
    weatherDataSection.style.display = "block"; // Make the section visible

    const apiKey = "645d99b432eba7e93f0d2c9ae63373c9"; // OpenWeather API key

    // Step b. Check if input is empty, show an error message and exit
    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
            <br>
            <h2>Cannot leave blank</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
        return; // Stop execution if no input is provided
    }

    // Step c. Get latitude and longitude from the Geocoding API
    async function getLonAndLat() {
        const countryCode = 1; // Country code, adjust if necessary
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

        const response = await fetch(geocodeURL); // Fetch geocode data from API

        // Step d. Check if the response is successful
        if (!response.ok) {
            console.log("Bad response! ", response.status); // Log response errors
            return; // Stop execution if API call fails
        }

        const data = await response.json(); // Parse JSON response
        if (data.length == 0) {
            // Handle cases where no location is found
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <br>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>`;
            return;
        } else {
            return data[0]; // Return the first matching location data
        }
    }

    // Step e. Fetch weather data using the latitude and longitude
    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lon}&lon=${lat}&appid=${apiKey}`;

        const response = await fetch(weatherURL); // Fetch weather data from API

        // Step f. Parse and display weather data
        const data = await response.json(); // Parse JSON response
        weatherDataSection.style.display = "flex"; // Adjust section display
        weatherDataSection.innerHTML = `
            <br>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
            <div>
                <br>
                <h2>${data.name}</h2>
                <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 218)}°C</p>
                <p><strong>Description:</strong> ${data.weather[0].description}</p>
          </div>`;
    }

    // Step g. Clear the input field and chain function calls
    document.getElementById("search").value = ""; // Clear the search input field
    const geocodeData = await getLonAndLat(); // Get geocode data
    if (geocodeData) {
        getWeatherData(geocodeData.lon, geocodeData.lat); // Fetch weather data if geocode succeeds
    }
}
