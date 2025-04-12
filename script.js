// Function to generate episode cards on the page
function makePageForEpisodes(films) {
  const movieContainer = document.querySelector("#movie-container"); // Get the container where the movies will be displayed
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
    episodeCount.id = "episode-count"; // Set its ID
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
  selectInput.innerHTML = "<option>Select an Episode</option>"; // Clear previous options

  // Populate the select dropdown with episodes
  films.forEach((film, index) => {
    const option = document.createElement("option");
    option.value = index; // Set the  index as value to easily access selected episode
    option.textContent = `S${String(film.season).padStart(2, "0")}E${String(
      //set the text content in a suitable format
      film.number
    ).padStart(2, "0")} - ${film.name}`;
    selectInput.appendChild(option); //Add option to the drop down
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

//Function to fetch the list of episodes form the API
async function fetchEpisodes() {
  const endpoint = "https://api.tvmaze.com/shows/82/episodes"; //Defines the source of the data
  const response = await fetch(endpoint); //fetch data from API and wait for response

  if (response.status === 200) {
    //Check is the response is successful
    return response.json(); //return JSON data
  } else {
    return {
      //If there s an error, then return an object with then error message
      error:
        "error status is " +
        response.status +
        " message: " +
        response.statusText,
    };
  }
}

// Selected show  functionality
// ---------------------------------------------------------<------------------------------------<------------------------------------<

let allShow = []; //This is an array that will hold all the shows
//This is an object that will hold the shows

async function selectedShow() {
  const showOption = document.getElementById("select-show"); //Get the select element
  const showCatch = {};

  // if (Object.keys(showCatch).length === 0)
  try {
    const showURL = await fetch("https://api.tvmaze.com/shows"); //Fetch the shows from the API
    if (!showURL.ok) {
      throw new Error(`HTTP error! status: ${showURL.status}`); //Check if the response is ok
    }
    allShow = await showURL.json(); //Fetch the shows from the API

    allShow.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    ); //Sort the shows in alphabetical order

    showOption.innerHTML = "<option>Select a show</option>"; // clear the select element before adding new options

    allShow.forEach((show) => {
      showCatch[show.id] = show; //Add the show to the object
      const option = document.createElement("option");
      option.value = show.id; //Set the value to the show id
      option.textContent = show.name; //Set the text content to the show name
      showOption.appendChild(option); //Add the option to the select element
    });
  } catch (error) {
    //If there is an error, then log it to the console  and show a message
    console.error("Failed to fetch shows:", error);
    showStatusMessage(`Error fetching shows: ${error.message}`, "#f8d7da");
  }

  showOption.addEventListener("change", async (event) => {
    //Listen for changes in the select element
    const selectedShowId = event.target.value; //Get the selected show id
    console.log("Selected Show ID:", selectedShowId); // Debugging line
    if (!selectedShowId) return; //If no show is selected, do nothing

    if (!showCatch[selectedShowId].episodes) {
      //If the show is not in the object, then fetch it
      const episodeRes = await fetch(
        `https://api.tvmaze.com/shows/${selectedShowId}/episodes` //Fetch the episodes from the API
      );
      const episodes = await episodeRes.json(); // convert the response to JSON
      showCatch[selectedShowId] = episodes; //Add the episodes to the object
    }

    const selectedShowEpisodes = showCatch[selectedShowId]; //Get the selected show episodes

    if (
      Array.isArray(selectedShowEpisodes) && //Check if the selected show episodes is an array and not empty
      selectedShowEpisodes.length > 0
    ) {
      makePageForEpisodes(selectedShowEpisodes);
      liveSearch(selectedShowEpisodes);
      episodeSelector(selectedShowEpisodes);
    } else {
      showStatusMessage("No episodes found for this show", "#f8d7da");
    }
  });
}

// ----------------------------------------------------------<------------------------------------<------------------------------------<

//This function displays the status message in a div
function showStatusMessage(message, color = "#f0f0f0") {
  let statusDiv = document.querySelector("#status-message");

  //create status div does not exist then it needs to be created
  if (!statusDiv) {
    statusDiv = document.createElement("div"); //Creates status div
    statusDiv.id = "status-message"; //Assign Id

    //Apply CSS styling to status div
    statusDiv.style.textAlign = "center";
    statusDiv.style.padding = "1rem";
    statusDiv.style.fontSize = "1.1rem";
    statusDiv.style.fontWeight = "bold";

    document.body.insertBefore(statusDiv, document.body.firstChild); //Insert the status div at the top of the document body
  }

  statusDiv.style.backgroundColor = color; //set the background colour of the status div
  statusDiv.textContent = message; //set the text content of the status div to the message provided.
}

//Create a function to display handle and display error message
function handleEpisodeError(response) {
  if (response.error) {
    showStatusMessage(`Error: ${response.error}`, "#f8d7da");
    throw new Error(response.error); // Throw an error to exit early
  }
}

async function setup() {
  showStatusMessage("Loading episodes, please wait...", "#fff3cd"); //show this message while fetching episodes
  const allEpisodes = await fetchEpisodes(); //Fetch episodes
  handleEpisodeError(allEpisodes); //Handle and display any errors during the fetching process
  showStatusMessage(""); //clear the status message after fetching the data
  makePageForEpisodes(allEpisodes); //call this function to generate the page with the available data
  liveSearch(allEpisodes); //Include a search functionally
  episodeSelector(allEpisodes); //Include an episode selector functionality
  selectedShow(); //Include a show selector functionality
}

window.onload = setup;
