const boton = document.getElementById("boton1");
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");
const emojiClima = document.getElementById("emoji-clima");

const weatherEmojis = {
  0: "☀️",    
  1: "🌤️",   
  2: "⛅",    
  3: "☁️",    
  45: "🌫️",   
  48: "🌫️",   
  51: "🌦️",   
  53: "🌧️",  
  55: "🌧️",   
  56: "🌨️",  
  57: "🌨️",   
  61: "🌧️",  
  63: "🌧️",   
  65: "🌧️",   
  66: "❄️",  
  67: "❄️",   
  71: "❄️",  
  73: "❄️",   
  75: "❄️",   
  77: "❄️",   
  80: "🌧️",   
  81: "🌧️",   
  82: "🌧️",   
  85: "❄️",   
  86: "❄️",   
  95: "⛈️",   
  96: "⛈️",   
  99: "⛈️"    
};

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const ciudad = document.getElementById("lugar").value.trim();
  if (!ciudad) return;

  /*resultado.innerHTML = "Buscando coordenadas...";
  resultado.classList.add("resultado");*/
  emojiClima.innerText = "";

  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ciudad)}`);
    const geoData = await geoRes.json();

    if (!geoData.length) {
      resultado.innerHTML = "No se encontraron coordenadas para esa ciudad.";
      return;
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    
    const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=3`);
    const meteoData = await meteoRes.json();

    const dias = meteoData.daily.time;
    const tempMax = meteoData.daily.temperature_2m_max;
    const tempMin = meteoData.daily.temperature_2m_min;
    const clima = meteoData.daily.weathercode;

    let html = `<h2 class="titulo-clima">Clima en ${ciudad}</h2>`;

    for (let i = 0; i < dias.length; i++) {
      const codigo = clima[i];
      const emoji = weatherEmojis[codigo] || "❓";

      
      if (i === 0) {
        emojiClima.innerText = emoji;
      }

      html += `<p class="parrafo"><strong>${dias[i]}</strong>: ${emoji} Max ${tempMax[i]}°C / Min ${tempMin[i]}°C</p>`;
    }

    resultado.innerHTML = html;

  } catch (error) {
    resultado.innerHTML = "Error al obtener el clima.";
    console.error(error);
  }
});
