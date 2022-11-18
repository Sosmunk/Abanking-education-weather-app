let widgetCounter = 1;

// Скрипт для включения cors прокси
(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

async function getWeather(id){
    let widgetContainer = document.getElementById(`weather-${id}`)
    let widgets = widgetContainer.querySelector(".widgets-list");
    widgets.innerHTML = "";
    addWeatherElements(widgetContainer, widgets)
}
async function addWeatherElements(widgetContainer, widgets){
    try{
        const coordinates = getCoordinates(widgetContainer);
        addTextWidget("Загрузка данных...", widgetContainer);
        const fetchData = await fetchWeatherData(coordinates);
        widgets.innerHTML = "";
        addWidget(getWeatherImage(fetchData.weather.current_weather.weathercode), widgetContainer);
        addTextWidget(fetchData.weather.current_weather.temperature + "°", widgetContainer);
        addTextWidget(`Скорость ветра: ${fetchData.weather.current_weather.windspeed} м/с`, widgetContainer);
        addTextWidget(fetchData.time.time, widgetContainer);
        initializeMap(coordinates,widgets);
    }
    catch(err){
        widgets.innerHTML = "";
        addTextWidget(err,widgetContainer);
    }
}
function getCoordinates(widgetContainer){
    const latitude = widgetContainer.querySelector("input[name='latitude']").value.replace(',','.');
    const longitude = widgetContainer.querySelector("input[name='longitude']").value.replace(',','.');
    if ((isNaN(latitude) || isNaN(parseFloat(latitude)))
     || (isNaN(longitude)) || isNaN(parseFloat(longitude))){
        throw new Error("Введенные данные некорректны");
    }
    else{
        return {latitude, longitude};
    }
}
function getWeatherImage(weathercode){
    const weatherImage = new Image(100,100);
    weatherImage.src = weatherMatch[weathercode];
    weatherImage.style = "display: inline-block";
    return weatherImage;
}
function addTextWidget(text, widgetContainer){
    const element = document.createElement("p");
    element.style.textAlign = "center";
    element.textContent = text;
    addWidget(element,widgetContainer);
}
function addWidget(htmlChild, widgetContainer){
    const li = document.createElement("li");
    li.appendChild(htmlChild);
    widgetContainer.querySelector(".widgets-list").appendChild(li);
}
async function fetchWeatherData(coordinates){
        const [weather, time] = await Promise.all([
            fetch(`https://cors-anywhere.herokuapp.com/https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true&weathercode`)
            .then((res) =>{
                if (res.ok){
                    return res.json()
                }
                throw new Error(res.status)
            }),
            fetch(`https://cors-anywhere.herokuapp.com/https://timeapi.io/api/Time/current/coordinate?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`)
            .then((res) => {
                if (res.ok){
                    return res.json()
                }
                throw new Error(res.status)
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

function addWeatherApp(){
    widgetCounter += 1
    container = document.getElementById('weather-app-container')
    container.insertAdjacentHTML('beforeend', `
    <div class="widget-container" id="weather-${widgetCounter}">
        <div class="input">
            <p class="input-name">Широта<input class="input-field" type="text" name="latitude"></p>
            <p class="input-name">Долгота<input class="input-field" type="text" name="longitude" style="margin-left: 41px"></p>
            <button class="button" onclick="getWeather('${widgetCounter}')">Показать погоду</button>
        </div>
        <div class="widgets">
            <ul class="widgets-list">
                
            </ul>
        </div>
    </div>`)
}

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