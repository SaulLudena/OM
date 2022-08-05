

//Contenedores donde se mostrará la informacion del artista y sus canciones respectivamente
const artistMetaInfo = document.getElementById("artist-meta-info");
const artistSongs = document.getElementById("songs");
const artistSimilar = document.getElementById("similar-artists");
const topAlbum = document.getElementById("top-album");
const videoPlayerContainer = document.getElementById("videoPlayer-container")

let artistSongDetail = document.getElementById("artist-song-detail")


window.onload = function (){
    showArtistDetail();
}

//Metodo asincrono que muestra los datos de un artista cuando hayan cargado
const showArtistDetail = async()=>{
    try {
        const param = new URLSearchParams(window.location.search);
        const paramval = param.get("artistName").replace(/%20/g, " ");
        BASE_URL_TADB = 'https://www.theaudiodb.com/api/v1/json/2/search.php?s='+paramval;
        BASE_URL_LFM = 'https://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+paramval+'&api_key=a63b4b638a5b1421711915f35d15f602&format=json';

        const response = await fetch(BASE_URL_TADB);
        const myJson = await response.json();
        const artistObjTADB=myJson.artists[0];
        const artistId = artistObjTADB.idArtist;

        artistMetaInfo.innerHTML='';
        artistMetaInfo.innerHTML+=`
                    <div class="artist-img-container">
                        <img src="${artistObjTADB.strArtistThumb}" alt="${artistObjTADB.strArtist}" class="artist-img">
                    </div>
                    <div class="artist-data-container">
                        <h1 class="artist-name">${artistObjTADB.strArtist}</h1>
                        <h3 class="artist-born">${artistObjTADB.intFormedYear}</h3>
                        <h3 class="artist-music-gender">${artistObjTADB.strGenre}</h3>
                    </div>
                `;             
     showArtistSongs(artistId);
     showSimilarArtists(paramval);
     displayMediaPlayerData(paramval ,artistId);

    } catch (e) {
        console.log(e);
    }
}

const showSimilarArtists = async (artist) => {
    try {
      BASE_URL_LFM_SIMILAR ='https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist='+artist+'&api_key=a63b4b638a5b1421711915f35d15f602&format=json'
      const response = await fetch(BASE_URL_LFM_SIMILAR).then((res) => res.json());
      artistSimilar.innerHTML = ''

      response.similarartists.artist.slice(0, 10).forEach((similarArtist) => {
            artistSimilar.innerHTML += `
                <div class="card-album">
                    <div class="card-hover">
                        <span><a href="artists.html?artistName=${similarArtist.name}">${similarArtist.name}</a></span>
                    </div>
                </div>
                `
        })
    } catch (error) {
      console.log(error)
    }
}

const displayMediaPlayerData = async (artistName) =>{
    try {

        BASE_URL_TADB = 'https://www.theaudiodb.com/api/v1/json/2/search.php?s='+artistName;
        const response3 = await fetch(BASE_URL_TADB);
        const myJson3 = await response3.json();
        const artistObjTADB2=myJson3.artists[0];


        artistSongDetail.innerHTML=''
        artistSongDetail.innerHTML+=`
            <div class="artist-song-detail-img">
                 <img src="${artistObjTADB2.strArtistThumb}" alt="" class="artist-img">
            </div>
            <div class="artist-song-detail-info d-flex flex-column">
                <span></span>
                <span>${artistObjTADB2.strArtist}</span>
            </div>
        `;
    } catch (error) {
        console.log(error)
    }
}

const showArtistSongs = async(id)=>{
    try {
        BASE_URL_TADB_TRACKS= 'https://theaudiodb.com/api/v1/json/2/mvid.php?i='+id;
        const response2 = await fetch(BASE_URL_TADB_TRACKS);
        const myJson2 = await response2.json();
        //console.log(myJson2);
            for(var i=0;i<myJson2.mvids.length;i++){
				const button= document.createElement("button");
				button.innerHTML=`
				<li class="song d-flex justify-content-between align-items-center cancion" id="cancion">
				<span class=" d-flex justify-content-between align-items-center">
					<div class="song-name-container">
						<span class="song-name">${myJson2.mvids[i].strTrack}</span>
					</div>
				</span>
				<span>
					<i class="fas fa-play-circle"></i>
				</span>
				</li>
				`
				function playVideo(index){
					button.addEventListener("click",function(){
						const youTubeVideoCode = myJson2.mvids[index].strMusicVid.substr(myJson2.mvids[index].strMusicVid.length - 11)
						const youtubeVideo = myJson2.mvids[index].strMusicVid
						const youtubeUrlEmbed = `https://www.youtube.com/embed/${youTubeVideoCode}`
						const trackName= myJson2.mvids[index].strTrack
						console.log(youtubeUrlEmbed, youTubeVideoCode, youtubeVideo, trackName)
						videoPlayerContainer.innerHTML=`<iframe src="${youtubeUrlEmbed}?autoplay=1" allow='autoplay' frameborder=”0″></iframe>`
					})
				}
				playVideo(i)
				artistSongs.appendChild(button)

            }

    } catch (error) {
        console.error(error)
    }
}