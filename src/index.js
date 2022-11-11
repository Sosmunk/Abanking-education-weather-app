// import {weatherMatch} from "./weather-match.js";
// console.log(weatherMatch)
const weatherMatch = {
    "0" : "./src/weather/icons8-sun-100.png",
    "1" : "./src/weather/icons8-sun-100.png",
    "2" : "./src/weather/icons8-partly-cloudy-day-100.png",
    "3" : "./src/weather/icons8-cloud-100.png",
    "45" : "./src/weather/icons8-fog-100.png",
    "48" : "./src/weather/icons8-fog-100.png",
    "51" : "./src/weather/icons8-light-rain-100.png",
    "53" : "./src/weather/icons8-light-rain-100.png",
    "55" : "./src/weather/icons8-light-rain-100.png",
    "56" : "./src/weather/icons8-light-rain-100.png",
    "57" : "./src/weather/icons8-light-rain-100.png",
    "61" : "./src/weather/icons8-light-rain-100.png",
    "63" : "./src/weather/icons8-rain-100.png",
    "65" : "./src/weather/icons8-heavy-rain-100.png",
    "66" : "./src/weather/icons8-light-rain-100.png",
    "67" : "./src/weather/icons8-heavy-rain-100.png",
    "71" : "./src/weather/icons8-light-snow-100.png",
    "73" : "./src/weather/icons8-snow-100.png",
    "75" : "./src/weather/icons8-snow-100.png",
    "80" : "./src/weather/icons8-light-rain-100.png",
    "81" : "./src/weather/icons8-rain-100.png",
    "82" : "./src/weather/icons8-heavy-rain-100.png",
    "85" : "./src/weather/icons8-light-snow-100.png",
    "86" : "./src/weather/icons8-snow-100.png",
    "95" : "./src/weather/icons8-storm-100.png",
    "96" : "./src/weather/icons8-storm-100.png",
    "99" : "./src/weather/icons8-storm-100.png",
}
const headers = new Headers();
headers.set("Access-Control-Allow-Origin", "*")
async function getWeather(id){
    let appContainer = document.getElementById(id)
    let widgets = appContainer.querySelector(".widgets-list");
    widgets.innerHTML = "";
    try{
        const coordinates = getCoordinates(appContainer);
        const fetchData = await fetchWeatherData(coordinates);
        console.log(fetchData.weather);
        addWidget(getWeatherImage(fetchData.weather.current_weather.weathercode), appContainer);
        addTextWidget(fetchData.weather.current_weather.temperature + "°", appContainer);
        addTextWidget(`Скорость ветра: ${fetchData.weather.current_weather.windspeed} м/с`, appContainer);
        addTextWidget(fetchData.time.time, appContainer);
        initializeMap(coordinates,widgets);
    }
    catch(err){
        addTextWidget(err,appContainer);
    }
}
function getCoordinates(appContainer){
    const latitude = appContainer.querySelector("input[name='latitude']").value.replace(',','.');
    const longitude = appContainer.querySelector("input[name='longitude']").value.replace(',','.');
    if ((isNaN(latitude) || isNaN(parseFloat(latitude)))
     || (isNaN(longitude)) || isNaN(parseFloat(longitude))){
        throw new Error("Incorrect input");
    }
    else{
        return {latitude, longitude};
    }
}
function getWeatherImage(weathercode){
    const weatherImage = new Image(100,100);
    weatherImage.src = weatherMatch[weathercode];
    weatherImage.style = "display: inline-block"
    return weatherImage;
}
function addTextWidget(text, appContainer){
    const element = document.createElement("p");
    element.style.textAlign = "center";
    element.textContent = text;
    addWidget(element,appContainer);
}
function addWidget(htmlChild, appContainer){
    const li = document.createElement("li");
    li.appendChild(htmlChild);
    appContainer.querySelector(".widgets-list").appendChild(li);
}
async function fetchWeatherData(coordinates){
        const [weather, time] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true&weathercode`)
            .then((res) =>{
                if (res.ok){
                    return res.json()
                }
                throw new Error("Ошибка соединения")
            }),
            fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`)
            .then((res) => {
                if (res.ok){
                    return res.json()
                }
                throw new Error("Ошибка соединения")
            })
        ]);

        return {weather,time}
    }
function initializeMap(coordinates, widgets){
    const ymap = document.createElement("div")
    ymap.className = "ymap"
    widgets.appendChild(ymap)
    var myMap = new ymaps.Map(ymap, {
        center: [coordinates.latitude, coordinates.longitude],
        zoom: 8,
    });
    var myPlaceMark = new ymaps.Placemark([coordinates.latitude, coordinates.longitude])
    myMap.geoObjects.add(myPlaceMark)
}