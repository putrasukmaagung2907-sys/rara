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
        {
            title: "Superpowers",
            artist: "Daniel Caesar",
            cover: "Daniel.png",
            file: "Superpowers.mp3" 
        },
        {
            title: "everything you are",
            artist: "Hindia",
            cover: "Hindia.png",
            file: "Hindia - everything u are.mp3" 
        },
        {
            title: "Sampai Jadi Debu",
            artist: "Banda Neira",
            cover: "Banda.png",
            file: "Banda Neira - Sampai Jadi Debu.mp3" 
        },
        {
            title: "Diri",
            artist: "Tulus",
            cover: "Tulus.png",
            file: "TULUS - Diri.mp3" 
        },
        {
            title: "Blessed",
            artist: "Daniel Caesar",
            cover: "Daniel.png",
            file: "Blessed.mp3" 
        },
        {
            title: "Here With Me",
            artist: "d4vd",
            cover: "d4vd.png",
            file: "Here With Me.mp3" 
        }
    ];

    // === STATE APLIKASI ===
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;

    // Membuat elemen <audio> di latar belakang
    const audioPlayer = document.createElement("audio");
    audioPlayer.id = "audioPlayer";
    document.body.appendChild(audioPlayer);
    audioPlayer.volume = 1; 

    // === FUNGSI BANTUAN FORMAT WAKTU ===
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
        
        // Reset waktu dan progress bar ke 0
        trackProgress.style.width = "0%";
        timeCurrentEl.textContent = "0:00";

        // === FITUR BARU: NOTIFIKASI HP (MEDIA SESSION API) ===
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
                album: "Sukma & Asrarul Special Playlist",
                artwork: [
                    // Mengambil gambar dari playlist untuk ditampilkan di notif HP
                    { src: track.cover, sizes: '96x96', type: 'image/png' },
                    { src: track.cover, sizes: '128x128', type: 'image/png' },
                    { src: track.cover, sizes: '192x192', type: 'image/png' },
                    { src: track.cover, sizes: '256x256', type: 'image/png' },
                    { src: track.cover, sizes: '384x384', type: 'image/png' },
                    { src: track.cover, sizes: '512x512', type: 'image/png' }
                ]
            });
        }
    }

    // Panggil lagu pertama saat dimuat
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
        if (isPlaying) {
            pauseTrack();
        } else {
            if (!audioPlayer.src || audioPlayer.src === window.location.href) {
                loadTrack(currentTrackIndex);
            }
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

    // === EVENT LISTENER: TOMBOL KLIK ===
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

    // === UPDATE WAKTU DAN PROGRESS BAR OTOMATIS ===
    audioPlayer.addEventListener("loadeddata", () => {
        timeTotalEl.textContent = formatTime(audioPlayer.duration);
    });

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
        
        if (duration) {
            audioPlayer.currentTime = (clickX / width) * duration;
        }
    });

    audioPlayer.addEventListener("ended", () => {
        if (isRepeat) {
            audioPlayer.currentTime = 0;
            playTrack();
        } else {
            nextTrack();
        }
    });

    // === FITUR VOLUME ===
    volumeProgressBar.addEventListener("click", (e) => {
        const width = volumeProgressBar.clientWidth;
        const clickX = e.offsetX;
        let volume = clickX / width;
        
        if (volume < 0) volume = 0;
        if (volume > 1) volume = 1;
        
        audioPlayer.volume = volume;
        volumeProgress.style.width = `${volume * 100}%`;

        if (volume === 0) {
            muteIcon.className = "fa-solid fa-volume-xmark";
        } else if (volume < 0.5) {
            muteIcon.className = "fa-solid fa-volume-low";
        } else {
            muteIcon.className = "fa-solid fa-volume-high";
        }
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
        });
    });

    closeModal.addEventListener("click", () => {
        imageModal.style.display = "none";
    });

    imageModal.addEventListener("click", (e) => {
        if (e.target === imageModal) {
            imageModal.style.display = "none";
        }
    });

    // === FITUR PETA DESTINASI COUPLE ===
    const btnDestination = document.getElementById("btnDestination");
    const mapModal = document.getElementById("mapModal");
    const closeMapModal = document.querySelector(".close-map-modal");
    let map; 

    btnDestination.addEventListener("click", function(e) {
        e.preventDefault(); 
        mapModal.style.display = "flex";

        if (!map) {
            map = L.map('mapContainer').setView([-2.5489, 118.0149], 5);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const destinations = [
                { lat: -0.9525, lng: 100.3524, title: "Taplau", desc: "Singkatan dari Tapi Lauik, pantai ini berada tepat di jantung kota. Tempat paling seru untuk berburu sunset, menikmati jagung bakar, dan mencicipi langkitang (kuliner kerang khas) sambil menikmati semilir angin laut. 🏖️", image: "Taplau.jpg" },
                { lat: -0.95525, lng: 100.355833, title: "Museum Adityawarman", desc: "Sering disebut sebagai Taman Mini-nya Sumatera Barat. Bangunan utamanya berbentuk Rumah Gadang yang megah, menyimpan ribuan koleksi artefak budaya, pakaian adat, hingga sejarah sistem kekerabatan matriarki Minangkabau.", image: "Museum.jpg" },
                { lat: -0.9390573, lng: 100.4538228, title: "Asrarul Fajriah", desc: "Wanita cantik dengan panggilan rara tinggal disini", image: "rr1.png" },
                { lat: -0.97096, lng: 100.36594, title: "Gunung Padang", desc: "Sebenarnya ini adalah sebuah bukit kecil di pinggir laut dengan ketinggian sekitar 80 meter. Di puncaknya terdapat situs yang dipercaya sebagai Makam Siti Nurbaya serta pemandangan panorama Kota Padang dan Samudra Hindia dari ketinggian.", image: "Gp.jpg" },
                { lat: -0.9599, lng: 100.3601, title: "China Town", desc: "Kawasan pecinan tua Padang yang merefleksikan tingginya toleransi di kota ini. Di sini berdiri Kelenteng See Hin Kiong yang megah. Kawasan ini juga menjadi pusat berburu kuliner legendaris, kopi es tradisional, dan jajanan malam.", image: "Ct.jpg" },
                { lat: -0.9482, lng: 100.4287, title: "Bukit Nobita", desc: "Terinspirasi dari bukit di belakang sekolah film kartun Doraemon, tempat ini menawarkan pemandangan city light Kota Padang 360 derajat yang sangat romantis di malam hari dari atas ketinggian bukit.", image: "Bn.jpg" },
                { lat: -6.1759, lng: 106.8324, title: "Galeri Nasional Indonesia", desc: "Salah satu lembaga budaya terpenting di Indonesia yang berfungsi sebagai museum dan galeri seni rupa modern dan kontemporer. Tempat ini menyimpan ribuan koleksi karya seniman legendaris Indonesia seperti Raden Saleh, Affandi, dan Basoeki Abdullah.", image: "Gai.jpg" },
                { lat: -6.1478, lng: 106.8407, title: "Art:1 New Museum", desc: "Berada di kawasan Kemayoran, destinasi ini memadukan konsep museum seni privat dan galeri komersial. Seni kontemporer dan modern dipamerkan dalam bangunan berarsitektur minimalis yang sangat estetik.", image: "art1.jpg" },
                { lat: -6.1764, lng: 106.8218, title: "Museum Nasional Indonesia (Museum Gajah)", desc: "Merupakan museum tertua dan terbesar di Asia Tenggara. Terkenal dengan ikon patung gajah perunggu di halaman depannya, museum ini menyimpan lebih dari 140.000 artefak sejarah.", image: "Mg.jpg" },
                { lat: -6.1552, lng: 106.8465, title: "Aula Simfonia Jakarta", desc: "Gedung konser khusus musik klasik (concert hall) terbaik di Indonesia dengan kualitas akustik kelas dunia yang dirancang secara alami tanpa bantuan pengeras suara elektronik.", image: "Asj.jpg" },
                { lat: -6.1901, lng: 106.8399, title: "Jakarta", desc: "Banyak destinasi disini yang bisa aku Jelajahi bareng kamu", image: "jakarta.jpg" },
                { lat: -7.570579, lng: 110.816492, title: "Tumurun Private Museum", desc: "Tumurun Private Museum adalah salah satu museum seni privat paling eksklusif dan bergengsi di Indonesia, yang terletak di kota Surakarta (Solo), Jawa Tengah.", image: "tpm.jpg" },
                { lat: -7.1662, lng: 107.4021, title: "Kawah Putih", desc: "Danau kawah vulkanik yang terletak di kawasan Ciwidey ini menyajikan lanskap alam yang sangat surealis dan eksotis. Warna air kawahnya yang putih kehijauan sering berubah.", image: "kp.jpg" },
                { lat: -6.9175, lng: 107.6090, title: "Jalan Braga", desc: "Jalanan legendaris ini merupakan urat nadi yang membuat Bandung dijuluki Parijs van Java. Menyusuri Jalan Braga akan membawa Anda bernostalgia ke masa lalu.", image: "jb.jpg" },
                { lat: -6.7806, lng: 107.6374, title: "Orchid Forest Cikole", desc: "Berada di kawasan pegunungan Lembang dengan udara yang sangat sejuk, tempat ini adalah surga ekowisata yang memadukan keindahan hutan pinus dengan konservasi anggrek.", image: "ofc.jpg" },
                { lat: -6.9681, lng: 110.4275, title: "Kota Lama Semarang", desc: "Sering dijuluki (Little Netherlands), kawasan ini merupakan pusat perdagangan pada masa kolonial Belanda. Di sini berdiri puluhan bangunan megah abad ke-19.", image: "klm.jpg" },
                { lat: -6.9841, lng: 110.4104, title: "Lawang Sewu", desc: "Berdiri megah di seberang Tugu Muda, bangunan berarsitektur Art Deco ini dulunya merupakan kantor pusat perusahaan kereta api swasta Belanda (NIS).", image: "ls.jpg" },
                { lat: -7.024944, lng: 110.459866, title: "Putra Sukma Agung", desc: "Aku lagi kuliah disini, tunggu aku balik sayangg!!", image: "suk.jpeg" },
                { lat: -7.8054, lng: 110.3644, title: "Keraton Ngayogyakarta Hadiningrat", desc: "Istana resmi Kesultanan Ngayogyakarta Hadiningrat ini merupakan pusat denyut nadi budaya Jawa yang masih hidup dan aktif hingga hari ini.", image: "knd.jpg" },
                { lat: -7.8100, lng: 110.3592, title: "Kampung Wisata Taman Sari", desc: "Situs bersejarah yang dulunya merupakan taman pemandian pribadi bagi Sultan dan keluarga kerajaan ini menyuguhkan arsitektur yang sangat unik dengan perpaduan gaya Jawa dan Portugis.", image: "kwts.jpg" },
                { lat: -7.7929, lng: 110.3660, title: "Jalan Malioboro", desc: "Jalan Malioboro adalah jantung pariwisata, budaya, dan pusat perbelanjaan paling ikonik di Kota Yogyakarta.", image: "jm.jpg" },
                { lat: -4.5262, lng: 129.9042, title: "Banda Neira", desc: "Banda Neira adalah sebuah pulau kecil yang menjadi pusat administratif dan pariwisata di Kepulauan Banda, Maluku. Pernah menjadi tempat rebutan bangsa Eropa.", image: "Banda.jpg" }
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

        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    });

    closeMapModal.addEventListener("click", () => {
        mapModal.style.display = "none";
    });

    mapModal.addEventListener("click", (e) => {
        if (e.target === mapModal) {
            mapModal.style.display = "none";
        }
    });
    // === FITUR TOGGLE SIDEBAR MOBILE (OFF-CANVAS) ===
    const toggleLeftBtn = document.getElementById("toggleLeftBtn");
    const toggleRightBtn = document.getElementById("toggleRightBtn");
    const sidebarLeft = document.querySelector(".sidebar-left");
    const sidebarRight = document.querySelector(".sidebar-right");
    const mobileOverlay = document.getElementById("mobileOverlay");

    if(toggleLeftBtn && toggleRightBtn) {
        // Klik tombol garis tiga (Hamburger) buka menu Kiri
        toggleLeftBtn.addEventListener("click", () => {
            sidebarLeft.classList.add("active");
            mobileOverlay.classList.add("active");
        });

        // Klik tombol dua orang (Grup) buka menu Kanan
        toggleRightBtn.addEventListener("click", () => {
            sidebarRight.classList.add("active");
            mobileOverlay.classList.add("active");
        });

        // Klik area hitam transparan untuk menutup menu
        mobileOverlay.addEventListener("click", () => {
            sidebarLeft.classList.remove("active");
            sidebarRight.classList.remove("active");
            mobileOverlay.classList.remove("active");
        });
    }
    // === FITUR BARU: KONTROL TOMBOL DARI NOTIFIKASI HP ===
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', function() { playTrack(); });
        navigator.mediaSession.setActionHandler('pause', function() { pauseTrack(); });
        navigator.mediaSession.setActionHandler('previoustrack', function() { prevTrack(); });
        navigator.mediaSession.setActionHandler('nexttrack', function() { nextTrack(); });
    }
});