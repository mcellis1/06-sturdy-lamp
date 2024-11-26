const APIKey = '4bf5cd1a7ad0fe45f259683b248d3892'
const searchFormEl = document.querySelector('#search-form')

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
                    console.log(data)
                })
        })
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit)
