console.log("Lets write javascript");
let songs;
let currentSong = new Audio;

let currFolder;

// funtion to convert seconds to required form 
function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if(isNaN(remainingSeconds)){
        return "00:00";
    }
    
    return `${minutes < 10 ? "0" : '' }${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

//Function to get the folder names 
async function displayAlbums() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let CardContainer = document.querySelector('.cardcontainer');
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');
    // console.log(anchors);
    let array = Array.from(anchors);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs")){
            let folder = (e.href.split("/").slice(-2)[0]);
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            // console.log(response);
            CardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="banner">
                            <div class="svg-container">
                                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24"
                                    class="Svg-sc-ytk21e-0 bneLcE">
                                    <path
                                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                    </path>
                                </svg>
                            </div>
                            <img src="/songs/${folder}/cover.jpg" alt="">
                        </div>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;

        }
    }
    
}
//Function to get songs
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/songs/${folder}/`)[1]);
        }
    }
    // console.log(songs);
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img src="all svg/music.svg" class="invert" alt="">
        <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="PlayNow">
        <span>Play Now</span>
        <img src="all svg/playcircle.svg" class="invert playbtn" alt="">
        </div>
        </li>`
    }
    //Attach an Event listner to every Song
    let songlist = Array.from(document.querySelector('.songList').getElementsByTagName('li'));
    songlist.forEach(element => {
        element.addEventListener('click', function (e) {
            // console.log(element.querySelector('.info').firstElementChild.innerHTML);
            playmusic(element.querySelector('.info').firstElementChild.innerHTML);
        });
    });
    
}


const playmusic = (track,pause=false) => {
    // let audio = new Audio("/songs/"+track);
    // audio.play();
    currentSong.src = `/songs/${currFolder}/` + track;
    if(!pause){
        currentSong.play();
        play.src = "/all svg/pause.svg";
        
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track);
    document.querySelector('.songtime').innerHTML = "00:00/00:00";
}


async function main() {
    // get folder names
    
    // get all the songs list 
    await getSongs("Angry_(mood)");
    // console.log(songs);
    playmusic(songs[0],true);
    
    //display albums
    await displayAlbums();

    
    //Attach an Event listener to play
    play.addEventListener('click', function (e) {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/all svg/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "/all svg/play.svg";

        }
    });

    // Listen for timeUpdate event
    currentSong.addEventListener('timeupdate', function (e) {
        document.querySelector('.songtime').innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector('.circle').style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    });

    // Add a Eventlistener to seekbar
    document.querySelector('.seekbar').addEventListener('click', function (e) {
        let percent = ((e.offsetX/e.target.getBoundingClientRect().width*100));
        console.log(percent);
        document.querySelector('.circle').style.left = percent+"%";
        currentSong.currentTime = (currentSong.duration*percent)/100;
    
    });

    //ADD event listener to the hamburger
    document.querySelector('.hamburger').addEventListener('click', function (e) {
        document.querySelector('.left').style.left = 0;
    });
    //ADD event listener to the close btn
    document.querySelector('.close').addEventListener('click', function (e) {
        document.querySelector('.left').style.left = "-100%";
    });;


    //Add event listener to previous btn
    previous.addEventListener('click', function (e) {
        console.log("previous clicked");
        let index =songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        // console.log(currentSong.src.split('/').slice(-1));
        if (index>0) {
            currentSong.pause();
            playmusic(songs[index-1]);
        }

    });
    //Add event listener to next btn
    next.addEventListener('click', function (e) {
        console.log("next clicked");
        let index =songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        // console.log(currentSong.src.split('/').slice(-1));
        if (index<songs.length-1) {
            currentSong.pause();
            playmusic(songs[index+1]);
        }

    });

    //Add event listener to volume 
    document.querySelector('.range').addEventListener('change', function (e) {
        console.log(e.target.value/100);
        currentSong.volume = parseInt(e.target.value)/100;
    });

    //Add event listener to each card
    Array.from(document.getElementsByClassName('card')).forEach( e=>{
        e.addEventListener('click', async function (e) {
            console.log(e.currentTarget.dataset.folder);
            await getSongs(`${e.currentTarget.dataset.folder}`);
        });
        
    });

    //Add event listener to mute and the volume
    document.querySelector('.volume img').addEventListener('click', function (e) {
        console.log(e.target.src.split("svg/"));
        console.log(e.target.src.includes("volume3.svg"));
        if(e.target.src.includes("volume3.svg")){
           e.target.src =  e.target.src.replace("volume3.svg","mute.svg");
            currentSong.volume = 0;
            document.querySelector('.range').value = 0;
        }
        else{
            e.target.src =  e.target.src.replace("mute.svg","volume3.svg");
            currentSong.volume = 0.2;
            document.querySelector('.range').value = 20;
        }
        
    });;
}
main();