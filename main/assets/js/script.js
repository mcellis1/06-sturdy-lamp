const APIKey = '4bf5cd1a7ad0fe45f259683b248d3892'
const searchFormEl = document.querySelector('#search-form')
const currentWeatherEl = document.querySelector('#current-weather')
const resultsEl = document.querySelector('#results-el')
const cityName = document.querySelector('#city-name')
const fiveDayHeader = document.querySelector('#five-day-forecast')

function KtoF(temp) {
    return Math.round((temp - 273.15) * 1.8 + 32)
}

function currentWeather(data) {
    const resultCard = document.createElement('div')
    resultCard.classList.add('card')

    const resultBody = document.createElement('div')
    resultBody.classList.add('card-body')
    resultCard.append(resultBody)

    const bodyContentEl = document.createElement('p');
    const trimmedDate = data.dt_txt.substring(0, 10)
    bodyContentEl.innerHTML = `Date: ${trimmedDate}<br/>`;
    bodyContentEl.innerHTML += `Temp: ${KtoF(data.main.temp)}°<br/>`;
    bodyContentEl.innerHTML += `Wind: ${data.wind.speed} MPH<br/>`;
    bodyContentEl.innerHTML += `Humidity: ${data.main.humidity}%<br/>`

    resultBody.append(bodyContentEl);
    currentWeatherEl.append(resultCard);
}

function printResults(data) {
    console.log(data)
    fiveDayHeader.textContent = '5-Day Forecast'

    const resultCard = document.createElement('div')
    resultCard.classList.add('card')

    const resultBody = document.createElement('div')
    resultBody.classList.add('card-body')
    resultCard.append(resultBody)

    const bodyContentEl = document.createElement('p');
    const trimmedDate = data.dt_txt.substring(0, 10)
    bodyContentEl.innerHTML = `Date: ${trimmedDate}<br/>`;
    bodyContentEl.innerHTML += `Temp: ${KtoF(data.main.temp)}°<br/>`;
    bodyContentEl.innerHTML += `Wind: ${data.wind.speed} MPH<br/>`;
    bodyContentEl.innerHTML += `Humidity: ${data.main.humidity}%<br/>`

    resultBody.append(bodyContentEl);
    resultsEl.append(resultCard);
}

function handleSearchFormSubmit(event) {
    event.preventDefault()
    const searchInputVal = document.querySelector('#city-search').value

    if (!searchInputVal) {
        console.error('please input a city name')
        return
    }

    const citySearch = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInputVal}&limit=1&appid=${APIKey}`

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
                    console.log(json)
                    return json
                })
                .then(function (data) {
                    console.log(data)
                    cityName.textContent = `${data.city.name} ${data.list[0].dt_txt.substring(0, 10)}`
                    resultsEl.textContent = '';
                    currentWeatherEl.textContent = '';
                    currentWeather(data.list[0])
                    for (let i = 7; i < 41; i += 8) {
                        printResults(data.list[i]);
                    }
                })
        })
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit)
