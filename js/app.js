


const url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${20}`;


fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    for (let i = 0; i < data.results.length; i++) {
      const pokemonUrl = data.results[i].url;
      fetch(pokemonUrl)
        .then(res => res.json())
        .then(pokemon => {
          const ability = pokemon.abilities && pokemon.abilities[0] ? pokemon.abilities[0].ability : null;
          const hpStat = pokemon.stats.find(stat => stat.stat.name === 'hp');

          const card = `
            <div class="card">
              <div class="card-header">
                <h3 class="poke-name">${pokemon.name}</h3>
                <span class="poke-hp">HP ${hpStat ? hpStat.base_stat : 'N/A'}</span>
              </div>
              <div class="poke-img">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
              </div>
              <div class="poke-abilities">
                <h4 class="ability-title">Ability: ${ability ? ability.name : 'No ability available'}</h4>
              </div>
            </div>
          `;
          document.getElementById("poke-cards").insertAdjacentHTML('beforeend', card);
        })
        .catch(err => console.error('error:' + err));
    }
  })
  .catch(err => console.error('error:' + err));


