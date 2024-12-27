function getPokemonPopupTemplate(pokemon) {
    if (!pokemon || !pokemon.sprites || !pokemon.sprites.front_default) {
        console.error('Pokemon-Objekt oder front_default-Sprite fehlt', pokemon);
        return '';
    }
    const mainType = pokemon.types[0].type.name;
    return `
    <div class="pokemon-popup">
        ${getPokemonHeader(pokemon)}
        ${getPokemonImage(pokemon, mainType)}
        <div class="pokemon-details">
            ${getPokemonTypeIcons(pokemon.types)}
        </div>
        ${getActionButtons()}
        <div id="show_main_content">
        ${showMain(pokemon)}
        </div>
        ${getPokemonNavigationButtons()}
    </div>
    `;
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
        <button onclick="prevPokemon()">Vorheriges</button>
        <button onclick="nextPokemon()">Nächstes</button>
    </div>
    `;
}

function getActionButtons() {
    return `
    <div class="action-buttons">
        <button onclick="showMain(currentPokemon)">main</button>
        <button onclick="showStats(currentPokemon)">stats</button>
        <button onclick="showEvoChain()">evo-chain</button>
    </div>
    `;
}

function showMain(pokemon) {
    const abilitiesHtml = pokemon.abilities
        .map(ability => `<li>${ability.ability.name}</li>`)
        .join('');

    const mainContent = `
        <div class="pokemon-main-info">
            <p>Height: ${pokemon.height}</p>
            <p>Weight: ${pokemon.weight}</p>
            <p>Base Experience: ${pokemon.base_experience}</p>
            <h4>Abilities:</h4>
            <ul>${abilitiesHtml}</ul>
        </div>
    `;
    const dynamicContent = document.getElementById('show_main_content');
    if (dynamicContent) {
        dynamicContent.innerHTML = mainContent;
    }
}

function showStats(pokemon) {
    if (!pokemon || !pokemon.stats) {
        console.error('Pokemon-Daten oder Stats fehlen:', pokemon);
        return `<div class="error-message">Keine Statistiken verfügbar.</div>`;
    }

    const statsHtml = pokemon.stats
        .map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
        .join('');

    const statsContent = `
        <div class="pokemon-stats-info">
            <h4>Stats:</h4>
            <ul>${statsHtml}</ul>
        </div>
    `;

    const dynamicContent = document.getElementById('show_main_content');
    if (dynamicContent) {
        dynamicContent.innerHTML = statsContent;
    }
}
