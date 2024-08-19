const date = document.getElementById("date-time");
const apiKey = `63b71428d571f5ae1e3de6afc79b4b58`;
const apiURL = "https://api.openweathermap.org/data/2.5/weather?";
const temp = document.getElementById("temp");

let city = "delhi";
let CurrentUnit = "";
let hourlyWeek = "Week";

// Trie Node and Trie classes as explained earlier
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word.toLowerCase()) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(prefix) {
        let node = this.root;
        for (let char of prefix.toLowerCase()) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        return this.autoComplete(node, prefix);
    }

    autoComplete(node, prefix) {
        let results = [];
        if (node.isEndOfWord) {
            results.push(prefix);
        }
        for (let char in node.children) {
            results = results.concat(this.autoComplete(node.children[char], prefix + char));
        }
        return results;
    }
}

// Initialize Trie and insert the list of cities
const cities = [
    "Agra",
    "Ahmedabad",
    "Bangalore",
    "Bhopal",
    "Chandigarh",
    "Chennai",
    "Delhi",
    "Durgapur",
    "Gurgaon",
    "Haldwani",
    "Hyderabad",
    "Indore",
    "Jaipur",
    "Jammu",
    "Kanpur",
    "Kolkata",
    "Lucknow",
    "Ludhiana",
    "Mumbai",
    "Nagpur",
    "Noida",
    "Pune",
    "Patna",
    "Rajkot",
    "Ranchi",
    "Surat",
    "Thane",
    "Vadodara",
    "Varanasi",
    "Visakhapatnam",
    "Vijayawada"
];

const trie = new Trie();

cities.forEach(city => {
    trie.insert(city);
});

const searchbox = document.getElementById("query");
const searchbtn = document.getElementById("search");

// Event listener for the search box input
searchbox.addEventListener("input", (event) => {
    const query = event.target.value;
    const suggestions = trie.search(query);

    // Clear previous suggestions
    const suggestionBox = document.querySelector(".suggestions");
    suggestionBox.innerHTML = "";

    // Show new suggestions
    suggestions.forEach(city => {
        const suggestionItem = document.createElement("div");
        suggestionItem.textContent = city;
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.addEventListener("click", () => {
            searchbox.value = city;
            checkWeather(city);
            suggestionBox.innerHTML = ""; // Clear suggestions after selection
        });
        suggestionBox.appendChild(suggestionItem);
    });
});

searchbtn.addEventListener("submit", (event) => {
    event.preventDefault();
    checkWeather(searchbox.value);
});

searchbox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        checkWeather(searchbox.value);
    }
});

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
            iconUrl = "./images/clouds.png";
            break;
        case "mist":
        case "haze":
            iconUrl = "./images/fog.png";
            break;
        case "snow":
            iconUrl = "./images/snow.png";
            break;
        case "rain":
        case "drizzle":
            iconUrl = "./images/rain.png";
            break;
        case "thunderstorm":
            iconUrl = "./images/thunderstorm.png";
            break;
        case "smog":
        case "smoke":
            iconUrl = "./images/fog.png";
            break;
        default:
            iconUrl = "./images/sun.png";
    }

    // Update the weather icon
    iconElement.src = iconUrl;
}

// Update date and time
function getDateTime() {
    let now = new Date();
    let time = now.toLocaleTimeString();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let daystring = days[now.getDay()];
    date.textContent = now.toLocaleDateString();

    return `${daystring}, ${time}`;
}

setInterval(() => {
    date.textContent = getDateTime();
}, 1000);

// Function to fetch weather details from API
async function checkWeather(city) {
    const response = await fetch(apiURL + `q=` + city + `&appid=${apiKey}`);
    var data = await response.json();

    console.log(data);

    const temperatureK = data.main.temp;
    const temperatureC = temperatureK - 273.15;
    temp.textContent = Math.round(temperatureC);

    const weatherCondition = data.weather[0].main;
    document.querySelector(".condition p").textContent = weatherCondition;

    setWeatherIcon(weatherCondition);

    const humidity = data.main.humidity;
    document.querySelector(".precipitation p").textContent = humidity + " %";
    document.querySelector(".humidity").textContent = humidity + " %";

    if (humidity < 55) {
        document.querySelector(".humidity-text").textContent = "Dry";
    } else if (humidity >= 55 && humidity < 65) {
        document.querySelector(".humidity-text").textContent = "Medium";
    } else {
        document.querySelector(".humidity-text").textContent = "High";
    }

    const location = data.name;
    document.querySelector(".location p").textContent = location;

    const windStatus = data.wind.speed;
    document.querySelector(".wind-speed").textContent = windStatus + " m/s";

    if (windStatus < 14) {
        document.querySelector(".wind-text").textContent = "Gentle Breeze";
    } else if (windStatus >= 14 && windStatus < 17) {
        document.querySelector(".wind-text").textContent = "Strong Breeze";
    } else if (windStatus >= 17 && windStatus < 27.5) {
        document.querySelector(".wind-text").textContent = "Strong Gale";
    } else if (windStatus >= 27.5) {
        document.querySelector(".wind-text").textContent = "Storm";
    }

    const sunrise = data.sys.sunrise;
    var sun_date = new Date(sunrise * 1000);
    var sunhours = sun_date.getHours();
    var sunmins = sun_date.getMinutes();
    if (sunmins < 10) {
        sunmins = "0" + sunmins;
    }
    document.querySelector(".sunrise-time").textContent = sunhours + " : " + sunmins + " AM";

    const visibility = data.visibility;
    if (visibility >= 1000) {
        document.querySelector(".visibility").textContent = (visibility / 1000) + " Km";
    } else {
        document.querySelector(".visibility").textContent = visibility + " m";
    }

    const tempFeel = data.main.feels_like;
    const tempFeelC = Math.round(tempFeel - 273.15);
    document.querySelector(".temp-feel").textContent = tempFeelC + " ॰C";
}

checkWeather("Delhi"); // Initial weather check
