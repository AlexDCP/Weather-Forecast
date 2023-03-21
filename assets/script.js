var apiKey = "aa8193195e53ae687af6138a4eac0137";
var searchButton = document.getElementById('startsearch');


// encase this in a function
function getApi() {
    var searchInput = document.getElementById('citysearch').value;
    console.log(searchInput);
    var queryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + "&limit=5&appid=" + apiKey;



    fetch(queryUrl)
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (data) {
            var longitude = data[0].lon;
            var latitude = data[0].lat;
            var queryUrl2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;
            fetch(queryUrl2)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    var iconCode = data.list[0].weather[0].icon
                    var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`
                    //this is the template literal creating the current day forecast 
                    var todayForecast = $(`
                    <div class="card-body d-flex justify-content-between">
                        <h4 class="today">Today's Weather in:${data.city.name}</h4>
                        <img class="icon" src="${iconUrl}">
                        <p class="card-text weather">Temp:${data.list[0].main.temp}F°</p>
                        <p class="card-text humidity">Humidity:${data.list[0].main.humidity}%</p>
                        <p class="card-text windspeed">Wind:${data.list[0].wind.speed}MPH</p>
                    </div>
                `)
                    $('.todaysweather').append(todayForecast);
                    console.log(data);
                    //filter is used to target the days by noon to then create and array that we can pull info on each day in the five day forecast
                    var fiveDayArray = data.list.filter(day => day.dt_txt.includes('12:00:00'));
                    console.log(fiveDayArray);
                    for (var i = 0; i < fiveDayArray.length; i++) {
                        var currentTime = new Date(fiveDayArray[i].dt_txt).toLocaleString().split(',')[0];
                        console.log(currentTime);
                        var iconCode = fiveDayArray[i].weather[0].icon
                        var iconPic = `https://openweathermap.org/img/w/${iconCode}.png`
                        console.log(fiveDayArray[i].weather)

                        //this is the template literal creating the five day forecast    
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
    // this is where the local storage gets saved in 'searchedCities' making sure not to store the data if it already present with the if statement and !
    var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
    if (!searchedCities.includes(searchInput)) {
        searchedCities.push(searchInput);
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
    }

};
// the || stands for or, showing if it is an empty object it will not run.
function displaySearchedCities() {
    var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
    var searchedCityContainer = document.getElementById('searched-cities');
    searchedCityContainer.innerHTML = '';
    for (var i = 0; i < searchedCities.length; i++) {
        var cityButton = document.createElement('button');
        cityButton.innerHTML = searchedCities[i];
        cityButton.classList.add('btn', 'btn-primary', 'm-2');
        cityButton.addEventListener('click', function (event) {
            //not sure if the append is needed, however this is used to clear the html for any new button clicks
            $('.todaysweather',).empty().append();
            $('.fivedaycontainer').empty().append();


            document.getElementById('citysearch').value = event.target.innerHTML;
            getApi();
        });
        searchedCityContainer.appendChild(cityButton);
    }
}

window.addEventListener('load', displaySearchedCities);
searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    getApi();
    displaySearchedCities();
    // this is to clear the html before a new search finishes
    $('.todaysweather',).empty().append();
    $('.fivedaycontainer').empty().append();
});
