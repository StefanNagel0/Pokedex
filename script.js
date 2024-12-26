let pokemons = []
const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=30&offset=0";
let currentRenderId = 0;



async function init() {
    pokemons = await loadPokemonWithDetails();
    console.log(`Loaded ${pokemons.length} Pokémon`);
    renderPokemon();
    setupPokemonSearch();
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
        console.warn("No Pokémon to render.");
        return;
    }
    const renderId = ++currentRenderId;
    (async function loadPokemon() {
        for (let i = 0; i < pokemonsToRender.length; i++) {
            if (renderId !== currentRenderId) {
                return;
            }
            const pokemonDetails = await getPokemonDetails(pokemonsToRender[i].url);
            pokemonContainer.innerHTML += getPokemonTemplate(pokemonDetails);
        }
    })();
}

async function getPokemonDetails(url) {
    let response = await fetch (url);
    let pokemonData = await response.json();
    return pokemonData;
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

function setupPokemonSearch() {
    const searchInput = document.getElementById('pokemon-search');
    const searchInfo = document.getElementById('search-info');

    searchInput.addEventListener('input', function () {
        const filterword = this.value.trim().toLowerCase();
        if (filterword.length === 0) {
            searchInfo.classList.remove('visible');
            renderPokemon(pokemons);
            return;
        }
        if (filterword.length < 3) {
            searchInfo.classList.add('visible');
        } else {
            searchInfo.classList.remove('visible');
            filterAndShowPokemon(filterword);
        }
    });
    searchInput.addEventListener('focus', function () {
        if (searchInput.value.trim().length < 3 && searchInput.value.trim().length > 0) {
            searchInfo.classList.add('visible');
        }
    });
    searchInput.addEventListener('blur', function () {
        searchInfo.classList.remove('visible');
    });
}

async function loadPokemonWithDetails() {
    const response = await getPokemon();
    return Promise.all(
        response.results.map(async (pokemon) => {
            const details = await getPokemonDetails(pokemon.url);
            return { 
                name: pokemon.name, 
                url: pokemon.url, 
                types: details.types
            };
        })
    );
}