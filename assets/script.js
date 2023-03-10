// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var apiKey = "aa8193195e53ae687af6138a4eac0137";
var searchButton = document.getElementById('startsearch');

// var searchInput = "miami";

// in place of miami, you would want to capture your search input's value

// Write your HARDCODED queryURL
// var apiKey = "aa8193195e53ae687af6138a4eac0137";


// encase this in a function
function getApi() {
    var searchInput = document.getElementById('citysearch').value;
    console.log(searchInput);
    var queryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + "&limit=5&appid=" + apiKey;

    fetch(queryUrl)
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (data) {
            var longitude = data[0].lon;
            var latitude = data[0].lat;
            var queryUrl2 = "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;
            fetch(queryUrl2)
            .then(function (response){
                return response.json();
            })
            .then(function(data){
                console.log(data);
                // for (let i = 0; i < data.list.length; i+7){
                //     console.log(data.list[i]);

                // }
            })
        });
};
// function to run your fetch
searchButton.addEventListener('click', getApi);
    // function to display data