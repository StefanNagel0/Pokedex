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
    const pokemonsToRender = filteredPokemons || pokemons;
    if (!pokemonsToRender?.length) return;
    pokemonContainer.innerHTML = '';
    const renderId = ++currentRenderId;
    loadPokemons(pokemonsToRender, renderId, pokemonContainer);
}

async function loadPokemons(pokemons, renderId, container) {
    for (let i = 0; i < pokemons.length; i++) {
        if (renderId !== currentRenderId) return;
        const pokemonDetails = await getPokemonDetails(pokemons[i].url);
        container.innerHTML += getPokemonTemplate(pokemonDetails, i);
    }
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

    if (filterword.length < 3) return handleShortInput(searchInfo);

    searchInfo.classList.remove('visible');
    filterAndShowPokemon(filterword);
}

function handleShortInput(searchInfo) {
    searchInfo.classList.add('visible');
    showAllPokemon();
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
    const pokemons = await Promise.all(response.results.map(fetchPokemonDetails));
    return pokemons.filter(p => p);
}

async function fetchPokemonDetails(pokemon) {
    const details = await getPokemonDetails(pokemon.url);
    if (details.sprites?.front_default) {
        return {
            name: pokemon.name,
            id: details.id,
            url: pokemon.url,
            types: details.types,
            sprites: details.sprites,
            height: details.height,
            weight: details.weight,
            base_experience: details.base_experience,
            abilities: details.abilities,
            stats: details.stats,
        };
    }
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

document.addEventListener('DOMContentLoaded', initializeSearch);

function initializeSearch() {
    const searchBar = document.querySelector('.search_bar');
    const searchIcon = document.querySelector('.search-icon');
    const header = document.querySelector('header');
    if (!searchBar || !searchIcon || !header) {
        console.error('Elemente für die Suchleiste konnten nicht gefunden werden.');
        return;
    }
    setupSearchBarEvents(searchBar, searchIcon, header);
    adjustSearchBarVisibility();
}

function setupSearchBarEvents(searchBar, searchIcon, header) {
    searchIcon.addEventListener('click', (event) => handleSearchIconClick(event, searchBar, searchIcon, header));
    document.addEventListener('click', (event) => handleDocumentClick(event, searchBar, searchIcon, header));
    searchBar.addEventListener('click', (event) => event.stopPropagation());
}

function handleSearchIconClick(event, searchBar, searchIcon, header) {
    event.stopPropagation();
    showSearchBar(searchBar, searchIcon, header);
}

function handleDocumentClick(event, searchBar, searchIcon, header) {
    if (window.innerWidth <= 440 && !searchBar.contains(event.target)) {
        hideSearchBar(searchBar, searchIcon, header);
    }
}

function showSearchBar(searchBar, searchIcon, header) {
    searchBar.classList.add('active');
    searchBar.style.display = 'block';
    searchIcon.style.display = 'none';
    header.classList.add('darkened');
}

function hideSearchBar(searchBar, searchIcon, header) {
    searchBar.classList.remove('active');
    searchBar.style.display = 'none';
    searchIcon.style.display = 'block';
    header.classList.remove('darkened');
}