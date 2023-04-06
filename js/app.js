
const setActive = (elm, selector) => {
  const active = "active";
  if (document.querySelector(`${selector}.${active}`) !== null) {
    document.querySelector(`${selector}.${active}`).classList.remove(active);
  }
  elm.classList.add(active);
};

const filterCards = () => {
  const cardItemLocation = document.querySelectorAll('[data-location]');
  const cardItemType = document.querySelectorAll('[data-item]');

  const activeTypeFilter = document.querySelector('.filter-link.active').dataset.filter;
  const activeDisplayFilter = document.querySelector('.filter-location.active').dataset.display;

  cardItemLocation.forEach((card) => {
    const cardType = card.dataset.item;
    const cardLocation = card.dataset.location;

    if ((activeTypeFilter === 'all' || cardType === activeTypeFilter) && cardLocation === activeDisplayFilter) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

const initializeFilters = () => {
  const cardItemType = document.querySelectorAll('[data-item]');
  const filterByType = document.querySelectorAll("[data-filter]");
  filterCardsType(filterByType, cardItemType);

  const cardItemLocation = document.querySelectorAll('[data-location]');
  const filterByLocation = document.querySelectorAll('[data-display]');
  filterCardsDisplay(filterByLocation, cardItemLocation);

  document.querySelector('.filter-location.active').click();
};

const filterCardsType = (filterByType) => {
  for (const link of filterByType) {
    link.addEventListener("click", function () {
      setActive(link, ".filter-link");
      filterCards();
    });
  }
};


const filterCardsDisplay = (filterByLocation) => {
  for (const link of filterByLocation) {
    link.addEventListener("click", function () {
      setActive(link, ".filter-location");
      filterCards();
    });
  }
};

const cardHtml = (pokemon) => {
  const hpStat = pokemon.stats.find((stat) => stat.stat.name === "hp");
  const card = `
    <div class="card" data-item="${pokemon.types[0].type.name}" data-location="collection">
      <div class="card-header">
        <h3 class="poke-name">${pokemon.name}</h3>
        <span class="poke-hp">HP ${hpStat ? hpStat.base_stat : "N/A"}</span>
      </div>
      <div class="poke-img">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      </div>
      <div class="poke-abilities">
        <h4 class="ability-title">Ability: ${pokemon.abilities[0].ability.name}</h4>
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
      card.setAttribute("data-location", "favorite");
    } else {
      document.getElementById("favorite-cards").removeChild(card);
      document.getElementById("poke-cards").appendChild(card);
      favoriteButton.textContent = "Add to Favorites";
      favoriteButton.setAttribute("data-status", "collections");
      card.setAttribute("data-location", "collection");
    }

    initializeFilters()
  });
};

const url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${20}`;
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const fetchDataPromises = data.results.map((result) => {
      const pokemonUrl = result.url;
      return fetch(pokemonUrl)
      .then((res) => res.json())
        .then((pokemonData) => {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = cardHtml(pokemonData).trim();
          const cardElement = wrapper.firstChild;
          document.getElementById("poke-cards").appendChild(cardElement);
          addOrRemoveFromFavorites(cardElement);
        })
        .catch((err) => console.error("error:" + err));
    });
    Promise.all(fetchDataPromises).then(() => {
      initializeFilters();
    });
  })
  .catch((err) => console.error("error:" + err));
  


