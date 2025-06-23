var searchInput = document.getElementById("search");
var rowData = document.getElementById("row");

var userLat = null;
var userLon = null;

async function search() {
    var query = searchInput.value.trim();

   if (query === '') {
    if (userLat && userLon) {
        getWeatherByCoords(userLat, userLon);
    }
    return; 
}



    try {
        var searchResponse = await fetch(`https://api.weatherapi.com/v1/search.json?key=c5e37c6e8af641caae8154640252306&q=${query}`);
        var searchData = await searchResponse.json();

        // حماية بسيطة لو مفيش نتائج
        var selected = searchData[0];
        if (!selected) return;

        var selectedCity = selected.name + ', ' + selected.country;

        var weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c5e37c6e8af641caae8154640252306&q=${selectedCity}&days=3`);
        var weatherData = await weatherResponse.json();

        displayWeather(weatherData);



    } catch (err) {
        console.log("❌ error:", err);
    }

}

function displayWeather(data) {
    var forecast = data.forecast.forecastday;
    var city = data.location.name;

    var daysNames = forecast.map(d => new Date(d.date).toLocaleDateString("en-US", { weekday: 'long' }));
    var dates =  forecast.map(d => 
        new Date(d.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short"
        })
        );

    var day1 = forecast[0];
    var day2 = forecast[1];
    var day3 = forecast[2];

    const cartoon = `
        <div class="col-lg-4 col-md-12 f-con">
            <div class="header d-flex justify-content-between align-items-center">
                <h4>${daysNames[0]}</h4>
                <h4>${dates[0]}</h4>
            </div>
            <div class="contents">
                <div class="location-city">
                    <h5>${city}</h5>
                </div>
                <div class="degree">
                    <h1>${day1.day.maxtemp_c}°C</h1>
                    <img src="https:${day1.day.condition.icon}" alt="">
                </div>
                <div class="custom">${day1.day.condition.text}</div>
                <div class="footer-imag">
                    <span><img src="images/icon-umberella.png" alt=""> ${day1.day.daily_chance_of_rain || 0}%</span>
                    <span><img src="images/icon-wind.png" alt=""> ${day1.day.maxwind_kph}  km/h</span>
                    <span><img src="images/icon-compass.png" alt=""> ${day1.day.condition.text} </span>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-12 sec-con text-center">
            <div class="header">
                <h4>${daysNames[1]}</h4>
            </div>
            <div class="contents py-3">
                <div class="content-image">
                    <img src="https:${day2.day.condition.icon}" alt="">
                </div>
                <div class="degree py-3">
                    <p>${day2.day.maxtemp_c}°C</p>
                    <span>${day2.day.mintemp_c}°C</span>
                    <h4>${day2.day.condition.text}</h4>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-12 trd-con text-center">
            <div class="header">
                <h4>${daysNames[2]}</h4>
            </div>
            <div class="contents py-3">
                <div class="content-image">
                    <img src="https:${day3.day.condition.icon}" alt="">
                </div>
                <div class="degree py-3">
                    <p>${day3.day.maxtemp_c}°C</p>
                    <span>${day3.day.mintemp_c}°C</span>
                    <h4>${day3.day.condition.text}</h4>
                </div>
            </div>
        </div>
    `;

    rowData.innerHTML = cartoon;
}


window.addEventListener("load", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            userLat = position.coords.latitude;
            userLon = position.coords.longitude;

            await getWeatherByCoords(userLat, userLon);
        }, (err) => {
            console.error("🛑 Failed to get location", err);
        });
    } else {
        console.log("Geolocation not supported 😢");
    }
});
async function getWeatherByCoords(userLat, userlon) {
    try {
        var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c5e37c6e8af641caae8154640252306&q=${userLat},${userlon}&days=3`);

        const data = await response.json();

        displayWeather(data);

    } catch (err) {
        console.error("❌ Error getting weather:", err);
    }
}


function clearForm(){
    searchInput.value='';

}
