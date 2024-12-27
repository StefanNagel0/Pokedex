let currentPokemonIndex = 10;
let currentPokemon = null;


async function openPopup(index) {
    const overlay = document.getElementById('pokemon_overlay');
    overlay.classList.add('active');
    currentPokemon = pokemons[index];
    const popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = getPokemonPopupTemplate(currentPokemon);
    showMain(currentPokemon);
}

function closePopup() {
    const overlay = document.getElementById('pokemon_overlay');
    overlay.classList.remove('active');
}

function prevPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        openPopup(currentPokemonIndex);
    }
}

function nextPokemon() {
    if (currentPokemonIndex < pokemons.length - 1) {
        currentPokemonIndex++;
        openPopup(currentPokemonIndex);
    }
}