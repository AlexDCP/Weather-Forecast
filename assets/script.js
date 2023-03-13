// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var apiKey = "aa8193195e53ae687af6138a4eac0137";
var searchButton = document.getElementById('startsearch');


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
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    var iconCode = data.list[0].weather[0].icon
                    var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`
                    var todayForecast = $(`
                    <div class="card-body d-flex justify-content-between">
                        <h4 class="today">${data.city.name}</h4>
                        <img class="icon" src="${iconUrl}">
                        <p class="card-text weather">Temp:${data.list[0].main.temp}F°</p>
                        <p class="card-text humidity">Humidity:${data.list[0].main.humidity}%</p>
                        <p class="card-text windspeed">Wind:${data.list[0].wind.speed}MPH</p>
                    </div>
                `)
                    $('.todaysweather').append(todayForecast);
                    console.log(data);
                    var fiveDayArray = data.list.filter(day => day.dt_txt.includes('12:00:00'));
                    console.log(fiveDayArray);
                    for (var i = 0; i < fiveDayArray.length; i++) {
                        var currentTime = new Date(fiveDayArray[i].dt_txt).toLocaleString().split(',')[0];
                        console.log(currentTime);
                        var iconCode = fiveDayArray[i].weather[0].icon
                        var iconPic = `https://openweathermap.org/img/w/${iconCode}.png`
                        console.log(fiveDayArray[i].weather)


                        var fiveDayCard = $(`
                        <div class="card col-2 m-2 w-22 bg-primary">
                            <div class="card-body">
                            <h4 class="time">${currentTime}</h4>
                            <img class="icon" src="${iconPic}">
                            <p class="card-text weather">Temp:${fiveDayArray[i].main.temp}F°</p>
                            <p class="card-text humidity">Humidity:${fiveDayArray[i].main.humidity}%</p>
                            <p class="card-text windspeed">Wind:${fiveDayArray[i].wind.speed} MPH</p>
                            </div>
                        </div>
                        
                        `);
                        $('.fivedaycontainer').append(fiveDayCard);
                    }


                })
        });
};
// function to run your fetch
searchButton.addEventListener('click', getApi);