const activities = {
  trekking: ["Water", "Rope", "First-aid kit"],
  rafting: ["Waterproof bag", "Life jacket", "First-aid kit"],
  camping: ["Tent", "Sleeping bag", "Water"],
  paragliding: ["Helmet", "Flight suit", "Gloves and boots", "First aid kit", "Communication device"],
  scubadiving: ["First aid kit", "Wet suit", "Waterproof bags", "Underwater camera"],
  skydiving: ["First aid", "Communication device", "Parachute", "Helmet", "Goggles", "Flight suit"],
  boating: ["Life jacket", "First aid kit", "Communication device"]
};

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
  ],
  paragliding: [
    "https://www.amazon.com/s?k=paragliding+gear",
    "https://www.amazon.com/s?k=outdoor+equipment"
  ],
  scubadiving: [
    "https://www.amazon.com/s?k=scubadiving+gear",
    "https://www.amazon.com/s?k=outdoor+water+equipment"
  ],
  skydiving: [
    "https://www.amazon.com/s?k=skydiving+gear",
    "https://www.amazon.com/s?k=outdoor+safety+equipment"
  ],
  boating: [
    "https://www.amazon.com/s?k=boating+gear",
    "https://www.amazon.com/s?k=water+safety+equipment"
  ]
};

// =====================
// Page Navigation
// =====================
function planAdventure() {
  const activity = document.getElementById("activity").value;
  const location = document.getElementById("location").value.trim();

  if (!activity) {
    alert("Please select an activity.");
    return;
  }
  if (!location) {
    alert("Please enter a location.");
    return;
  }

  // Save in localStorage for results page
  localStorage.setItem("activity", activity);
  localStorage.setItem("location", location);

  // Redirect to results page
  window.location.href = "result.html";
}

// =====================
// Results Page Loader
// =====================
function loadResultsPage() {
  const activity = localStorage.getItem("activity");
  const location = localStorage.getItem("location");

  if (!activity || !location) {
    document.body.innerHTML = "<h3>Error: No adventure planned!</h3>";
    return;
  }

  // Show location
  document.getElementById("placeTitle").textContent = location;

  // Fetch and display 3 images
  fetchLocationImages(location);

  // Checklist
  const checklistEl = document.getElementById("checklist");
  checklistEl.innerHTML = "";
  (activities[activity] || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    checklistEl.appendChild(li);
  });

  // Gear Suggestions
  const gearEl = document.getElementById("gearSuggestions");
  gearEl.innerHTML = "";
  (gearSuggestions[activity] || []).forEach(url => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.textContent = url;
    gearEl.appendChild(a);
    gearEl.appendChild(document.createElement("br"));
  });

  // Fetch weather
  checkWeather(location);
}

// =====================
// Weather API
// =====================
function checkWeather(location) {
  const apiKey = "6a36dfe71b010e7646a0202cb65aa1fd"; // <<-- replace with your key
  const weatherEl = document.getElementById("weatherInfo");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === 200) {
        weatherEl.innerHTML = `
          <strong>Condition:</strong> ${data.weather[0].main} (${data.weather[0].description})<br>
          <strong>Temperature:</strong> ${data.main.temp} °C<br>
          <strong>Humidity:</strong> ${data.main.humidity}%<br>
          <strong>Wind Speed:</strong> ${data.wind.speed} m/s<br>
        `;
      } else {
        weatherEl.textContent = "Weather data not found.";
      }
    })
    .catch(err => {
      console.error("Weather API error:", err);
      weatherEl.textContent = "Error fetching weather data.";
    });
}

// =====================
// Fetch 3 Images using Unsplash API
// =====================
function fetchLocationImages(location) {
  const accessKey = "5g2Kfh6pQs41QtwUdookgM6qv3rM9yazQBOroj8OXYk"; // replace with your Unsplash key
  const imagesContainer = document.getElementById("placeImages");
  imagesContainer.innerHTML = "";

  fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&client_id=${accessKey}&per_page=3`)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        data.results.forEach(photo => {
          const img = document.createElement("img");
          img.src = photo.urls.small;
          img.alt = location;
          imagesContainer.appendChild(img);
        });
      } else {
        imagesContainer.textContent = "No images found for this location.";
      }
    })
    .catch(err => {
      console.error("Image API error:", err);
      imagesContainer.textContent = "Error fetching images.";
    });
}

// =====================
// Run Results Page
// =====================
if (window.location.pathname.includes("result.html")) {
  window.onload = loadResultsPage;
}

