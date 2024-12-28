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
    const getSprite = async (name) => (await (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)).json()).sprites.front_default;

    const traverseChain = async (node) => {
        const sprite = await getSprite(node.species.name);
        if (sprite) evolutionImages.push(sprite);
        for (const next of node.evolves_to) await traverseChain(next);
    };

    await traverseChain(chain);
    return evolutionImages;
}

async function showEvoChain() {
    updateDynamicContent(getLoadingSpinner());
    try {
        const evoChainData = await fetchEvoChain(currentPokemon.id);
        const evoImages = await parseEvolutionChain(evoChainData.chain);
        updateDynamicContent(getEvoContent(evoImages));
    } catch (error) {
        console.error('Fehler beim Abrufen der Evolutionskette:', error);
        updateDynamicContent(getErrorMessage());
    }
}