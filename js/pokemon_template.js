function getPokemonTemplate(pokemon) {
    const mainType = pokemon.types[0].type.name;
    return`
    <div class="pokemon-card">
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
                <div class="pokemon-details">
                    ${pokemon.types
                        .map(type => `<img class="pokemon-type-icon" src="${getTypeIcon(type.type.name)}" alt="${type.type.name}">`)
                        .join(" ")}
                </div>
            </div>
    </div>
    `
}

function getTypeIcon(typeName) {
    return `./assets/img/types/${typeName}.png`;
}
