$(document).ready(function() {
    var APIkey = 'a459a0d90626d64320747c8a6737a0f4';
    var history = JSON.parse(localStorage.getItem("history")) || [];

    // grab reference to an item on the DOM
    
  for (var i = 0; i < history.length; i++) {
    createRow(history[i]);
  }
   
    $("#search-button").on("click", function(event) {
        event.preventDefault();
      console.log("click")
      // we should ba capturing the user input
      var city = $("#search-input").val();
      console.log("City: ", city);
      // clearing the input form
      $("#search-input").val("");
      weatherFunction(city);
      weatherForecast(city);
      updateHistory(city);
    });
    function updateHistory(city) {
        if (!history.includes(city)) {
          history.push(city);
          localStorage.setItem("history", JSON.stringify(history));
          createRow(city);
        }
      }
      function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $("#search-history").append(listItem);
      }

      $("#search-history").on("click", "li", function() {
        var city = $(this).text();
        weatherFunction(city);
        weatherForecast(city);
      });

function weatherFunction(city) {

    var currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;

    // How do we make our Asynchronous API Request
    fetch(currentWeatherURL)   // the FETCH method RETURNS a PROMISE
        .then(response => {
      
            console.log("API response: ", response);
            return response.json();
        })
        .then(data => {
            console.log("Current Weather Data: ", data);

            // lets dig into the returned data
            var cityName = data.name;
            var temp = data.main.temp;
            var humidity = data.main.humidity;
            var windSpeed = data.wind.speed;

            var currentDate = new Date().toLocaleDateString();
            var tempFahrenheit = (temp- 273.15) * 9 / 5 + 32;
            var windSpeedMph = metersPerSecondToMph(windSpeed);
            var humidityPercentage = humidity;

            console.log("Temp: ", tempFahrenheit);
            console.log("Humidity: ", humidityPercentage);
            console.log("Wind Speed: ", windSpeedMph);

            // update the DOM with the new data that we have
            $('#city-date').text(`${cityName} - ${currentDate}`);
            $('#temp').text(tempFahrenheit.toFixed(2) + "°F");
            $('#wind').text(`${windSpeedMph.toFixed(2)} mph`);
            $('#humidity').text(`${humidityPercentage}%`);

            getForecast(city);

        })
        .catch(error => {
            throw error;
        })

}

function weatherForecast(city) {

    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`;

    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            console.log('Forecast Data: ', data);

            var listData = data.list;
            var forecastContainer = $("#forecast");
            forecastContainer.empty();

            // loop thorugh each record and PULL OUT the records that match the TIME we want to forecast --> dt_txt: "date time"  --> dt_txt: "23-03-22 12:00:00"

            for (var i = 0; i < listData.length; i += 8) {
                var forecastRecord = listData[i];
                var date = forecastRecord.dt_txt.split(" ")[0];
                var iconCode = forecastRecord.weather[0].icon;
                var temperature = forecastRecord.main.temp;
                var windSpeed = forecastRecord.wind.speed;
                var humidity = forecastRecord.main.humidity;

                var tempFahrenheit = (temperature - 273.15) * 9 / 5 + 32;

                var forecastCard = $("<div>").addClass("card mb-3");
                var forecastCardBody = $("<div>").addClass("card-body");
                var forecastDate = $("<h5>").text(date);
                var forecastIcon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${iconCode}.png`);
                var forecastTemperature = $("<p>").text("Temperature: " + tempFahrenheit.toFixed(2) + "°F");
                var forecastWindSpeed = $("<p>").text("Wind Speed: " + windSpeed + " m/s");
                var forecastHumidity = $("<p>").text("Humidity: " + humidity + "%");


                forecastCardBody.append(forecastDate, forecastIcon, forecastTemperature, forecastWindSpeed, forecastHumidity);

                forecastCard.append(forecastCardBody);
                forecastContainer.append(forecastCard);
              }

        })
        .catch(error => {
            throw error;
        });
}


function metersPerSecondToMph(metersPerSecond) {
    return metersPerSecond * 2.237;
  }

});


 