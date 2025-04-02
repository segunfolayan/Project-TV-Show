//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

//function makePageForEpisodes(episodeList) {
 // const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
//}


function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const template = document.getElementById("episode-template"); 

  rootElem.innerHTML = ""; 

  episodeList.forEach((episode) => {
    
    const episodeCard = template.content.firstElementChild.cloneNode(true);

  
    episodeCard.querySelector("#title").textContent = 
      `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;

    episodeCard.querySelector(".episode-image img").src = 
      episode.image ? episode.image.medium : "https://via.placeholder.com/210x295";
    episodeCard.querySelector(".episode-image").alt = episode.name;

    episodeCard.querySelector("#details").innerHTML = episode.summary;

    rootElem.appendChild(episodeCard);
  });
}

// Run setup when the page loads
window.onload = setup;


