function makePageForEpisodes(films) {
  const movieContainer = document.querySelector("#movie-container");
  const movieTemplate = document.querySelector("#movie-template");

  // Loop through the movie data and dynamically create movie cards
  films.forEach(film => {
    const movieCard = movieTemplate.content.cloneNode(true);

    movieCard.querySelector(".title").textContent = film.title;

    const img = movieCard.querySelector("img");
    img.src = film.image;
    img.alt = film.title;

    const details = movieCard.querySelector(".details");
    details.innerHTML = `
      <p><strong>Director:</strong> ${film.director}</p>
      <p><strong>Certificate:</strong> ${film.certificate}</p>
      <p><strong>Duration:</strong> ${film.duration} minutes</p>
    `;

    movieContainer.appendChild(movieCard);
  });
}

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

window.onload = setup;



