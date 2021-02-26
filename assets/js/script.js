var searchValue;
let date = moment().format("MMMM Do YYYY");
function weather() {
    let request = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&units=imperial&appid=a6019d4e4ae43293483d986afb1c5eec";

    fetch(request)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
          console.log(data);
          for (let i = 0; i < 40; i += 8) {
            let days = data.list[i];
            let cardInit = $("<div>").addClass("whole");
            let cardDay = $("<div>").text(days.dt_txt.slice(0, 10));
            let degree = $("<p>").text(Math.round(days.main.temp) + "˚F");
            let humid = $("<p>").text("Humidity: " + days.main.humidity + "%");
            let wind = $("<p>").text(" Wind Speed: " + Math.round(days.wind.speed) + " mph");
            let icon = $("<img>").addClass("rounded mx-auto");
            icon.attr("src", "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png");
            $("#forecast").append(cardInit.append(cardDay, degree, icon, humid, wind));
        }
    })
}
$("#search-button").on("click", function(event) {
    //keeps the page from reloading when new data is gathered
    event.preventDefault();
    searchValue = $("#search-value").val().trim();
    weather();
})
