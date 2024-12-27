let currentPokemonIndex = 10;

function openPopup(index) {
    const overlay = document.getElementById('pokemon_overlay');
    overlay.classList.add('active');// Klasse entfernen, um das Element anzuzeigen

    currentPokemonIndex = index; 
    const pokemon = pokemons[currentPokemonIndex];
    const popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = getPokemonPopupTemplate(pokemon);
}

function closePopup() {
    const overlay = document.getElementById('pokemon_overlay');
    overlay.classList.remove('active'); // Klasse hinzufügen, um das Element auszublenden
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
