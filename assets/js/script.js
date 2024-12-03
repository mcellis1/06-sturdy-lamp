const searchFormEl = document.querySelector('#search-form')
const currentWeatherEl = document.querySelector('#current-weather')
const resultsEl = document.querySelector('#results-el')
const cityName = document.querySelector('#city-name')
const fiveDayHeader = document.querySelector('#five-day-forecast')
const searchesEl = document.querySelector('#searches')

const APIKey = '4bf5cd1a7ad0fe45f259683b248d3892'
let storedSearches = JSON.parse(localStorage.getItem('searched')) || []

function KtoF(temp) {
    return Math.round((temp - 273.15) * 1.8 + 32)
}

function getEmoji(data) {
    const icon = data.weather[0].icon
    let iconText
    if (icon === '11d') { iconText = '⚡️' }
    else if (icon === '11n') { iconText = '⚡️' }
    else if (icon === '09d') { iconText = '🌧' }
    else if (icon === '09n') { iconText = '🌧' }
    else if (icon === '10d') { iconText = '🌧' }
    else if (icon === '10n') { iconText = '🌧' }
    else if (icon === '13d') { iconText = '❄️' }
    else if (icon === '13n') { iconText = '❄️' }
    else if (icon === '50d') { iconText = '🌫' }
    else if (icon === '50n') { iconText = '🌫' }
    else if (icon === '01d') { iconText = '☀️' }
    else if (icon === '01n') { iconText = '☀️' }
    else if (icon === '02d') { iconText = '⛅️' }
    else if (icon === '02n') { iconText = '⛅️' }
    else if (icon === '03d') { iconText = '☁️' }
    else if (icon === '03n') { iconText = '☁️' }
    else if (icon === '04d') { iconText = '☁️' }
    else if (icon === '04n') { iconText = '☁️' }
    else { return }
    return iconText
}

function currentWeather(data) {
    const city = data.city.name
    const weather = data.list[0]
    
    const resultCard = document.createElement('div')
    resultCard.classList.add('result')
    
    const resultBody = document.createElement('div')
    resultBody.classList.add('result-body')
    resultCard.append(resultBody)
    
    const headerEl = document.createElement('h3');
    const trimmedDate = weather.dt_txt.substring(0, 10)
    headerEl.textContent = `${city} ${trimmedDate} ${getEmoji(weather)}`
    
    const bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML += `Temp: ${KtoF(weather.main.temp)}°<br/>`;
    bodyContentEl.innerHTML += `Wind: ${weather.wind.speed} MPH<br/>`;
    bodyContentEl.innerHTML += `Humidity: ${weather.main.humidity}%<br/>`
    
    resultBody.append(headerEl, bodyContentEl);
    currentWeatherEl.append(resultCard);
}

function printResults(data) {
    fiveDayHeader.textContent = '5-Day Forecast'
    
    const resultCard = document.createElement('div')
    resultCard.classList.add('card')
    
    const resultBody = document.createElement('div')
    resultBody.classList.add('card-body')
    resultCard.append(resultBody)
    
    const bodyContentEl = document.createElement('p')
    const trimmedDate = data.dt_txt.substring(0, 10)
    bodyContentEl.innerHTML = `<span>${getEmoji(data)}<span/><br/>`
    bodyContentEl.innerHTML += `Date: ${trimmedDate}<br/>`
    bodyContentEl.innerHTML += `Temp: ${KtoF(data.main.temp)}°<br/>`
    bodyContentEl.innerHTML += `Wind: ${data.wind.speed} MPH<br/>`
    bodyContentEl.innerHTML += `Humidity: ${data.main.humidity}%<br/>`
    
    resultBody.append(bodyContentEl)
    resultsEl.append(resultCard)
}

function apiFetch(searchInput) {
    const citySearch = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=${APIKey}`
    
    fetch(citySearch)
    .then(function (response) {
        if (!response.ok) {
            throw response.json()
        }
        const json = response.json()
        return json
    })
    .then(function (data) {
        const lat = data[0].lat
        const lon = data[0].lon
        const weatherQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`
        fetch(weatherQuery)
        .then(function (response) {
            if (!response.ok) {
                throw response.json()
            }
            const json = response.json()
            return json
        })
        .then(function (data) {
            const city = data.city.name
            
            resultsEl.textContent = ''
            currentWeatherEl.textContent = ''
            searchesEl.textContent = ''
            
            if (!storedSearches.includes(city)) {
                storedSearches.push(city)
                localStorage.setItem('searched', JSON.stringify(storedSearches))
            }
            
            currentWeather(data)
            for (let i = 7; i < 41; i += 8) {
                printResults(data.list[i])
            }
            loadSearches()
        })
    })
}

function handleSearchFormSubmit(event) {
    event.preventDefault()
    const searchInputVal = document.querySelector('#city-search').value
    
    if (!searchInputVal) {
        console.error('please input a city name')
        return
    }
    
    apiFetch(searchInputVal)
}

function storedSearchEvent(event) {
    event.preventDefault()
    const city = event.target.textContent

    if (!city) {
        console.error('no city name found')
        return
    }

    apiFetch(city)
}

function loadSearches() {
    if (storedSearches) {
        for (let i = 0; i < storedSearches.length; i++) {
            const cityEl = document.createElement('div')
            cityEl.textContent = storedSearches[i]
            searchesEl.appendChild(cityEl)
        }
        for (const cityEl of searchesEl.children) {
            cityEl.addEventListener('click', storedSearchEvent)
        }
    }
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit)
window.onload = loadSearches
