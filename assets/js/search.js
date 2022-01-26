

    const txtartist = document.querySelector('#artist');
    const button = document.querySelector('#button');
    const result = document.querySelector('#result');
    const container = document.querySelector('.link-container');


    const showArtistMatch = async() =>{
        try {
            const texto = txtartist.value.toLowerCase().trim();
            BASE_URL= 'https://ws.audioscrobbler.com/2.0/?'+
            'method=artist.search'+
            '&artist='+texto+
            '&api_key=a63b4b638a5b1421711915f35d15f602&format=json';
            const response = await fetch(BASE_URL);
            const myJson = await response.json();
            result.innerHTML='';
            if(txtartist.value.length !== 0 || txtartist.value !== ""){
                result.style.height="250px";
                for(let items of myJson.results.artistmatches.artist){
                    result.innerHTML+=
                        `<li class="link-item"><a href="artists.html?artistName=${items.name}"><span>${items.name}</span> <i class="fas fa-music"></i></a></li>`;
                    if(txtartist.value.length !== 0){
                        result.style.display="block"
                        button.disabled = false;
                        button.style.cursor = "pointer";
                    }else {
                        result.style.display="none"
                        button.disabled = true;
                        button.style.cursor = "none";
                    }
                }
            }else {
                result.style.height="0";
            }
        } catch (e) {
            console.log(e);
        }


    }

    txtartist.addEventListener('keyup',showArtistMatch);
    button.addEventListener('click',showArtistMatch);


    //To do:
    //Validate empty whitespaces between words in txtartist value