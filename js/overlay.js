let currentPokemonIndex = 10;

function openPopup(index) {
    currentPokemonIndex = index; 
    const pokemon = pokemons[currentPokemonIndex];
    const popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = getPokemonPopupTemplate(pokemon);
    document.getElementById('pokemon_overlay').classList.remove('d_none');
}

function closePopup() {
    document.getElementById('pokemon_overlay').classList.add('d_none');
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
