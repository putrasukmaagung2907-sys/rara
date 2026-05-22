document.addEventListener("DOMContentLoaded", function() {
    // === ELEMEN DOM ===
    const bottomPlayBtn = document.getElementById("bottomPlayBtn");
    const bottomIcon = bottomPlayBtn.querySelector("i");
    const mainPlayBtn = document.getElementById("mainPlayBtn");
    const mainIcon = mainPlayBtn.querySelector("i");
    
    // Elemen Info Lagu Bawah
    const playerCover = document.querySelector(".now-playing img");
    const playerTitle = document.querySelector(".track-name");
    const playerArtist = document.querySelector(".track-artist");

    // Elemen Waktu dan Progress Bar
    const timeCurrentEl = document.getElementById("timeCurrent");
    const timeTotalEl = document.getElementById("timeTotal");
    const trackProgressBar = document.getElementById("trackProgressBar");
    const trackProgress = document.getElementById("trackProgress");

    // Elemen Kontrol Ekstra
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const shuffleBtn = document.getElementById("shuffleBtn");
    const repeatBtn = document.getElementById("repeatBtn");
    const heartBtn = document.getElementById("heartBtn");

    // Elemen Volume
    const volumeProgressBar = document.getElementById("volumeProgressBar");
    const volumeProgress = document.getElementById("volumeProgress");
    const muteBtn = document.getElementById("muteBtn");
    const muteIcon = muteBtn.querySelector("i");

    // === DATA PLAYLIST ===
    const myPlaylist = [
        { title: "Superpowers", artist: "Daniel Caesar", cover: "Daniel.png", file: "Superpowers.mp3" },
        { title: "everything you are", artist: "Hindia", cover: "Hindia.png", file: "Hindia - everything u are.mp3" },
        { title: "Menceritakanmu", artist: "Batas Senja", cover: "batas.png", file: "Batas Senja.mp3" },
        { title: "Diri", artist: "Tulus", cover: "Tulus.png", file: "TULUS - Diri.mp3" },
        { title: "Blessed", artist: "Daniel Caesar", cover: "Daniel.png", file: "Blessed.mp3" },
        { title: "Nothing", artist: "Bruno Major", cover: "BM.png", file: "Nothing.mp3" },
        { title: "Best Part (feat. H.E.R.)", artist: "Daniel Caesar, H.E.R.", cover: "DNC.png", file: "Best.mp3" },
        { title: "Let me stay", artist: "Brian Rahmattio", cover: "Brian.png", file: "LMS.mp3" },
        { title: "real love", artist: "Skyline", cover: "Skyline.png", file: "Skyline.mp3" },
        { title: "Monolog", artist: "Pamungkas", cover: "Pamungkas.png", file: "Monolog.mp3" }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;

    // Elemen <audio> di latar belakang
    const audioPlayer = document.createElement("audio");
    audioPlayer.id = "audioPlayer";
    document.body.appendChild(audioPlayer);
    audioPlayer.volume = 1; 

    // Bantuan Format Waktu
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return min + ":" + (sec < 10 ? "0" + sec : sec);
    }

    // === FUNGSI UTAMA MUSIC PLAYER ===
    function loadTrack(index) {
        const track = myPlaylist[index];
        audioPlayer.src = track.file;
        playerCover.src = track.cover;
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist;
        
        trackProgress.style.width = "0%";
        timeCurrentEl.textContent = "0:00";

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
                album: "Sukma & Asrarul Special Playlist",
                artwork: [
                    { src: track.cover, sizes: '96x96', type: 'image/png' },
                    { src: track.cover, sizes: '256x256', type: 'image/png' },
                    { src: track.cover, sizes: '512x512', type: 'image/png' }
                ]
            });
        }
    }

    loadTrack(currentTrackIndex);

    function playTrack() {
        audioPlayer.play();
        isPlaying = true;
        bottomIcon.classList.replace("fa-play", "fa-pause");
        mainIcon.classList.replace("fa-play", "fa-pause");
        playerCover.classList.add("is-spinning");
    }

    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        bottomIcon.classList.replace("fa-pause", "fa-play");
        mainIcon.classList.replace("fa-pause", "fa-play");
        playerCover.classList.remove("is-spinning");
    }

    function togglePlay() {
        if (isPlaying) { pauseTrack(); } else {
            if (!audioPlayer.src || audioPlayer.src === window.location.href) loadTrack(currentTrackIndex);
            playTrack();
        }
    }

    function nextTrack() {
        if (isShuffle) {
            let randomIndex = currentTrackIndex;
            while (randomIndex === currentTrackIndex && myPlaylist.length > 1) {
                randomIndex = Math.floor(Math.random() * myPlaylist.length);
            }
            currentTrackIndex = randomIndex;
        } else {
            currentTrackIndex++;
            if (currentTrackIndex >= myPlaylist.length) currentTrackIndex = 0;
        }
        loadTrack(currentTrackIndex);
        playTrack();
    }

    function prevTrack() {
        if (audioPlayer.currentTime > 3) {
            audioPlayer.currentTime = 0;
        } else {
            currentTrackIndex--;
            if (currentTrackIndex < 0) currentTrackIndex = myPlaylist.length - 1;
            loadTrack(currentTrackIndex);
            playTrack();
        }
    }

    bottomPlayBtn.addEventListener("click", togglePlay);
    mainPlayBtn.addEventListener("click", togglePlay);
    nextBtn.addEventListener("click", nextTrack);
    prevBtn.addEventListener("click", prevTrack);

    shuffleBtn.addEventListener("click", () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle("control-active", isShuffle);
    });
    repeatBtn.addEventListener("click", () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle("control-active", isRepeat);
    });
    heartBtn.addEventListener("click", () => {
        heartBtn.classList.toggle("heart-active");
    });

    const trackRows = document.querySelectorAll(".tracklist tbody tr");
    trackRows.forEach((row, index) => {
        row.addEventListener("click", function() {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
        });
    });

    audioPlayer.addEventListener("loadeddata", () => { timeTotalEl.textContent = formatTime(audioPlayer.duration); });
    audioPlayer.addEventListener("timeupdate", () => {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        timeCurrentEl.textContent = formatTime(currentTime);
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            trackProgress.style.width = `${progressPercent}%`;
        }
    });

    trackProgressBar.addEventListener("click", (e) => {
        const width = trackProgressBar.clientWidth;
        const clickX = e.offsetX; 
        const duration = audioPlayer.duration;
        if (duration) audioPlayer.currentTime = (clickX / width) * duration;
    });

    audioPlayer.addEventListener("ended", () => { if (isRepeat) { audioPlayer.currentTime = 0; playTrack(); } else { nextTrack(); } });

    volumeProgressBar.addEventListener("click", (e) => {
        const width = volumeProgressBar.clientWidth;
        let volume = e.offsetX / width;
        if (volume < 0) volume = 0; if (volume > 1) volume = 1;
        audioPlayer.volume = volume;
        volumeProgress.style.width = `${volume * 100}%`;
        if (volume === 0) { muteIcon.className = "fa-solid fa-volume-xmark"; } 
        else if (volume < 0.5) { muteIcon.className = "fa-solid fa-volume-low"; } 
        else { muteIcon.className = "fa-solid fa-volume-high"; }
    });

    let previousVolume = 1;
    muteBtn.addEventListener("click", () => {
        if (audioPlayer.volume > 0) {
            previousVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeProgress.style.width = "0%";
            muteIcon.className = "fa-solid fa-volume-xmark";
        } else {
            audioPlayer.volume = previousVolume;
            volumeProgress.style.width = `${previousVolume * 100}%`;
            muteIcon.className = previousVolume < 0.5 ? "fa-solid fa-volume-low" : "fa-solid fa-volume-high";
        }
    });

    // === DEKLARASI SIDEBAR ===
    const sidebarLeft = document.querySelector(".sidebar-left");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const sidebarRight = document.querySelector(".sidebar-right");

    function closeMobileMenu() {
        if (sidebarLeft && sidebarLeft.classList.contains("active")) {
            sidebarLeft.classList.remove("active");
            mobileOverlay.classList.remove("active");
        }
    }

    // === FITUR MODAL GAMBAR FAVORIT ===
    const favoritesList = document.querySelectorAll("#favoritesList li:not(.nav-header)");
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");
    const closeModal = document.querySelector(".close-modal");
    const imageLoader = document.getElementById("imageLoader");

    favoritesList.forEach(item => {
        item.addEventListener("click", function() {
            const imageUrl = this.getAttribute("data-image");
            const itemName = this.textContent;
            
            imageModal.style.display = "flex";
            imageLoader.style.display = "flex";
            modalImage.style.display = "none";
            modalCaption.style.display = "none";

            modalImage.src = imageUrl;
            modalCaption.textContent = itemName;

            modalImage.onload = function() {
                imageLoader.style.display = "none";
                modalImage.style.display = "block";
                modalCaption.style.display = "block";
            };

            closeMobileMenu();
        });
    });

    closeModal.addEventListener("click", () => { imageModal.style.display = "none"; });
    imageModal.addEventListener("click", (e) => { if (e.target === imageModal) imageModal.style.display = "none"; });

    // === FITUR PETA ===
    const btnDestination = document.getElementById("btnDestination");
    const mapModal = document.getElementById("mapModal");
    const closeMapModal = document.querySelector(".close-map-modal");
    let map; 

    btnDestination.addEventListener("click", function(e) {
        e.preventDefault(); 
        mapModal.style.display = "flex";
        closeMobileMenu();

        if (!map) {
            map = L.map('mapContainer').setView([-2.5489, 118.0149], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const destinations = [
                { lat: -0.9525, lng: 100.3524, title: "Taplau", desc: "Singkatan dari Tapi Lauik, pantai ini berada tepat di jantung kota. 🏖️", image: "Taplau.jpg" },
                { lat: -6.9841, lng: 110.4104, title: "Lawang Sewu", desc: "Berdiri megah di seberang Tugu Muda.", image: "ls.jpg" },
                { lat: -7.024944, lng: 110.459866, title: "Putra Sukma Agung", desc: "Aku lagi kuliah disini, tunggu aku balik sayangg!!", image: "suk.jpeg" }
            ];

            destinations.forEach(dest => {
                const marker = L.marker([dest.lat, dest.lng]).addTo(map);
                marker.bindPopup(`
                    <div class="map-popup-content">
                        <div class="img-loader-wrapper">
                            <div class="small-loader"></div>
                            <img src="${dest.image}" class="popup-map-img" alt="${dest.title}" onload="this.style.opacity=1; this.previousElementSibling.style.display='none';">
                        </div>
                        <b>${dest.title}</b>
                        <p>${dest.desc}</p>
                    </div>
                `);
            });
        }
        setTimeout(() => { map.invalidateSize(); }, 200);
    });

    closeMapModal.addEventListener("click", () => { mapModal.style.display = "none"; });
    mapModal.addEventListener("click", (e) => { if (e.target === mapModal) mapModal.style.display = "none"; });

    // === FITUR SIDEBAR MOBILE ===
    const toggleLeftBtn = document.getElementById("toggleLeftBtn");
    const toggleRightBtn = document.getElementById("toggleRightBtn");

    if(toggleLeftBtn && toggleRightBtn) {
        toggleLeftBtn.addEventListener("click", () => {
            sidebarLeft.classList.add("active");
            mobileOverlay.classList.add("active");
        });
        toggleRightBtn.addEventListener("click", () => {
            sidebarRight.classList.add("active");
            mobileOverlay.classList.add("active");
        });
        mobileOverlay.addEventListener("click", () => {
            sidebarLeft.classList.remove("active");
            sidebarRight.classList.remove("active");
            mobileOverlay.classList.remove("active");
        });
    }

    // === ANIMASI PADANG TULIP (VERSI FINAL) ===
    const canvas = document.getElementById("tulipCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let tulips = [];
        let grassBlades = []; 
        const tulipColorStem = "#1db954";    
        const tulipColorPrimary = "#4c4cd8"; 
        const tulipColorDark = "#1f1389";    
        
        function resizeCanvas() {
            if(!sidebarRight || !canvas) return; 
            canvas.width = sidebarRight.clientWidth;
            canvas.height = sidebarRight.clientHeight; 
            initTulips(); 
        }
        
        sidebarRight.addEventListener("scroll", function() {
            canvas.style.top = sidebarRight.scrollTop + "px";
        });
        
        class GrassBlade {
            constructor(x) {
                this.x = x;
                this.height = 10 + Math.random() * 12;     
                this.phase = x * 0.04;                     
                this.swayMax = 3 + Math.random() * 3;      
            }
        }

        class TulipField {
            constructor(x, height) {
                this.baseX = x;                     
                this.stemHeight = height;           
                this.phase = x * 0.015;             
                this.swayMax = 10 + Math.random() * 8; 
            }
        }
        
        function initTulips() {
            tulips = [];
            grassBlades = [];
            const tulipSpacing = 13; 
            const count = Math.floor(canvas.width / tulipSpacing); 
            for (let i = 0; i < count; i++) {
                const x = (i * tulipSpacing) + (Math.random() * 5); 
                const height = 55 + Math.random() * 25; 
                tulips.push(new TulipField(x, height));
            }
            for (let x = 0; x < canvas.width; x += 4) {
                grassBlades.push(new GrassBlade(x));
            }
        }
        
        let globalTime = 0;
        function animateField() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            globalTime += 0.02; 
            const ps = 3; 
            const rootY = canvas.height + 5; 
            
            ctx.beginPath();
            ctx.strokeStyle = "#169443";
            ctx.lineWidth = 2;
            grassBlades.forEach(blade => {
                const sway = Math.sin(globalTime + blade.phase) * blade.swayMax;
                ctx.moveTo(blade.x, rootY);
                ctx.lineTo(blade.x + sway, rootY - blade.height);
            });
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = tulipColorStem;
            ctx.lineWidth = ps;
            tulips.forEach(t => {
                const sway = Math.sin(globalTime + t.phase) * t.swayMax;
                const tipX = t.baseX + sway;
                const tipY = rootY - t.stemHeight;
                ctx.moveTo(t.baseX, rootY);
                ctx.quadraticCurveTo(t.baseX, tipY + t.stemHeight / 2, tipX, tipY);
            });
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = tulipColorStem;
            tulips.forEach(t => {
                const sway = Math.sin(globalTime + t.phase) * t.swayMax;
                const midX = t.baseX + sway * 0.4;
                const midY = rootY - t.stemHeight * 0.7;
                ctx.rect(midX - ps, midY, ps, ps);
                ctx.rect(midX - ps * 2, midY - ps, ps, ps);
                ctx.rect(midX + ps, midY - ps * 0.5, ps, ps);
                ctx.rect(midX + ps * 2, midY - ps * 1.5, ps, ps);
            });
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = tulipColorDark;
            tulips.forEach(t => {
                const sway = Math.sin(globalTime + t.phase) * t.swayMax;
                const tipX = t.baseX + sway;
                const tipY = rootY - t.stemHeight;
                ctx.rect(tipX - ps * 1.5, tipY, ps * 3, ps);
            });
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = tulipColorPrimary;
            tulips.forEach(t => {
                const sway = Math.sin(globalTime + t.phase) * t.swayMax;
                const tipX = t.baseX + sway;
                const tipY = rootY - t.stemHeight;
                ctx.rect(tipX - ps * 2.5, tipY - ps * 2, ps * 5, ps * 2);
                ctx.rect(tipX - ps * 2.5, tipY - ps * 3, ps, ps);
                ctx.rect(tipX - ps * 0.5, tipY - ps * 3, ps, ps);
                ctx.rect(tipX + ps * 1.5, tipY - ps * 3, ps, ps);
            });
            ctx.fill();
            
            requestAnimationFrame(animateField);
        }
        
        setTimeout(() => {
            resizeCanvas();
            animateField();
        }, 100);
        window.addEventListener("resize", resizeCanvas);
    }
});