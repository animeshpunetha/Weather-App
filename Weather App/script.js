const date = document.getElementById("date-time");
const apiKey = `63b71428d571f5ae1e3de6afc79b4b58`;
const apiURL = "https://api.openweathermap.org/data/2.5/weather?";
const temp = document.getElementById("temp");

let city = "delhi";
let CurrentUnit = "";
let hourlyWeek = "Week";

const searchbox = document.getElementById("query");
const searchbtn = document.getElementById("search");


// Function to set the weather icon based on the weather condition
function setWeatherIcon(weatherCondition) {
    const iconElement = document.querySelector(".weather-icon img");
    let iconUrl;

    // Map weather conditions to icon URLs
    switch (weatherCondition.toLowerCase()) {
        case "clear":
            iconUrl = "./images/sun.png";
            break;

        case "clouds":
            iconUrl="./images/clouds.png";
            break;

        case "mist":            
        iconUrl="./images/fog.png";
        break;

        case "haze":
            iconUrl="./images/fog.png";
            break;

        case "snow":
            iconUrl="./images/snow.png";
            break;
        case "rain":
            iconUrl = "./images/rain.png";
            break;

        case "thunderstorm":
            iconUrl = "./images/thunderstorm.png";
            break;

        case "drizzle":
            iconUrl = "./images/rain.png";
            break;

        case "smog":
            iconUrl = "fog.png";
            break;

        case "smoke":
            iconUrl = "fog.png";
            break;

        default:
            iconUrl = "./images/sun.png";
    }

    // Update the weather icon
    iconElement.src = iconUrl;
}



//update date and time

function getDateTime() 
{
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    


    let time = hour + ":" + minute;

    let days = [
        "Sunday",
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    time = now.toLocaleTimeString();
    date.textContent = now.toLocaleDateString();

    let daystring = days[now.getDay()];

    return `${daystring}, ${time}`;
}

function getDateTimeString(now) 
{
    return `${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;
}

setInterval(() => 
{
    date.textContent = getDateTime();
}, 1000);


//calling api to fetch details
async function checkWeather(city) 
{
    // get city details
    const response = await fetch(apiURL + `q=` +city+ `&appid=${apiKey}`);
    var data = await response.json();

    console.log(data);

    //fetch temp

    const temperatureK = data.main.temp;

    const temperatureC=temperatureK-273.15;

    const tempElement = document.getElementById("temp");

    tempElement.textContent = Math.round(temperatureC);

   
    const weatherCondition = data.weather[0].main;
    document.querySelector(".condition p").textContent=weatherCondition;

    setWeatherIcon(weatherCondition);   // Update weather icon

    // fetch humidity
    const humidity = data.main.humidity;
    document.querySelector(".precipitation p").textContent=humidity+" %";

    document.querySelector(".humidity").textContent=humidity+" %";

    if(humidity<55)
    {
        document.querySelector(".humidity-text").textContent="Dry";     
    }

    else if(humidity>=55 && humidity<65)
    {
        document.querySelector(".humidity-text").textContent="Medium";
    }

    else {
        document.querySelector(".humidity-text").textContent="High";
    }
    
    // update location name in location class
    const location = data.name;
    document.querySelector(".location p").textContent=location;
    //fetch & update wind staus
    const windStatus=data.wind.speed;
    document.querySelector(".wind-speed").textContent=windStatus+" m/s";

    if(windStatus<14)
    {
        document.querySelector(".wind-text").textContent="Gentle Breeze";   
    }

    else if (windStatus>=14 && windStatus<17)
     {
        document.querySelector(".wind-text").textContent="Strong Breeze";
     }

     else if(windStatus>=17 && windStatus<27.5)
     {
        document.querySelector(".wind-text").textContent="Strong Gale";
     }

     else if(windStatus>=27.5)
     {
        document.querySelector(".wind-text").textContent="Storm";
     }

     // fetch and update sunrise and sunset
    const sunrise=data.sys.sunrise;
    var sun_date=new Date(sunrise*1000);
    var sunhours=sun_date.getHours();
    var sunmins=sun_date.getMinutes();
    if (sunmins<10)
    {
        sunmins="0"+sunmins;
    }
    document.querySelector(".sunrise-time").textContent= sunhours+" : "+sunmins+" AM";

    //fetch visibility
    const visibility=data.visibility;
    if(visibility>=1000)
    {
        document.querySelector(".visibility").textContent=(visibility/1000)+" Km";

    }
    else 
    document.querySelector(".visibility").textContent=visibility+" m";

    // fetch real feel 
    const tempFeel=data.main.feels_like;
    const tempFeelC=Math.round(tempFeel-273.15);
    document.querySelector(".temp-feel").textContent=tempFeelC+ " ॰C";

    setWeatherIcon(weatherCondition);
}

searchbtn.addEventListener("submit", (event) => {
    event.preventDefault();
    checkWeather(searchbox.value);
});

searchbtn.addEventListener("keypress", (event) => {
    if(event.key==="Enter")
    {
    event.preventDefault();
    checkWeather(searchbox.value);
    }
});

// Initial weather check (you may want to default it to a specific city)
checkWeather("Delhi");



