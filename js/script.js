console.log("Hello Now Going for js");
let currentSong = new Audio();
let songs;

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

async function getsong() {
    let song = await fetch("http://127.0.0.1:3000/songoo/");
    let response = await song.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songoo/")[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songoo/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "Img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00";
}

async function main() {
     songs = await getsong();
    playMusic(songs[0], true);

    let songul = document.querySelector(".playlist").getElementsByTagName("ul")[0];
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

    Array.from(document.querySelector(".playlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });

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
        console.log(currentSong.currentTime, currentSong.duration);
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
