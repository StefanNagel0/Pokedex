let pokemons = [];
let limit = 30;
let offset = 0;
let BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
let currentRenderId = 0;

function docID(id) {
    return document.getElementById(id);
}

async function init() {
    showLoadingSpinner();
    pokemons = await loadPokemonWithDetails();
    hideLoadingSpinner();
    renderPokemon();
    setupPokemonSearch();
    setupEventListeners();
}

async function getPokemon() {
    let response = await fetch(BASE_URL);
    let responseToJson = await response.json();
    return responseToJson;
}

function renderPokemon(filteredPokemons = null) {
    const pokemonContainer = document.getElementById('pokemon_load_content');
    pokemonContainer.innerHTML = '';
    const pokemonsToRender = filteredPokemons || pokemons;
    if (!pokemonsToRender || pokemonsToRender.length === 0) {
        return;
    }
    const renderId = ++currentRenderId;
    (async function loadPokemon() {
        for (let i = 0; i < pokemonsToRender.length; i++) {
            if (renderId !== currentRenderId) {
                return;
            }
            const pokemonDetails = await getPokemonDetails(pokemonsToRender[i].url);
            pokemonContainer.innerHTML += getPokemonTemplate(pokemonDetails, i);
        }
    })();
}

function setupEventListeners() {
    const loadMoreButton = document.getElementById('load_more_pokemons');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', increasePokemons);
    } else {
        console.error("Button 'load_more_pokemons' nicht gefunden!");
    }
}

async function getPokemonDetails(url) {
    let response = await fetch(url);
    let pokemonData = await response.json();
    return pokemonData;
}

async function increasePokemons() {
    showLoadingSpinner();
    offset += limit; 
    BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const newPokemons = await loadPokemonWithDetails();
    pokemons = [...pokemons, ...newPokemons];
    hideLoadingSpinner();
    renderPokemon();
}

function filterAndShowPokemon(filterword) {
    if (!filterword || filterword.length === 0) {
        renderPokemon(pokemons);
        return;
    }
    const filteredPokemons = pokemons.filter(pokemon => {
        const matchesName = pokemon.name.toLowerCase().includes(filterword.toLowerCase());
        const matchesType = pokemon.types.some(type => type.type.name.toLowerCase().includes(filterword.toLowerCase()));
        return matchesName || matchesType;
    });
    const limitedPokemons = filteredPokemons.slice(0, 10);
    renderPokemon(limitedPokemons);
}

function handleFocusBlur() {
    const searchInfo = document.getElementById('search-info');
    const searchInput = document.getElementById('pokemon-search');
    if (searchInput.value.trim().length < 3) {
        searchInfo.classList.toggle('visible', searchInput === document.activeElement);
    } else {
        searchInfo.classList.remove('visible');
    }
}

function handleSearchInput() {
    const searchInput = document.getElementById('pokemon-search');
    const searchInfo = document.getElementById('search-info');
    const filterword = searchInput.value.trim().toLowerCase();

    if (filterword.length < 3) {
        searchInfo.classList.remove('visible');
        showAllPokemon();
        return;
    }
    if (filterword.length < 3) {
        searchInfo.classList.add('visible');
        return;
    } else {
        searchInfo.classList.remove('visible');
    }
    filterAndShowPokemon(filterword);
}

function showAllPokemon() {
    const pokemonList = document.getElementById('pokemon_load_content');
    pokemonList.innerHTML = pokemons
        .map(pokemon => getPokemonTemplate(pokemon))
        .join('');
}

function setupPokemonSearch() {
    const searchInput = document.getElementById('pokemon-search');
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleFocusBlur);
    searchInput.addEventListener('blur', handleFocusBlur);
}

async function loadPokemonWithDetails() {
    const response = await getPokemon();
    const filteredPokemons = await Promise.all(
        response.results.map(async (pokemon) => {
            const details = await getPokemonDetails(pokemon.url);
            if (details.sprites && details.sprites.front_default) {
                return {
                    name: pokemon.name,
                    id: details.id,
                    url: pokemon.url,
                    types: details.types,
                    sprites: details.sprites,
                    height: details.height,
                    weight: details.weight, 
                    base_experience: details.base_experience,
                    abilities: details.abilities ,
                    stats: details.stats
                };
            }
            console.warn('Ungültige Daten für Pokémon:', pokemon);
        })
    );
    return filteredPokemons.filter(p => p);
    
}

function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('d_none');
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('d_none');
}

function toggleSearchBar() {
    const header = document.querySelector('header');
    const searchBar = document.querySelector('.search_bar');

    if (searchBar.classList.contains('active')) {
        searchBar.classList.remove('active');
        header.classList.remove('darkened');
    } else {
        searchBar.classList.add('active');
        header.classList.add('darkened');
    }
}

function adjustSearchBarVisibility() {
    const searchBar = document.querySelector('.search_bar');
    const searchIcon = document.querySelector('.search-icon');

    if (window.innerWidth > 440) {
        searchBar.style.display = 'flex';
        searchIcon.style.display = 'none';
    } else {
        searchBar.style.display = 'none';
        searchIcon.style.display = 'block';
    }
}

function toggleSearchBar() {
    const header = document.querySelector('header');
    const searchBar = document.querySelector('.search_bar');

    if (searchBar.classList.contains('active')) {
        searchBar.classList.remove('active');
        searchBar.style.display = 'none';
        header.classList.remove('darkened');
    } else {
        // Suchleiste einblenden
        searchBar.classList.add('active');
        searchBar.style.display = 'flex';
        header.classList.add('darkened');
    }
}

window.addEventListener('resize', adjustSearchBarVisibility);
window.addEventListener('DOMContentLoaded', adjustSearchBarVisibility);

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.search_bar');
    const searchIcon = document.querySelector('.search-icon');
    const header = document.querySelector('header');

    function showSearchBar() {
        searchBar.classList.add('active');
        searchBar.style.display = 'block';
        searchIcon.style.display = 'none';
        header.classList.add('darkened');
    }

    function hideSearchBar() {
        searchBar.classList.remove('active');
        searchBar.style.display = 'none';
        searchIcon.style.display = 'block';
        header.classList.remove('darkened');
    }

    searchIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        showSearchBar();
    });
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 440 && !searchBar.contains(event.target)) {
            hideSearchBar();
        }
    });
    searchBar.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    adjustSearchBarVisibility();
});
