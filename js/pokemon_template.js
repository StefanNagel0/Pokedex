function getPokemonTemplate(pokemon, index) {
    const mainType = pokemon.types[0].type.name;
    return `
    <div onclick="openPopup(${index !== undefined ? index : 0})" id="pokemon_card" class="pokemon-card">
        <div class="pokemon-header">
            <div>
                <h2>#${pokemon.id}</h2>
            </div>
            <div>
                <h2>${pokemon.name}</h2>
            </div>
        </div>
        <div class="pokemon-image pokemon-type ${mainType}">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-details">
            ${pokemon.types
                .map(type => `<img class="pokemon-type-icon" src="${getTypeIcon(type.type.name)}" alt="${type.type.name}">`)
                .join(" ")}
        </div>
    </div>
    `;
}

function getTypeIcon(typeName) {
    return `./assets/img/types/${typeName}.png`;
}

function getPokemonPopupTemplate(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const spriteUrl = pokemon?.sprites?.front_default || './assets/img/types/bug.png';
    if (!pokemon || !pokemon.sprites || !pokemon.sprites.front_default) {
        console.error('Pokemon-Objekt oder front_default-Sprite fehlt', pokemon);
        return '';
    }
    return `
        <div class="pokemon-popup">
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
        <div class="pokemon-image-overlay  pokemon-type ${mainType}">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-details">
            ${pokemon.types
                .map(type => `<img class="pokemon-type-icon" src="${getTypeIcon(type.type.name)}" alt="${type.type.name}">`)
                .join(" ")}
        </div>
        </div>
    `;
}

