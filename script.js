let pokemons = []

const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";


function init() {
    getPokemon().then(pokemonData =>{
        pokemons = pokemonData.results;
        renderPokemon();
    });
}

async function getPokemon() {
    let response = await fetch(BASE_URL);
    let responseToJson = await response.json(); 
    return responseToJson;
}

function renderPokemon() {
    const pokemonContainer = document.getElementById("pokemon_load_content");
    pokemonContainer.innerHTML = "";

    (async function loadPokemon() {
        for (let i = 0; i < pokemons.length; i++) {
            const pokemonDetails = await getPokemonDetails(pokemons[i].url);
            pokemonContainer.innerHTML += getPokemonTemplate(pokemonDetails);
        }
    })();
}

async function getPokemonDetails(url) {
    let response = await fetch (url);
    let pokemonData = await response.json();
    return pokemonData;
}
