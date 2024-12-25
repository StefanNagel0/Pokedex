let pokemons = []
const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=30&offset=0";


async function init() {
    pokemons = await loadPokemonWithDetails();
    renderPokemon();
    setupPokemonSearch();
}

async function getPokemon() {
    let response = await fetch(BASE_URL);
    let responseToJson = await response.json(); 
    return responseToJson;
}

function renderPokemon(filteredPokemons = null) {
    const pokemonContainer = document.getElementById("pokemon_load_content");
    pokemonContainer.innerHTML = "";
    const pokemonsToRender = filteredPokemons || pokemons;
    (async function loadPokemon() {
        for (let i = 0; i < pokemonsToRender.length; i++) {
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
    const filteredPokemons = pokemons.filter(pokemon => {
        const matchesName = pokemon.name.toLowerCase().includes(filterword.toLowerCase());
        const matchesType = pokemon.types.some(type => type.type.name.toLowerCase().includes(filterword.toLowerCase()));
        return matchesName || matchesType;
    });

    renderPokemon(filteredPokemons);
}

function setupPokemonSearch() {
    const searchInput = document.getElementById('pokemon-search');
    
    searchInput.addEventListener('input', function() {
        const filterword = this.value.trim().toLowerCase();
        filterAndShowPokemon(filterword);
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