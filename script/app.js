const API_PATH = "https://movies-app1.p.rapidapi.com/api"

function getCategoryBtns() {
    fetch(`${API_PATH}/genres`, {
        headers: {
            'X-RapidAPI-Key': '748d68f6c7msh915309bd3b274cdp1f92e1jsn1433618e974f',
            'X-RapidAPI-Host': 'movies-app1.p.rapidapi.com'
        }
    }).then(res => res.json()).then(data => {
        addCategories(data.results)
    }).catch(err => {
        console.log(err);
    })
}

function GetMovies() {
    console.log("gettin thhe movies from the server");
    fetch(`${API_PATH}/movies`, {
        headers: {
            'X-RapidAPI-Key': '748d68f6c7msh915309bd3b274cdp1f92e1jsn1433618e974f',
            'X-RapidAPI-Host': 'movies-app1.p.rapidapi.com'
        }
    }).then(res => res.json()).then(data => {
        addMovie(data.results)
    }).catch(err => {
        console.log(err);
    })
}

function addCategories(categories) {
    const formSelect = document.querySelector("#formSelect")
    categories.forEach(category => {
        const categoryElem = document.createElement("option")
        const { name, id } = category
        categoryElem.textContent = name
        categoryElem.toggleAttribute("id", id)
        categoryElem.value = name
        formSelect.append(categoryElem)
    });
}

function addMovie(movies) {
    const cardsWrapper = document.querySelector(".movies__wrapper");
    cardsWrapper.innerHTML = ""
    movies.forEach(movie => {
        const cardTemplate = document.querySelector("[data-movie-template]").content.cloneNode(true).children[0]
        const cardImg = cardTemplate.querySelector(".card-img-top")
        const cardTitle = cardTemplate.querySelector(".card-title")
        const cardLink = cardTemplate.querySelector(".card-link")
        let { _id, image, title, description, embedUrls, index } = movie
        cardImg.setAttribute("src", image)
        cardTitle.textContent = title
        cardLink.textContent = "Watch now"
        cardLink.setAttribute("href", embedUrls[0].url)
        cardTemplate.setAttribute("id", _id)
        cardTemplate.setAttribute("index", index)
        cardsWrapper.append(cardTemplate)
        cardTemplate.classList.add("animateIn")
        cardTemplate.addEventListener("animationend", () => {
            cardTemplate.classList.remove("animateIn")
        })
    });
}

function handleSearch() {
    const dataSearch = document.querySelector("[data-search]")
    dataSearch.addEventListener("input", (e) => {
        searchMovie(e.target.value)
    })
}

function handleSelect() {
    const userSelect = document.querySelector("#formSelect"),
        filteredMovies = [];
    userSelect.addEventListener("change", () => {
        const currentSelection = userSelect.value
        if (currentSelection === "all") {
            GetMovies()
            return
        }
        fetch(`${API_PATH}/movies`, {
            headers: {
                'X-RapidAPI-Key': '748d68f6c7msh915309bd3b274cdp1f92e1jsn1433618e974f',
                'X-RapidAPI-Host': 'movies-app1.p.rapidapi.com'
            }
        }).then(res => res.json()).then(data => {
            data.results.forEach(result => {
                result.genres.forEach(genre => {
                    if (genre.name.toLowerCase() === currentSelection.toLowerCase()) filteredMovies.push(result);
                })
            })
            filterMovies(filteredMovies)
        }).catch(err => {
            console.log(err);
        })
    })
}

function handleSkeletonLoading() {

    for (let i = 0; i < 12; i++) {
        const skeletonTemplate = document.querySelector("[data-skeleton]").content.cloneNode(true),
            moviesWrapper = document.querySelector(".movies__wrapper");
        console.log("WTF");
        moviesWrapper.append(skeletonTemplate)
    }
}

function filterMovies(filteredMovies) {
    const movies = document.querySelectorAll(".card")
    movies.forEach(movie => {
        movie.classList.add("animateOut")
        movie.addEventListener("animationend", () => {
            movie.classList.remove("animteOut")
            movie.remove()
        })
    });
    addMovie(filteredMovies)
}

const searchMovie = debounce(async (text) => {
    fetch(`${API_PATH}/movies`, {
        headers: {
            'X-RapidAPI-Key': '748d68f6c7msh915309bd3b274cdp1f92e1jsn1433618e974f',
            'X-RapidAPI-Host': 'movies-app1.p.rapidapi.com'
        }
    }).then(res => res.json()).then(data => {
        filterMovies(data.results.filter(result => result.title.includes(text)))
        text = ""
    })
})

function debounce(cb, delay = 1000) {
    let timeout

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

function App() {
    handleSkeletonLoading()
    getCategoryBtns()
    GetMovies()
    handleSearch()
    handleSelect()
}

App()