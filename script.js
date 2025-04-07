function makePageForEpisodes(films) {
  const movieContainer = document.querySelector("#movie-container");
  const movieTemplate = document.querySelector("#movie-template");
  const episodeCount = document.createElement("div"); // createed a div element for each episode count in other to count how many episodes.
  episodeCount.id = "episode-count"; // the id of the episode count.
  episodeCount.textContent = `Got ${films.length} episode(s)`; // implemented template literal to display the number of episodes.

  // Clear previous movie cards
  // movieContainer.innerHTML = "";
  //

  const movieCards = movieContainer.querySelectorAll(".movie-card");
  movieCards.forEach((card) => {
    card.remove();
  });

  const episodeCount = document.createElement("div");
  episodeCount.id = "episode-count";
  episodeCount.textContent = `Got ${films.length} episode(s)`;
  movieContainer.appendChild(episodeCount);

  films.forEach((film) => {
    const movieCard = movieTemplate.content.cloneNode(true);

    movieCard.querySelector(".title").textContent = `${film.name}: S${String(
      film.season
    ).padStart(2, "0")}E${String(film.number).padStart(2, "0")}`;

    const img = movieCard.querySelector("img");
    img.src = film.image.medium;
    img.alt = film.title;

    const details = movieCard.querySelector(".details");
    details.innerHTML = `
        <p>${film.summary}</p>
      

    `;

    movieContainer.appendChild(movieCard);
  });
}

function liveSearch(films) {
  const searchInput = document.querySelector("#search-input");
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();

    // Filter episodes based on name or summary
    const filteredFilms = films.filter((film) => {
      return (
        film.name.toLowerCase().includes(query) ||
        film.summary?.toLowerCase().includes(query)
      );
    });

    // Update episode count
    const episodeCount = document.querySelector("#episode-count");
    episodeCount.textContent = `Got ${filteredFilms.length} episode(s) matching the search`;

    makePageForEpisodes(filteredFilms); // Re-render with filtered results
  });
}

function episodeSelector(films) {
  const selectInput = document.querySelector("#episode-select");
  selectInput.innerHTML = ""; // Clear previous options

  // Populate the select dropdown with episodes
  films.forEach((film) => {
    const option = document.createElement("option");
    option.value = film.id; // Assuming each episode has a unique 'id'
    option.textContent = `S${String(film.season).padStart(2, "0")}E${String(
      film.number
    ).padStart(2, "0")} - ${film.name}`;
    selectInput.appendChild(option);
  });
  // Event listener to navigate to the selected episode
  selectInput.addEventListener("change", function () {
    const selectedEpisodeId = selectInput.value;
    const selectedEpisode = films.find((film) => film.id === selectedEpisodeId);

    if (selectedEpisode) {
      // Clear the container and display only the selected episode
      const movieContainer = document.querySelector("#movie-container");
      movieContainer.innerHTML = ""; // Clear previous content
      makePageForEpisodes([selectedEpisode]);
    }
  });
}

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  liveSearch(allEpisodes);
  episodeSelector(allEpisodes);
}

window.onload = setup;
