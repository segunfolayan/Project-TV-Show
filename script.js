function makePageForEpisodes(films) {
  const movieContainer = document.querySelector("#movie-container");
  const movieTemplate = document.querySelector("#movie-template");

  
  films.forEach(film => {
    const movieCard = movieTemplate.content.cloneNode(true);

    movieCard.querySelector(".title").textContent = 
    
    `${film.name}: S${String(film.season).padStart(2,"0")}E${String(film.number).padStart(2,"0")}` ;

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

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

window.onload = setup;



