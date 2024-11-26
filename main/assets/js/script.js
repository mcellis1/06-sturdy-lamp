const searchFormEl = document.querySelector('#search-form')

function handleSearchFormSubmit(event) {
    event.preventDefault()

    const searchInputVal = document.querySelector('city-search').value

    if (!searchInputVal) {
        console.error('please input a city name')
        return
    }

    const queryString = ``
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit)
