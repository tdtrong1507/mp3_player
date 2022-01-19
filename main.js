/**
 * 1. Render UI
 * 2. Scroll top
 * 3. Play / Pause / Seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when end
 * 8. Active song
 * 9. Scroll active song into view 
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const btnPlay = $('.btn-toggle-play');
const audio = $('#audio');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playlist = $('.playlist');
const option = $('.option');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Giấc Mơ Chỉ, Là Giấc Mơ",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song01_GiacMoChiLaGiacMo.mp3",
            image: "./assets/img/song_01.jpg"
        },
        {
            name: "Nơi Ấy Bình Yên",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song02_NoiAyBinhYen.mp3",
            image: "./assets/img/song_02.jpg"
        },
        {
            name: "Người Tình Mùa Đông",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song03_NguoiTinhMuaDong.mp3",
            image: "./assets/img/song_03.jpg"
        },
        {
            name: "LK Tự Khúc Mùa Đông & Tiếng Gió Xôn Xao",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song04_LkTuKhucMuaDongTiengGioXonXao.mp3",
            image: "./assets/img/song_04.jpg"
        },
        {
            name: "Nếu Như",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song05_NeuNhu.mp3",
            image: "./assets/img/song_05.jpg"
        },
        {
            name: "Chưa Bao Giờ",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song06_ChuaBaoGio.mp3",
            image: "./assets/img/song_06.jpg"
        },
        {
            name: "Thành Phố Sương",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song07_ThanhPhoSuong.mp3",
            image: "./assets/img/song_07.jpg"
        },
        {
            name: "Trái Tim Em Cũng Biết Đau",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song08_TraiTimEmCungBietDau.mp3",
            image: "./assets/img/song_08.jpg"
        },
        {
            name: "Phố Mùa Đông",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song09_PhoMuaDong.mp3",
            image: "./assets/img/song_09.jpg"
        },
        {
            name: "Anh Ấy Cô Ấy",
            singer: "Hà Anh Tuấn",
            path: "./assets/song/song10_AnhAyCoAy.mp3",
            image: "./assets/img/song_10.jpg"
        }
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return (`
                    <div key=${index} class="song ${index === this.currentIndex ? "active" : ""}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="option-icon-pause fas fa-pause"></i>
                            
                            <i class="option-icon-play fas fa-play"></i>
                        </div>
                    </div>
                    `
            )
        });

        playlist.innerHTML = htmls.join("");
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handelEvent: function () {

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // trong suốt 1s
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        // Xử lý kéo lên kéo xuống (Phóng to thu nhở CD image)
        const cdWidth = cd.offsetWidth;

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // END Xử lý kéo lên kéo xuống

        // Xử lý khi click play 
        btnPlay.onclick = function () {
            if (!app.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        // Lắng nghe khi đã play: thực hiện các hành động sau
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing');
            playlist.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Lắng nghe khi đã pause 
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove('playing');
            playlist.classList.remove('playing');
            cdThumbAnimate.pause()
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Xử lý nút next 
        btnNext.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        // Xử lý nút previous 
        btnPrev.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lý nút random 
        btnRandom.onclick = function () {
            // if (!app.isRandom) {
            //     app.isRandom = true;
            //     btnRandom.classList.add('active');
            // } else {
            //     app.isRandom = false;
            //     btnRandom.classList.remove('active');
            // }
            app.isRandom = !app.isRandom;
            btnRandom.classList.toggle('active', app.isRandom); // 1 cách viết khác khi add class
        }

        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat;
            btnRepeat.classList.toggle('active', app.isRepeat);
        }

        // Xử lý repeat khi ended bài hát
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play()
            } else {
                btnNext.click();
            }
            console.log("123")
        }

        // Xử lý click vào từng bài hát: lắng nghe hành vi click 
        playlist.onclick = function (event) {
            const songNodeNotActive = event.target.closest('.song:not(.active)');
            const songNode = event.target.closest('.song.active');

            if (songNodeNotActive || event.target.closest('.option')) {
                // console.log("Event", event.target)
                //Xử lý khi click vào nút từng song
                if (songNodeNotActive) {
                    // console.log("Key", +songNodeNotActive.getAttribute("key"), app.currentIndex)
                    app.currentIndex = +songNodeNotActive.getAttribute("key");
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
                //Xử lý khi click vào nút options từng song
                if (event.target.closest('.option') && app.isPlaying && songNode) {
                    audio.pause()
                } else {
                    audio.play();
                }
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 500)
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            // this.currentIndex == 0;
            app.currentIndex = 0;  // this.currentIndex = 0 thì nextSong trả về ??????? --> cần giải đáp
        }
        this.loadCurrentSong()

    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            // this.currentIndex == 0;
            app.currentIndex = this.songs.length - 1;  // this.currentIndex = 0 thì nextSong trả về ??????? --> cần giải đáp
        }
        this.loadCurrentSong()
        console.log('currentIndex', this.currentIndex)

    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        // newIndex = this.currentIndex;
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        // Định nghĩa lại các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe // xử lý các sự kiện (DOM event)
        this.handelEvent();

        // Hàm chạy bài hát hiện tại
        this.loadCurrentSong();

        // Render lại playlist
        this.render();

    }
}

app.start()