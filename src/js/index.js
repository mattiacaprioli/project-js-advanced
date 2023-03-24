import '../css/style.css';
import '../js/index.js';
import "bootstrap";
import axios from 'axios';
import _ from 'lodash';

// API key di Teleport
const apiKey = process.env.TELEPORT_API_KEY;

// URL base dell'API di Teleport
const apiUrl = 'https://api.teleport.org/api/';

// Funzione per ottenere le informazioni sulla città
const getCityInfo = async (city) => {
  try {
    const response = await axios.get(`${apiUrl}urban_areas/slug:${_.kebabCase(city)}/scores/`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Funzione per visualizzare le informazioni sulla città
const showCityInfo = (info) => {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
  <div class="card">
  <div class="card-header">
    <h2 class="card-title">city Information: </h2>
  </div>
  <div class="card-body">
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        <h3>Categories:</h3>
        <ul class="list-group list-group-flush">
          ${info.categories.map((category) => `<li class="list-group-item">${category.name}: ${parseFloat(category.score_out_of_10).toFixed(2)}</li>`).join('')}
        </ul>
      </li>
      <li class="list-group-item">
        <h3>Summary:</h3>
        <p>${info.summary}</p>
      </li>
      <li class="list-group-item">
        <h3>City Score:</h3>
        <p>${parseFloat(info.teleport_city_score).toFixed(2)}</p>
      </li>
    </ul>
  </div>
</div>
  `;
};

// Funzione per mostrare la barra di caricamento
async function load() {
  window.onload = () => {
      document.getElementById("load").style.visibility="visible";
      setTimeout(function(){
          document.getElementById("load").style.visibility="hidden";
      },1000);
  };
}
load()

async function showLoading() {
  document.getElementById("load").style.visibility = "visible";
  await new Promise(resolve => setTimeout(resolve, 1000));
  document.getElementById("load").style.visibility = "hidden";
}

// Funzione per gestire l'errore
const showError = (message) => {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
};

// Event listener
const submitButton = document.getElementById('submit');
const cityInput = document.getElementById('city');

submitButton.addEventListener('click', async () => {
  await showLoading();
  const city = cityInput.value.trim();
  if (!city) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<div class="alert alert-danger" role="alert">This field is required and cannot be empty.</div>`;
    return;
  }
  const cityInfo = await getCityInfo(city);
  if (!cityInfo) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<div class="alert alert-danger" role="alert">This city is not available, try again.</div>`;
    return;
  }
  showCityInfo(cityInfo);
});


cityInput.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    const city = cityInput.value;
    if (!city) {
      showError("This field is required and cannot be empty.");
      return;
    }
    await showLoading();
    const cityInfo = await getCityInfo(city);
    if (!cityInfo) {
      showError("This city is not available, try again.");
      return;
    }
    showCityInfo(cityInfo);
  }
}); 