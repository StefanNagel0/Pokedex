function getPokemonTemplate(pokemon, index) {
    const mainType = pokemon.types[0].type.name;
    return `
    <div onclick="openPopup(${index !== undefined ? index : 0})" id="pokemon_card" class="pokemon-card">
        ${getPokemonCardHeader(pokemon)}
        ${getPokemonCardImage(pokemon, mainType)}
        ${getPokemonCardDetails(pokemon.types)}
    </div>
    `;
}

function getPokemonCardHeader(pokemon) {
    return `
    <div class="pokemon-header">
        <div>
            <h2>#${pokemon.id}</h2>
        </div>
        <div>
            <h2>${pokemon.name}</h2>
        </div>
    </div>
    `;
}

function getPokemonCardImage(pokemon, mainType) {
    return `
    <div class="pokemon-image pokemon-type ${mainType}">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>
    `;
}

function getPokemonCardDetails(types) {
    return `
    <div class="pokemon-details">
        ${types
            .map(type => `<img class="pokemon-type-icon" src="${getTypeIcon(type.type.name)}" alt="${type.type.name}">`)
            .join(" ")}
    </div>
    `;
}

function getTypeIcon(typeName) {
    return `./assets/img/types/${typeName}.png`;
}
