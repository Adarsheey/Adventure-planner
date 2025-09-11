// Activity-based checklist
const activities = {
    trekking: ["Water", "Rope", "First-aid kit"],
    rafting: ["Waterproof bag", "Life jacket", "First-aid kit"],
    camping: ["Tent", "Sleeping bag", "Water"]
};

// Predefined gear suggestions (use your affiliate links if available)
const gearSuggestions = {
    trekking: [
        "https://www.amazon.com/s?k=trekking+gear",
        "https://www.amazon.com/s?k=hiking+equipment"
    ],
    rafting: [
        "https://www.amazon.com/s?k=rafting+gear",
        "https://www.amazon.com/s?k=water+safety+equipment"
    ],
    camping: [
        "https://www.amazon.com/s?k=camping+gear",
        "https://www.amazon.com/s?k=outdoor+equipment"
    ]
};

// Save preferences to localStorage
function savePreferences(activity, location) {
    localStorage.setItem("activity", activity);
    localStorage.setItem("location", location);
}

// Load preferences from localStorage
function loadPreferences() {
    return {
        activity: localStorage.getItem("activity") || "trekking",
        location: localStorage.getItem("location") || ""
    };
}

// Update checklist UI
function updateChecklist(activity) {
    const list = activities[activity] || [];
    const checklistEl = document.getElementById("checklist");
    checklistEl.innerHTML = "";
    list.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        checklistEl.appendChild(li);
    });
}

// Show gear suggestions UI
function showGearSuggestions(activity) {
    const suggestions = gearSuggestions[activity] || [];
    const container = document.getElementById("gearSuggestions");
    container.innerHTML = "";
    suggestions.forEach(url => {
        const a = document.createElement("a");
        a.href = url;
        a.textContent = url;
        a.target = "_blank";
        container.appendChild(a);
        container.appendChild(document.createElement("br"));
    });
}

// Show browser notification
function showNotification(title, message) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: message });
            }
        });
    }
}

// Check weather using OpenWeather API
/***function checkWeather(location) {
    const apiKey = "2826acc6abde1736a757d79c1cf93255";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.weather && data.weather.length > 0) {
                const condition = data.weather[0].main;
                const windSpeed = data.wind ? data.wind.speed : 0;
                
                if (condition === "Rain" || windSpeed > 10) {
                    showNotification("Weather Alert!", "The weather is turning bad. Stay safe!");
                }
            }
        })
        .catch(error => {
            console.error("Weather API error:", error);
        });
}
********/


function checkWeather(location) {
    const apiKey = "2826acc6abde1736a757d79c1cf93255";
    const weatherInfoEl = document.getElementById("weatherInfo");
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const condition = data.weather[0].main;
                const description = data.weather[0].description;
                const temp = data.main.temp;
                const humidity = data.main.humidity;
                const windSpeed = data.wind.speed;

                weatherInfoEl.innerHTML = `
                    <p><strong>Condition:</strong> ${condition} (${description})</p>
                    <p><strong>Temperature:</strong> ${temp} °C</p>
                    <p><strong>Humidity:</strong> ${humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
                `;

                if (condition === "Rain" || windSpeed > 10) {
                    showNotification("Weather Alert!", "The weather is turning bad. Stay safe!");
                }
            } else {
                weatherInfoEl.textContent = "Weather data not found.";
            }
        })
        .catch(error => {
            console.error("Weather API error:", error);
            weatherInfoEl.textContent = "Error fetching weather data.";
        });
}

// Plan adventure based on user input
function planAdventure() {
    const activity = document.getElementById("activity").value;
    const location = document.getElementById("location").value.trim();

    savePreferences(activity, location);
    updateChecklist(activity);
    showGearSuggestions(activity);

    if (location) {
        checkWeather(location);
    }
}

// Load preferences and update UI on page load
window.onload = () => {
    const { activity, location } = loadPreferences();
    document.getElementById("activity").value = activity;
    document.getElementById("location").value = location;
    updateChecklist(activity);
    showGearSuggestions(activity);
};
