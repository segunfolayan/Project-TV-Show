// Function to generate episode cards on the page
function makePageForEpisodes(films) {

  const movieContainer = document.querySelector("#movie-container");  // Get the container where the movies will be displayed
  const movieTemplate = document.querySelector("#movie-template"); // Get the HTML template for the movie cared

  // clears previous movie cards
  const movieCards = movieContainer.querySelectorAll(".movie-card");
  movieCards.forEach((card) => {
    card.remove();
  });

  // Find or create the element that displays the episode count
  let episodeCount = document.querySelector("#episode-count");
  if (!episodeCount) {
    episodeCount = document.createElement("div"); //Create a new element if it does not exist
    episodeCount.id = "episode-count";  // Set its ID
    movieContainer.prepend(episodeCount); //Add it at the top of the container
  }

  episodeCount.textContent = `Got ${films.length} episode(s)`; //Update the text with how many elements are being shown

  // Loop through each element in the array
  films.forEach((film) => {
    const movieCard = movieTemplate.content.cloneNode(true); //Clone the content of the movie template

    //Set the title in a specific format
    movieCard.querySelector(".title").textContent = `${film.name}: S${String(
      film.season
    ).padStart(2, "0")}E${String(film.number).padStart(2, "0")}`;

    //Set the image and its alt text
    const img = movieCard.querySelector("img");
    img.src = film.image.medium;
    img.alt = film.title;

    //Add the summary of the film to the details section
    const details = movieCard.querySelector(".details");
    details.innerHTML = ` <p>${film.summary}</p> `;

    movieContainer.appendChild(movieCard); //Add the card to the movie container
  });
}

//This is a function which filter episodes as the user types
function liveSearch(films) {
  const searchInput = document.querySelector("#search-input");

  //Listen for typing in the search input
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase().trim(); //Gets the user's query and convert it into a lower case and trim it also

    //Filter episodes where tje name or summary includes the query
    const filteredFilms = films.filter((film) => {
      return (
        film.name.toLowerCase().includes(query) ||
        film.summary?.toLowerCase().includes(query)
      );
    });

    // Update episode count
    const episodeCount = document.querySelector("#episode-count");
    episodeCount.textContent = `Got ${filteredFilms.length} episode(s) matching the search`;

    makePageForEpisodes(filteredFilms); //Show only filtered films.
  });
}

//A function to populate the episode selection drop down
function episodeSelector(films) {
  const selectInput = document.querySelector("#episode-select");
  selectInput.innerHTML = ""; // Clear previous options

  // Populate the select dropdown with episodes
  films.forEach((film, index) => {
    const option = document.createElement("option");
    option.value = index; // Set the  index as value to easily access selected episode
    option.textContent = `S${String(film.season).padStart(2, "0")}E${String( //set the text content in a suitable format
      film.number
    ).padStart(2, "0")} - ${film.name}`;
    selectInput.appendChild(option);    //Add option to the drop down
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

      // Scroll to the selected episode: I need to understand how this works...giy
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
