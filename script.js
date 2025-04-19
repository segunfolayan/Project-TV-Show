let allShows = [];
//....................................................

//......................................................
const searchBox = document.getElementById("show-search");
const showCount = document.getElementById("show-count");

//searchBox.addEventListener("input",  () => {
 // const query = searchBox.value.toLowerCase().trim();
 // const filteredShows = allShows.filter((show) => {
    //return (
      //show.name.toLowerCase().includes(query) ||
      //show.genres.join(' ').toLowerCase().includes(query) ||
     // show.summary?.toLowerCase().includes(query)
    //);
  //});

 // showCount.textContent = `Found ${filteredShows.length} show(s)`;
 // renderShows(filteredShows); // Assuming this function updates your UI
//});


function setupSearch() {
  const searchInput = document.getElementById("show-search");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allShows.filter((show) =>
    show.name.toLowerCase().includes(query)||
    show.genres.join(' ').toLowerCase().includes(query) ||
    show.summary?.toLowerCase().includes(query)
    );
    displayShows(filtered);
    showCount.textContent = `Found ${filtered.length} show(s)`;
    populateDropdown(filtered);
  });
}


function displayShows(shows) {
  const container = document.getElementById("show-container");
  container.innerHTML = "";

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.className = "show-card";

    card.innerHTML = `
      <div class="card-left">
        <h2 class="card-title">${show.name}</h2>
        <div class="card-info">
          <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
          <p><strong>Status:</strong> ${show.status}</p>
          <p><strong>Rating:</strong> ${show.rating?.average ?? "N/A"}</p>
          <p><strong>Runtime:</strong> ${show.runtime ?? "N/A"} min</p>
        </div>
      </div>
      <div class="card-middle">
        ${show.summary}
      </div>
      <div class="card-right">
        <img src="${show.image?.medium ?? ''}" alt="${show.name}" />
      </div>
    `;

    container.appendChild(card);
  });
}

function populateDropdown(shows) {
  const dropdown = document.getElementById("show-select");
  dropdown.innerHTML = `<option value="">Select a show</option>`;
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", () => {
    const selectedId = parseInt(dropdown.value);
    if (!selectedId) {
      displayShows(allShows);
    } else {
      window.location.href = `Episodeloader.html?showId=${selectedId}`;
    }
  });
}


async function fetchAllShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    const data = await response.json();
    allShows = data.sort((a, b) => a.name.localeCompare(b.name));
    displayShows(allShows);
    populateDropdown(allShows);
    setupSearch();
    showCount.textContent = `Found ${allShows.length} show(s)`;
  } catch (error) {
    console.error("Error fetching shows:", error);
  }
}

window.onload = fetchAllShows;
