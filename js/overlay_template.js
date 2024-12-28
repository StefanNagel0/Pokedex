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
        <button onclick="prevPokemon()"><img src="./assets/icons/png/arrow_back.png" alt="arrow"></button>
        <button onclick="nextPokemon()"><img src="./assets/icons/png/arrow_forward.png" alt="arrow"></button>
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
    const abilitiesHtml = pokemon.abilities
        .map(ability => `
            <div class="main_ability">
                <div>Ability:</div>
                <div>${ability.ability.name}</div>
            </div>
        `)
        .join('');

    const mainContent = `
        <div class="pokemon-main-info">
        <div class="main_info_margin">
            <div class="main_info_flex">
                <div>height:</div>
                <div>${pokemon.height}</div>
            </div>
            <div class="main_info_flex">
                <div>weight:</div>
                <div>${pokemon.weight}</div>
            </div>
            <div class="main_info_flex">
                <div>Base Experience:</div>
                <div>${pokemon.base_experience}</div>
            </div>
        </div>
            <h4>Abilities:</h4>
            <ul class="main_abilities_html">${abilitiesHtml}</ul>
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
        return;
    }

    const statsHtml = pokemon.stats
        .map(stat => `
            <div class="row-stats">
                <div>${stat.stat.name}:</div>
                <div>${stat.base_stat}</div>
            </div>
        `)
        .join('');
    const statsContent = `
        <div class="pokemon-stats-info">
            <h4>Stats:</h4>
            ${statsHtml}
        </div>
    `;
    const dynamicContent = document.getElementById('show_main_content');
    if (dynamicContent) {
        dynamicContent.innerHTML = statsContent;
    }
}

async function showEvoChain() {
    if (!currentPokemon) {
        console.error('Kein aktuelles Pokémon verfügbar für Evolutionskette.');
        return;
    }

    const dynamicContent = document.getElementById('show_main_content');
    if (!dynamicContent) {
        console.error('Container für Hauptinhalt nicht gefunden!');
        return;
    }
    // Lade-Spinner anzeigen
    dynamicContent.innerHTML = `
        <div class="loading-spinner-content">
            <img src="./assets/gifs/load_animation.gif" alt="Loading...">
        </div>
    `;
    try {
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon.id}/`;
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const evoChainUrl = speciesData.evolution_chain.url;
        const evoChainResponse = await fetch(evoChainUrl);
        const evoChainData = await evoChainResponse.json();
        const evoImages = await parseEvolutionChain(evoChainData.chain);
        // Evolution-Kette anzeigen
        const evoContent = `
            <div class="evolution-chain">
                <h4>Evolutionslinie:</h4>
                <div class="evolution-images">
                    ${evoImages.map(img => `<img src="${img}" alt="Evolution Pokémon">`).join('')}
                </div>
            </div>
        `;
        dynamicContent.innerHTML = evoContent;
    } catch (error) {
        console.error('Fehler beim Abrufen der Evolutionskette:', error);
        // Fehlernachricht anzeigen
        dynamicContent.innerHTML = `
            <div class="error-message">
                Fehler beim Laden der Evolutionskette. Bitte versuchen Sie es später erneut.
            </div>
        `;
    }
}


// async function showEvoChain() {
//     if (!currentPokemon) {
//         console.error('Kein aktuelles Pokémon verfügbar für Evolutionskette.');
//         return;
//     }

//     try {
//         const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon.id}/`;
//         const speciesResponse = await fetch(speciesUrl);
//         const speciesData = await speciesResponse.json();
//         const evoChainUrl = speciesData.evolution_chain.url;
//         const evoChainResponse = await fetch(evoChainUrl);
//         const evoChainData = await evoChainResponse.json();
//         const evoImages = await parseEvolutionChain(evoChainData.chain);
//         const evoContent = `
//             <div class="evolution-chain">
//                 <h4>Evolutionslinie:</h4>
//                 <div class="evolution-images">
//                     ${evoImages.map(img => `<img src="${img}" alt="Evolution Pokémon">`).join('')}
//                 </div>
//             </div>
//         `;
//         const dynamicContent = document.getElementById('show_main_content');
//         if (dynamicContent) {
//             dynamicContent.innerHTML = evoContent;
//         }
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Evolutionskette:', error);
//     }
// }