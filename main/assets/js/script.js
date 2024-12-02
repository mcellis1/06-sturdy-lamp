const APIKey = '4bf5cd1a7ad0fe45f259683b248d3892'
const searchFormEl = document.querySelector('#search-form')
const resultsEl = document.querySelector('#results-el')
const cityName = document.querySelector('#city-name')

function KtoF(temp) {
    return Math.round((temp - 273.15) * 1.8 + 32)
}

function printResults(data) {
    console.log(data)
    const resultCard = document.createElement('div')
    resultCard.classList.add('card')

    const resultBody = document.createElement('div')
    resultBody.classList.add('card-body')
    resultCard.append(resultBody)

    const bodyContentEl = document.createElement('p');
    const trimmedDate = data.dt_txt.substring(0, 10)
    bodyContentEl.innerHTML = `<strong>Date:</strong> ${trimmedDate}<br/>`;

    const temps = data.main
    bodyContentEl.innerHTML += `<strong>Temperature:</strong> ${KtoF(temps.temp)}°<br/>`;
    bodyContentEl.innerHTML += `<strong>High:</strong> ${KtoF(temps.temp_max)}°<br/>`;
    bodyContentEl.innerHTML += `<strong>Low:</strong> ${KtoF(temps.temp_min)}°<br/>`;
    bodyContentEl.innerHTML += `<strong>Feels Like:</strong> ${KtoF(temps.feels_like)}°<br/>`;

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
            console.log(json)
            return json
        })
        .then(function (data) {
            console.log(data)
            const lat = data[0].lat
            const lon = data[0].lon
            const weatherQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`
            console.log(lat, lon)
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
                    cityName.textContent = `${data.city.name} Weather Forecast`
                    resultsEl.textContent = '';
                    for (let i = 0; i < data.list.length; i += 8) {
                        printResults(data.list[i]);
                    }
                })
        })
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit)
