let currentPokemonIndex = 0;
let currentPokemon = null;


async function openPopup(index) {
    currentPokemonIndex = index;
    const overlay = document.getElementById('pokemon_overlay');
    overlay.classList.add('active');
    currentPokemon = pokemons[index];
    const popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = getPokemonPopupTemplate(currentPokemon);
    showMain(currentPokemon);

    overlay.addEventListener('click', handleOverlayClick);
}

function closePopup() {
    const overlay = document.getElementById('pokemon_overlay');
    overlay.classList.remove('active');
    overlay.removeEventListener('click', handleOverlayClick);
}

function handleOverlayClick(event) {
    const popupContent = document.getElementById('popup-content');
    if (!popupContent.contains(event.target)) {
        closePopup();
    }
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

async function parseEvolutionChain(chain) {
    const evolutionImages = [];

    async function getSprite(pokemonName) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
        const data = await response.json();
        return data.sprites.front_default;
    }

    async function traverseChain(chainNode) {
        const sprite = await getSprite(chainNode.species.name);
        if (sprite) {
            evolutionImages.push(sprite);
        }
        if (chainNode.evolves_to.length > 0) {
            for (const nextChain of chainNode.evolves_to) {
                await traverseChain(nextChain);
            }
        }
    }

    await traverseChain(chain);
    return evolutionImages;
}