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
        { title: "Here With Me", artist: "d4vd", cover: "d4vd.png", file: "Here With Me.mp3" }
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

        // Fitur Media Session (Layar Kunci HP)
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

    loadTrack(currentTrackIndex); // Muat saat pertama dibuka

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

    // === DEKLARASI SIDEBAR UNTUK MENU & MODAL ===
    const sidebarLeft = document.querySelector(".sidebar-left");
    const mobileOverlay = document.getElementById("mobileOverlay");

    // FUNGSI UMUM TUTUP MENU MOBILE
    function closeMobileMenu() {
        if (sidebarLeft && sidebarLeft.classList.contains("active")) {
            sidebarLeft.classList.remove("active");
            mobileOverlay.classList.remove("active");
        }
    }

    // === FITUR MODAL GAMBAR UNTUK LIST FAVORIT ===
    const favoritesList = document.querySelectorAll("#favoritesList li:not(.nav-header)");
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");
    const closeModal = document.querySelector(".close-modal");

    favoritesList.forEach(item => {
        item.addEventListener("click", function() {
            const imageUrl = this.getAttribute("data-image");
            const itemName = this.textContent;
            modalImage.src = imageUrl;
            modalCaption.textContent = itemName;
            imageModal.style.display = "flex";
            closeMobileMenu();
        });
    });

    closeModal.addEventListener("click", () => { imageModal.style.display = "none"; });
    imageModal.addEventListener("click", (e) => { if (e.target === imageModal) imageModal.style.display = "none"; });

    // === FITUR PETA DESTINASI COUPLE ===
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
                { lat: -0.95525, lng: 100.355833, title: "Museum Adityawarman", desc: "Taman Mini-nya Sumatera Barat. Bangunan utamanya berbentuk Rumah Gadang.", image: "Museum.jpg" },
                { lat: -0.9390573, lng: 100.4538228, title: "Asrarul Fajriah", desc: "Wanita cantik dengan panggilan rara tinggal disini", image: "rr1.png" },
                { lat: -0.97096, lng: 100.36594, title: "Gunung Padang", desc: "Bukit kecil di pinggir laut. Terdapat Makam Siti Nurbaya serta panorama kota.", image: "Gp.jpg" },
                { lat: -0.9599, lng: 100.3601, title: "China Town", desc: "Pusat berburu kuliner legendaris dan jajanan malam Padang.", image: "Ct.jpg" },
                { lat: -0.9482, lng: 100.4287, title: "Bukit Nobita", desc: "Menawarkan pemandangan city light Kota Padang 360 derajat.", image: "Bn.jpg" },
                { lat: -6.1759, lng: 106.8324, title: "Galeri Nasional", desc: "Tempat menyimpan ribuan koleksi karya seniman legendaris Indonesia.", image: "Gai.jpg" },
                { lat: -6.1478, lng: 106.8407, title: "Art:1 New Museum", desc: "Seni kontemporer dan modern dalam bangunan minimalis estetik.", image: "art1.jpg" },
                { lat: -6.1764, lng: 106.8218, title: "Museum Nasional", desc: "Museum tertua dengan ikon patung gajah perunggu.", image: "Mg.jpg" },
                { lat: -6.1552, lng: 106.8465, title: "Aula Simfonia", desc: "Gedung konser akustik kelas dunia tanpa pengeras suara elektronik.", image: "Asj.jpg" },
                { lat: -6.1901, lng: 106.8399, title: "Jakarta", desc: "Banyak destinasi disini yang bisa aku Jelajahi bareng kamu", image: "jakarta.jpg" },
                { lat: -7.570579, lng: 110.816492, title: "Tumurun Museum", desc: "Museum seni privat eksklusif di kota Surakarta (Solo).", image: "tpm.jpg" },
                { lat: -7.1662, lng: 107.4021, title: "Kawah Putih", desc: "Danau kawah vulkanik yang sangat surealis dan eksotis.", image: "kp.jpg" },
                { lat: -6.9175, lng: 107.6090, title: "Jalan Braga", desc: "Jalanan legendaris yang membuat Bandung dijuluki Parijs van Java.", image: "jb.jpg" },
                { lat: -6.7806, lng: 107.6374, title: "Orchid Forest Cikole", desc: "Surga ekowisata yang memadukan hutan pinus dan anggrek.", image: "ofc.jpg" },
                { lat: -6.9681, lng: 110.4275, title: "Kota Lama Semarang", desc: "Kawasan Little Netherlands dengan bangunan megah abad ke-19.", image: "klm.jpg" },
                { lat: -6.9841, lng: 110.4104, title: "Lawang Sewu", desc: "Berdiri megah di seberang Tugu Muda dengan arsitektur Art Deco.", image: "ls.jpg" },
                { lat: -7.024944, lng: 110.459866, title: "Putra Sukma Agung", desc: "Aku lagi kuliah disini, tunggu aku balik sayangg!!", image: "suk.jpeg" },
                { lat: -7.8054, lng: 110.3644, title: "Keraton Yogyakarta", desc: "Pusat denyut nadi budaya Jawa yang masih hidup.", image: "knd.jpg" },
                { lat: -7.8100, lng: 110.3592, title: "Taman Sari", desc: "Pemandian pribadi keluarga kerajaan bergaya Jawa dan Portugis.", image: "kwts.jpg" },
                { lat: -7.7929, lng: 110.3660, title: "Jalan Malioboro", desc: "Jantung pariwisata dan budaya ikonik Yogyakarta.", image: "jm.jpg" },
                { lat: -4.5262, lng: 129.9042, title: "Banda Neira", desc: "Pulau kecil nan indah yang pernah jadi rebutan bangsa Eropa.", image: "Banda.jpg" }
            ];

            destinations.forEach(dest => {
                const marker = L.marker([dest.lat, dest.lng]).addTo(map);
                marker.bindPopup(`
                    <div class="map-popup-content">
                        <img src="${dest.image}" class="popup-map-img" alt="${dest.title}">
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

    // === FITUR TOGGLE SIDEBAR MOBILE (OFF-CANVAS) ===
    const toggleLeftBtn = document.getElementById("toggleLeftBtn");
    const toggleRightBtn = document.getElementById("toggleRightBtn");
    const sidebarRight = document.querySelector(".sidebar-right");

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

    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', function() { playTrack(); });
        navigator.mediaSession.setActionHandler('pause', function() { pauseTrack(); });
        navigator.mediaSession.setActionHandler('previoustrack', function() { prevTrack(); });
        navigator.mediaSession.setActionHandler('nexttrack', function() { nextTrack(); });
    }

    // === FITUR MODAL VIDEO (Tombol Haii Sayang) ===
    const btnHaiSayang = document.getElementById("btnHaiSayang");
    const videoModal = document.getElementById("videoModal");
    const closeVideoModal = document.querySelector(".close-video-modal");
    const myVideo = document.getElementById("myVideo");
    
    // Variabel untuk mengingat apakah lagu sedang menyala sebelum video diklik
    let wasMusicPlaying = false; 

    if (btnHaiSayang) {
        btnHaiSayang.addEventListener("click", () => {
            // 1. Ingat status musik saat ini
            wasMusicPlaying = isPlaying; 
            
            // 2. Jika musik sedang menyala, JEDA (pause) musiknya
            if (isPlaying) {
                pauseTrack(); 
            }
            
            // 3. Tampilkan dan putar video
            videoModal.style.display = "flex";
            myVideo.play(); 
        });
    }

    // Fungsi gabungan untuk menutup video
    function closeVideoAndResumeMusic() {
        videoModal.style.display = "none";
        myVideo.pause(); // Jeda video agar tidak bocor di background
        
        // Putar kembali musik HANYA JIKA sebelum video dibuka musiknya memang sedang menyala
        if (wasMusicPlaying) {
            playTrack();
        }
    }

    // Pasang fungsi tutup ke tombol X
    if (closeVideoModal) {
        closeVideoModal.addEventListener("click", closeVideoAndResumeMusic);
    }

    // Pasang fungsi tutup jika area hitam di luar video diklik
    if (videoModal) {
        videoModal.addEventListener("click", (e) => {
            if (e.target === videoModal) {
                closeVideoAndResumeMusic();
            }
        });
    }

    // === FITUR INTERAKSI MENU BARU (Home, Playlist, Liked, Search) ===
    const btnHome = document.getElementById("btnHome");
    const btnSearch = document.getElementById("btnSearch");
    const btnSearchRight = document.getElementById("btnSearchRight");
    const btnCreatePlaylist = document.getElementById("btnCreatePlaylist");
    const btnLikedSongs = document.getElementById("btnLikedSongs");
    const toastNotification = document.getElementById("toastNotification");
    
    const searchModal = document.getElementById("searchModal");
    const closeSearchModal = document.querySelector(".close-search-modal");
    const searchInput = document.getElementById("searchInput");
    const mainContent = document.querySelector(".main-content");

    function showToast(message) {
        toastNotification.textContent = message;
        toastNotification.classList.add("show");
        setTimeout(() => { toastNotification.classList.remove("show"); }, 3000); 
    }

    if (btnHome) {
        btnHome.addEventListener("click", (e) => {
            e.preventDefault();
            closeMobileMenu();
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnCreatePlaylist) {
        btnCreatePlaylist.addEventListener("click", (e) => {
            e.preventDefault();
            closeMobileMenu();
            showToast("Fitur membuat playlist segera hadir! 🎵");
        });
    }

    if (btnLikedSongs) {
        btnLikedSongs.addEventListener("click", (e) => {
            e.preventDefault();
            closeMobileMenu();
            showToast("Memuat lagu-lagu favorit Rara... ❤️");
        });
    }

    // Tombol Search (Kiri dan Kanan)
    function openSearch(e) {
        e.preventDefault();
        closeMobileMenu();
        searchModal.style.display = "flex";
        searchInput.focus(); 
    }
    if (btnSearch) btnSearch.addEventListener("click", openSearch);
    if (btnSearchRight) btnSearchRight.addEventListener("click", openSearch);

    // Pencarian Real-Time
    if (searchInput) {
        searchInput.addEventListener("keyup", function(e) {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll(".tracklist tbody tr");
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if(text.includes(term)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    if (closeSearchModal) {
        closeSearchModal.addEventListener("click", () => { searchModal.style.display = "none"; });
    }
    if (searchModal) {
        searchModal.addEventListener("click", (e) => {
            if (e.target === searchModal) searchModal.style.display = "none";
        });
    }
    // === FITUR INTERAKSI ACTION BAR (Tengah) ===
    const btnActionHeart = document.getElementById("btnActionHeart");
    const btnActionDownload = document.getElementById("btnActionDownload");
    const btnActionMore = document.getElementById("btnActionMore");
    const btnCustomOrder = document.getElementById("btnCustomOrder");

    // 1. Interaksi Ikon Love (Playlist)
    if (btnActionHeart) {
        btnActionHeart.addEventListener("click", function() {
            const icon = this.querySelector("i");
            // Toggle ganti ikon regular/solid
            if (icon.classList.contains("fa-regular")) {
                icon.classList.replace("fa-regular", "fa-solid");
                this.style.color = "var(--primary-color)"; // Ubah warna jadi hijau
                showToast("Playlist ditambahkan ke Favorit! 💚");
            } else {
                icon.classList.replace("fa-solid", "fa-regular");
                this.style.color = ""; // Kembalikan warna ke abu-abu
                showToast("Playlist dihapus dari Favorit 💔");
            }
        });
    }

    // 2. Interaksi Ikon Download
    if (btnActionDownload) {
        btnActionDownload.addEventListener("click", function() {
            const icon = this.querySelector("i");
            // Jika belum hijau, jadikan hijau (seolah sudah didownload)
            if (this.style.color !== "var(--primary-color)") {
                this.style.color = "var(--primary-color)";
                showToast("Mengunduh playlist... 📥");
            } else {
                this.style.color = "";
                showToast("Hapus unduhan playlist. 🗑️");
            }
        });
    }

    // 3. Interaksi Titik Tiga
    if (btnActionMore) {
        btnActionMore.addEventListener("click", function() {
            showToast("Membuka menu opsi lainnya... ⚙️");
        });
    }
    // 4. Interaksi Custom Order (Sortir)
    if (btnCustomOrder) {
        // Array urutan teks
        const orderTypes = ["Custom order", "Title", "Artist", "Album"];
        let currentOrderIndex = 0;

        btnCustomOrder.addEventListener("click", function() {
            currentOrderIndex++;
            // Jika sudah di ujung array, kembali ke awal
            if (currentOrderIndex >= orderTypes.length) {
                currentOrderIndex = 0;
            }
            
            const newOrderText = orderTypes[currentOrderIndex];
            // Ubah isi teks, tapi pertahankan ikon panah ke bawah
            this.innerHTML = `${newOrderText} <i class="fa-solid fa-caret-down"></i>`;
            
            showToast(`Mengurutkan berdasarkan: ${newOrderText} 🔄`);
        });
    }
});