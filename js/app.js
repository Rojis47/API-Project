//* Utility function to set an element as active
const setActive = (elm, selector) => {
  const active = "active";
  if (document.querySelector(`${selector}.${active}`) !== null) {
    document.querySelector(`${selector}.${active}`).classList.remove(active);
  }
  elm.classList.add(active);
};

//* Filter cards based on active type and display filters
const filterCards = () => {
  const cardItemLocation = document.querySelectorAll("[data-location]");

  const activeTypeFilter = document.querySelector(".filter-link.active").dataset
    .filter;
  const activeDisplayFilter = document.querySelector(".filter-location.active")
    .dataset.display;

  cardItemLocation.forEach((card) => {
    const cardType = card.dataset.item;
    const cardLocation = card.dataset.location;

    if (
      (activeTypeFilter === "all" || cardType === activeTypeFilter) &&
      cardLocation === activeDisplayFilter
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

//* filter a-z
const sortCards = (order) => {
  const cardsContainer = document.getElementById("poke-cards");
  const cards = Array.from(cardsContainer.children);

  cards.sort((a, b) => {
    const nameA = a.querySelector(".poke-name").textContent.toLowerCase();
    const nameB = b.querySelector(".poke-name").textContent.toLowerCase();

    if (order === "az") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  cards.forEach((card) => {
    cardsContainer.appendChild(card);
  });

  filterCards();
};

document.getElementById("sort-az").addEventListener("click", () => {
  sortCards("az");
});

document.getElementById("sort-za").addEventListener("click", () => {
  sortCards("za");
});

//* Initialize filter event listeners
const initializeFilters = () => {
  const filterByType = document.querySelectorAll("[data-filter]");
  const filterByLocation = document.querySelectorAll("[data-display]");

  addFilterTypeEventListeners(filterByType);
  addFilterDisplayEventListeners(filterByLocation);

  document.querySelector(".filter-location.active").click();
};

//* Add event listeners for type filters
const addFilterTypeEventListeners = (filterByType) => {
  for (const link of filterByType) {
    link.addEventListener("click", function () {
      setActive(link, ".filter-link");
      filterCards();
    });
  }
};

//* Add event listeners for display filters
const addFilterDisplayEventListeners = (filterByLocation) => {
  for (const link of filterByLocation) {
    link.addEventListener("click", function () {
      setActive(link, ".filter-location");
      filterCards();
    });
  }
};

//* Create filter buttons with type count
const createFilterButtons = (pokemons) => {
  const typeCounts = getTypeCounts(pokemons);
  renderFilterButtons(typeCounts);
};

//* Count the number of each type in the provided pokemons
const getTypeCounts = (pokemons) => {
  const typeCounts = {};

  pokemons.forEach((pokemon) => {
    const mainType = pokemon.types[0].type.name;
    if (!typeCounts[mainType]) {
      typeCounts[mainType] = 0;
    }
    typeCounts[mainType]++;
  });

  return typeCounts;
};

//* Render filter buttons with type counts
const renderFilterButtons = (typeCounts) => {
  const filterList = document.getElementById("filter-btn");
  filterList.innerHTML =
    '<li data-filter="all" class="filter-btn filter-link type-all active">All</li>';

  Object.keys(typeCounts).forEach((type) => {
    const button = document.createElement("li");
    button.setAttribute("data-filter", type);
    button.classList.add("filter-btn", "filter-link", `type-${type}`);
    button.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ${
      typeCounts[type]
    }`;
    filterList.appendChild(button);
  });

  addFilterTypeEventListeners(document.querySelectorAll("[data-filter]"));
};

const cardHtml = (pokemon) => {
  const hpStat = pokemon.stats.find((stat) => stat.stat.name === "hp");
  const card = `
    <div class="card" data-item="${pokemon.types[0].type.name}" data-location="collection">
    <div class="card-overlay"></div>
    <div class="card-header">
        <h3 class="poke-name">${pokemon.name}</h3>
        <span class="poke-hp">HP ${hpStat ? hpStat.base_stat : "N/A"}</span>
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
      moveCard(card, "poke-cards", "favorite-cards", "Remove from Favorites", "favorites", "favorite");
    } else {
      moveCard(card, "favorite-cards", "poke-cards", "Add to Favorites", "collections", "collection");
    }

    initializeFilters();
  });
};

const moveCard = (
  card,
  fromId,
  toId,
  buttonText,
  buttonStatus,
  cardLocation
) => {
  document.getElementById(fromId).removeChild(card);
  document.getElementById(toId).appendChild(card);
  card.querySelector(".favorite-btn").textContent = buttonText;
  card.querySelector(".favorite-btn").setAttribute("data-status", buttonStatus);
  card.setAttribute("data-location", cardLocation);
};
const fetchPokemons = (url, limit) => {
  return fetch(`${url}?offset=0&limit=${limit}`)
    .then((res) => res.json())
    .then((data) => {
      const fetchDataPromises = data.results.map((result) => {
        return fetch(result.url)
          .then((res) => res.json())
          .catch((err) => console.error("error:" + err));
      });
      return Promise.all(fetchDataPromises);
    })
    .catch((err) => console.error("error:" + err));
};

const renderCards = (pokemons) => {
  pokemons.forEach((pokemonData) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHtml(pokemonData).trim();
    const cardElement = wrapper.firstChild;
    document.getElementById("poke-cards").appendChild(cardElement);
    addOrRemoveFromFavorites(cardElement);
  });
};

const url = "https://pokeapi.co/api/v2/pokemon";
const limit = 20;
fetchPokemons(url, limit).then((pokemons) => {
  renderCards(pokemons);
  createFilterButtons(pokemons);
  initializeFilters();
});
