
let currentSong = new Audio();
let songs;
let currFolder;

const convertToMinutesSeconds = (seconds) => {
    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remseconds = Math.floor(seconds % 60);

    // Format minutes and seconds to be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remseconds).padStart(2, '0');

    // Return the formatted time as MM:SS
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsong(folder) {
    currFolder=folder
    let song = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await song.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songul = document.querySelector(".playlist2").getElementsByTagName("ul")[0];
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li class="track">
        <div class="music"><img src="Img/music.svg" alt=""></div>
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div></div>
            </div>
            <div class="play">
                <div id="ppl">Play now <img src="Img/play-solid.svg" alt=""></div>
            </div></li>`;
    }

    Array.from(document.querySelector(".playlist2").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
           
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });
   return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "Img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00";
}


async function displayAlbum() {
    let song = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await song.text();
    let div = document.createElement("div");
    div.innerHTML=response
    let anchor = div.getElementsByTagName("a")
    let card=document.querySelector(".card")
    let array=Array.from(anchor)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];

        if(e.href.includes("/songs")){
            let folder=e.href.split("/").slice(-2)[0]
            let song = await fetch(`/songs/${folder}/info.json`)
            let response=await song.json();
            console.log(response)
            card.innerHTML=card.innerHTML+` <li class="li" data-folder="${folder}" >
                <img width="200px" height="150px" src="/songs/${folder}/cover.jfif" alt="">
                <img   class="pilay" src="pilay.jfif" alt="">
                <p>${response.title}</p>
                <h4>${response.description}</h4>
            </li>`
        }
    }
    Array.from(document.getElementsByClassName("li")).forEach(e=>{
      
        e.addEventListener("click", async item=>{
            console.log("Fetching Songs")
            songs = await getsong(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    }) 
   
    
}
async function main() {
     await getsong("songs/motisongs");
     playMusic(songs[0], true);

    displayAlbum()

    const playButton = document.getElementById("play");
    playButton.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playButton.src = "Img/pause.svg";
        } else {
            currentSong.pause();
            playButton.src = "Img/play-solid.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
       
        document.querySelector(".songtime").innerHTML = `${convertToMinutesSeconds(currentSong.currentTime)}/${convertToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    const prev=document.getElementById("prev");
    prev.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }

    })
    const next=document.getElementById("next");
    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1)>length){
            playMusic(songs[index+1])
        }

    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
     
        currentSong.volume=parseInt(e.target.value)/100
    })
    
 

    document.querySelector(".menu").addEventListener("click",()=>{
        document.querySelector(".side").style.left=0;
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".side").style.left="-100%";
    })

   

}


main();
