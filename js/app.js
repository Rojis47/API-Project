const cardHtml = (pokemon) => {
  const hpStat = pokemon.stats.find((stat) => stat.stat.name === "hp");
  const card = `
            <div class="card">
              <div class="card-header">
                <h3 class="poke-name">${pokemon.name}</h3>
                <span class="poke-hp">HP ${
                  hpStat ? hpStat.base_stat : "N/A"
                }</span>
              </div>
              <div class="poke-img">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
              </div>
              <div class="poke-abilities">
                <h4 class="ability-title">Ability: ${
                  pokemon.abilities[0].ability.name
                }</h4>
                <button class="favorite-btn" data-status="collections">Add to Favorites</button>
              </div>
              
            </div>
          `;
  return card;
};

const addOrRemoveFromFavorites = (card) => {
  const favoriteButton = card.querySelector(".favorite-btn");
  favoriteButton.addEventListener("click", () => {
    const status = favoriteButton.getAttribute("data-status");

    if (status === "collections") {
      document.getElementById("poke-cards").removeChild(card);
      document.getElementById("favorite-cards").appendChild(card);
      favoriteButton.textContent = "Remove from Favorites";
      favoriteButton.setAttribute("data-status", "favorites");
    } else {
      document.getElementById("favorite-cards").removeChild(card);
      document.getElementById("poke-cards").appendChild(card);
      favoriteButton.textContent = "Add to Favorites";
      favoriteButton.setAttribute("data-status", "collections");
    }
  });
};

const url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${20}`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    for (let i = 0; i < data.results.length; i++) {
      const pokemonUrl = data.results[i].url;
      fetch(pokemonUrl)
        .then((res) => res.json())
        .then((pokemonData) => {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = cardHtml(pokemonData).trim();
          const cardElement = wrapper.firstChild;
          document.getElementById("poke-cards").appendChild(cardElement);
          addOrRemoveFromFavorites(cardElement);
        })
        .catch((err) => console.error("error:" + err));
    }
  })
  .catch((err) => console.error("error:" + err));
