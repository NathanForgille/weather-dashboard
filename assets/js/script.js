//global variable the user provides from their search
let searchValue;
let citySearched = localStorage.getItem("city");
// the main function to fetch the initial weather forecast data and append it to the page
function weather() {
    //personal weather api with a searchValue key from the user
    let request = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&units=imperial&appid=a6019d4e4ae43293483d986afb1c5eec";
    //get that data baby
    fetch(request)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            // this line empties the forecast and allows the new search to populate in the previous searches place
            $("#forecast").empty();
            $("#today").empty();
            // this line grabs the latitude and longitude for the uvIndex function
            let latitude = data.city.coord.lat;
            let longitude = data.city.coord.lon;
            uvIndex(latitude, longitude);
            // variable to increse id for cardInit by 1
            let j = 0;
            //this for loop runs through the array, slices the time slots to provide days, and appends them using DOM manipulation
            for (let i = 0; i < 40; i += 8) {
                let days = data.list[i];
                // id for cardInit to increse by 1 so that the uvIndex can follow the id
                let cardInit = $(`<div id="day-${j}">`).addClass("whole");
                j++
                let cardDay = $("<div>").text(days.dt_txt.slice(0, 10).split("-").reverse().join("/"));
                let degree = $("<p>").text(Math.round(days.main.temp) + "˚F");
                let humid = $("<p>").text("Humidity: " + days.main.humidity + "%");
                let wind = $("<p>").text(" Wind Speed: " + Math.round(days.wind.speed) + " mph");
                let icon = $("<img>").addClass("rounded mx-auto");
                icon.attr("src", "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png");
                $("#forecast").append(cardInit.append(cardDay, degree, icon, humid, wind));
            }
        });
}

function uvIndex(latitude, longitude) {
    // UV Index wdata call usi OneCall API
    let uvRequest = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=a6019d4e4ae43293483d986afb1c5eec";
    //get that data baby
    fetch(uvRequest)
        .then(function (uvResponse) {
            return uvResponse.json();
        }).then(function (uvData) {
            let todaysDate = moment().format('dddd, MMMM Do, YYYY');
            let today= $("<h1>").text(searchValue[0].toUpperCase() + searchValue.slice(1) + " " + todaysDate);
            let temperature = $("<p>").text(Math.round(uvData.current.temp) + "˚F");
            let humidity = $("<p>").text("Humidity: " + uvData.current.humidity + "%");
            let windSpeed = $("<p>").text(" Wind Speed: " + Math.round(uvData.current.wind_speed) + " mph");
            let uvI= $("<p>").text("UV Index: " + uvData.current.uvi);
            $("#today").append(today, temperature, humidity, windSpeed, uvI)
            for (let i = 0; i < 8; i++) {
                var uv = uvData.daily[i].uvi;
                var color = "";
                if (uv <= 2.99) {
                    color = "chartreuse";
                } else if (uv <= 5.99) {
                    color = "yellow";
                } else if (uv <= 7.99) {
                    color = "orange";
                } else if (uv <= 10.99) {
                    color = "red";
                } else {
                    color = "purple";
                }
                $(`#day-${i}`).append("<p id='uv-paragraph'>UV Index:</p><div class='uvI' id='uv-index' style='color: " + color + "'>" + uv + "</div>")
            }
        });
}
function searchedCities() {
      let ls = ($("#citiesSearched").append($("<p class='city-searched'>").text("Weather changes! Go ahead and double check it!")));
      ls.append($("<li>").val(searchValue));
}
searchedCities();

// event listeners
$("#search-button").on("click", function (event) {
    //keeps the page from reloading when new data is gathered
    event.preventDefault();
    searchValue = $("#search-value").val().trim();
    weather();
    localStorage.setItem('city', (searchValue));
    $("#search-value").val("");
})