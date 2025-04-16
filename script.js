// Function to generate episode cards on the page
function makePageForEpisodes(films) {
  const movieContainer = document.querySelector("#movie-container");
  const movieTemplate = document.querySelector("#movie-template");
  const episodeCount = document.createElement("div"); // createed a div element for each episode count in other to count how many episodes.
  episodeCount.id = "episode-count"; // the id of the episode count.
  episodeCount.textContent = `Got ${films.length} episode(s)`; // implemented template literal to display the number of episodes.

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
    details.innerHTML = `
        <p>${film.summary}</p>
      

    `;

    movieContainer.appendChild(movieCard);
  });
}

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

window.onload = setup; 
