const weatherMatch = {
    "0" : "./weather/icons8-sun-100.png",
    "1" : "./weather/icons8-sun-100.png",
    "2" : "./weather/icons8-partly-cloudy-day-100.png",
    "3" : "./weather/icons8-cloud-100.png",
    "45" : "./weather/icons8-fog-100.png",
    "48" : "./weather/icons8-fog-100.png",
    "51" : "./weather/icons8-light-rain-100.png",
    "53" : "./weather/icons8-light-rain-100.png",
    "55" : "./weather/icons8-light-rain-100.png",
    "56" : "./weather/icons8-light-rain-100.png",
    "57" : "./weather/icons8-light-rain-100.png",
    "61" : "./weather/icons8-light-rain-100.png",
    "63" : "./weather/icons8-rain-100.png",
    "65" : "./weather/icons8-heavy-rain-100.png",
    "66" : "./weather/icons8-light-rain-100.png",
    "67" : "./weather/icons8-heavy-rain-100.png",
    "71" : "./weather/icons8-light-snow-100.png",
    "73" : "./weather/icons8-snow-100.png",
    "75" : "./weather/icons8-snow-100.png",
    "80" : "./weather/icons8-light-rain-100.png",
    "81" : "./weather/icons8-rain-100.png",
    "82" : "./weather/icons8-heavy-rain-100.png",
    "85" : "./weather/icons8-light-snow-100.png",
    "86" : "./weather/icons8-snow-100.png",
    "95" : "./weather/icons8-storm-100.png",
    "96" : "./weather/icons8-storm-100.png",
    "99" : "./weather/icons8-storm-100.png",
}
async function getWeather(id){
    const coordinates = getCoordinates(id);
    let test = document.getElementById(id)
    console.log(test)
    let widgets = document.getElementById("widgets")
    widgets.innerHTML = ""
    const fetchData = await fetchCoordinatesData(coordinates)
    console.log(fetchData.weather)
    addWidget(getWeatherImage(fetchData.weather.current_weather.weathercode));
    addTextWidget(fetchData.weather.current_weather.temperature + "°");
    addTextWidget("Скорость ветра: " + fetchData.weather.current_weather.windspeed)
    addTextWidget(fetchData.time.time)
}
function getCoordinates(id){
    const latitude = document.getElementById("latitude").value.replace(',','.')
    const longitude = document.getElementById("longitude").value.replace(',','.')
    if ((isNaN(latitude) || isNaN(parseFloat(latitude)))
     || (isNaN(longitude)) || isNaN(parseFloat(longitude))){
        throw new Error("Incorrect input")
    }
    else{
        return {latitude, longitude}
    }
}
function getWeatherImage(weathercode){
    const weatherImage = new Image(100,100);
    weatherImage.src = weatherMatch[weathercode];
    return weatherImage;
}
function addTextWidget(text){
    const element = document.createElement("p");
    element.style.textAlign = "center";
    element.textContent = text;
    addWidget(element);
}
function addWidget(htmlChild){
    const li = document.createElement("li");
    li.appendChild(htmlChild)
    document.getElementById("widgets").appendChild(li);
}
async function fetchCoordinatesData(coordinates){
    const [weather, time] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true&weathercode`).then((res) => res.json()),
        fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`).then((res) => res.json())
    ]);
    return {weather,time}
    }