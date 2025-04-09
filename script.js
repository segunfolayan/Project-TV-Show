function makePageForEpisodes(films) {
  const movieContainer = document.querySelector("#movie-container");
  const movieTemplate = document.querySelector("#movie-template");

  // Clear previous movie cards
  // movieContainer.innerHTML = "";

  const movieCards = movieContainer.querySelectorAll(".movie-card");
  movieCards.forEach((card) => {
    card.remove();
  });

  let episodeCount = document.querySelector("#episode-count");
  if (!episodeCount) {
    episodeCount = document.createElement("div");
    episodeCount.id = "episode-count";
    movieContainer.prepend(episodeCount);
  }

  episodeCount.textContent = `Got ${films.length} episode(s)`;

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
    const query = searchInput.value.toLowerCase().trim();

    // if (query === "") {
    //   // Show all episodes if input is empty
    //   filteredFilms = films;

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
  films.forEach((film, index) => {
    const option = document.createElement("option");
    option.value = index; // Use index as value to easily access selected episode
    option.textContent = `S${String(film.season).padStart(2, "0")}E${String(
      film.number
    ).padStart(2, "0")} - ${film.name}`;
    selectInput.appendChild(option);
  });

  // Event listener to handle episode selection
  selectInput.addEventListener("change", (event) => {
    const selectedIndex = event.target.value; // Get the selected index
    if (selectedIndex === "") {
      // If no episode is selected, show all episodes
      makePageForEpisodes(films);
    } else {
      // Show only the selected episode
      const selectedEpisode = films[selectedIndex];
      makePageForEpisodes([selectedEpisode]); // Render the selected episode

      // Scroll to the selected episode
      const episodeElement = document.querySelector(
        `#episode-${selectedEpisode.id}`
      );
      if (episodeElement) {
        episodeElement.scrollIntoView({
          behavior: "smooth",
          block: "start", // Scroll the episode to the top of the page
        });
      }
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
