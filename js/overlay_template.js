function getPokemonPopupTemplate(pokemon) {
    const mainType = pokemon.types[0].type.name;
    return `
    <div class="pokemon-popup">
        ${getPokemonHeader(pokemon)}
        ${getPokemonImage(pokemon, mainType)}
        <div class="pokemon-details">${getPokemonTypeIcons(pokemon.types)}</div>
        ${getActionButtons()}
        <div id="show_main_content">
        ${showMain(pokemon)}
        </div>
        ${getPokemonNavigationButtons()}
    </div>`;
}

function getPokemonHeader(pokemon) {
    return `
    <div class="pokemon-header-overlay">
        <div>
            <h2>#${pokemon.id}</h2>
        </div>
        <div>
            <h2>${pokemon.name}</h2>
        </div>
        <div>
            <button onclick="closePopup()">X</button>
        </div>
    </div>
    `;
}

function getPokemonImage(pokemon, mainType) {
    return `
    <div class="pokemon-image-overlay pokemon-type ${mainType}">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>
    `;
}

function getPokemonTypeIcons(types) {
    return types
        .map(type => `<img class="pokemon-type-icon" src="${getTypeIcon(type.type.name)}" alt="${type.type.name}">`)
        .join(" ");
}

function getPokemonNavigationButtons() {
    return `
    <div class="overlay-navigation">
        <button onclick="event.stopPropagation(); prevPokemon()">
            <img src="./assets/icons/png/arrow_back.png" alt="arrow">
        </button>
        <button onclick="event.stopPropagation(); nextPokemon()">
            <img src="./assets/icons/png/arrow_forward.png" alt="arrow">
        </button>
    </div>
    `;
}

function getActionButtons() {
    return `
    <div class="action-buttons">
        <button class="button_main" onclick="showMain(currentPokemon)">main</button>
        <button class="button_stats" onclick="showStats(currentPokemon)">stats</button>
        <button class="buttons_evo_chain" onclick="showEvoChain()">evo-chain</button>
    </div>
    `;
}

function showMain(pokemon) {
    const mainContent = `
        <div class="pokemon-main-info">
            ${getMainInfo(pokemon)}
            <h4>Abilities:</h4>
            <ul class="main_abilities_html">${getAbilitiesHtml(pokemon.abilities)}</ul>
        </div>
    `;
    updateDynamicContent(mainContent);
}

function getMainInfo(pokemon) {
    return `
    <div class="main_info_margin">
        ${getInfoRow('height', pokemon.height)}
        ${getInfoRow('weight', pokemon.weight)}
        ${getInfoRow('Base Experience', pokemon.base_experience)}
    </div>`;
}

function getInfoRow(label, value) {
    return `
    <div class="main_info_flex">
        <div>${label}:</div>
        <div>${value}</div>
    </div>`;
}

function getAbilitiesHtml(abilities) {
    return abilities
        .map(ability => `
            <div class="main_ability">
                <div>Ability:</div>
                <div>${ability.ability.name}</div>
            </div>
        `)
        .join('');
}

function updateDynamicContent(content) {
    const dynamicContent = document.getElementById('show_main_content');
    if (dynamicContent) dynamicContent.innerHTML = content;
}

function showStats(pokemon) {
    if (!pokemon?.stats) return console.error('Pokemon-Daten oder Stats fehlen:', pokemon);
    const statsContent = `
        <div class="pokemon-stats-info">
            <h4>Stats:</h4>
            ${getStatsHtml(pokemon.stats)}
        </div>
    `;
    updateDynamicContent(statsContent);
}

function getStatsHtml(stats) {
    return stats
        .map(stat => `
            <div class="row-stats">
                <div>${stat.stat.name}:</div>
                <div>${stat.base_stat}</div>
            </div>
        `)
        .join('');
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

function getLoadingSpinner() {
    return `<div class="loading-spinner-content"><img src="./assets/gifs/load_animation.gif" alt="Loading..."></div>`;
}

function getEvoContent(images) {
    return `
        <div class="evolution-chain">
            <h4>Evolutionslinie:</h4>
            <div class="evolution-images">
                ${images.map(img => `<img src="${img}" alt="Evolution Pokémon">`).join('')}
            </div>
        </div>
    `;
}

function getErrorMessage() {
    return `<div class="error-message">Fehler beim Laden der Evolutionskette. Bitte versuchen Sie es später erneut.</div>`;
}

async function fetchEvoChain(pokemonId) {
    const speciesData = await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`)).json();
    return await (await fetch(speciesData.evolution_chain.url)).json();
}