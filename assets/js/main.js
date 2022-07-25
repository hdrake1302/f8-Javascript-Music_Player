/**
 * 1. Render songs *
 * 2. Scroll Top *
 * 3. Play / pause / seek *
 * 4. CD rotate *
 * 5. Next / prev *
 * 6. Random *
 * 7. Next / Repeat when ended *
 * 8. Active song *
 * 9. Scroll active song into view *
 * 10. Play song when click *
 * 11. Limit repeatition of songs
 * 12. Fix draging progress bar bugs. *
 * 13. Fix scroll into view bugs *
 * 14. Save current songs when refresh
 * 15. Add adjusting volume features
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const playList = $(".playlist");
const heading = $("header h2");

const cd = $(".cd");
const cdThumb = $(".cd-thumb");

const audio = $("#audio");
const progress = $(".progress");

const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  currentIndex: 0,
  songs: [
    {
      name: "Happier",
      singer: "Marshmello",
      img: "./assets/img/Happier - Marshmello.jpg",
      path: "./assets/music/Happier - Marshmello.mp3",
    },
    {
      name: "Stay",
      singer: "Justin Bieber",
      img: "./assets/img/Stay - Justin Bieber.jpg",
      path: "./assets/music/Stay - Justin Bieber.mp3",
    },
    {
      name: "Waiting for love",
      singer: "Avicii",
      img: "./assets/img/Waiting for love - Avicii.jpg",
      path: "./assets/music/Waiting for love - Avicii.mp3",
    },
    {
      name: "Girls Like You",
      singer: "Maroon 5",
      img: "./assets/img/Girls Like You - Maroon 5.jpg",
      path: "./assets/music/Girls Like You - Maroon 5.mp3",
    },
    {
      name: "Rude",
      singer: "MAGIC!",
      img: "./assets/img/Rude - MAGIC!.jpg",
      path: "./assets/music/Rude - MAGIC!.mp3",
    },
  ],
  defineProperties: function () {
    // Define properties for object
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    // Handle all of the events
    const _this = this;
    // Handle scroll top cd thumb resizing
    const cdWidth = cd.offsetWidth;

    document.onscroll = function () {
      let scrollPos = window.scrollY || document.documentElement.scrollTop;
      let newCdWidth = cdWidth - scrollPos;

      let opacity = newCdWidth / cdWidth;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = opacity;
    };

    // Handle play button events
    playBtn.onclick = function (e) {
      _this.isPlaying ? audio.pause() : audio.play();
      _this.isPlaying = !_this.isPlaying;
    };

    audio.onplay = function (e) {
      player.classList.add("playing");
    };

    audio.onpause = function (e) {
      player.classList.remove("playing");
    };

    // Handle audio ended
    audio.onended = function () {
      nextBtn.click();
    };

    function getProgressTime(audio) {
      // Function to get progress time from the audio
      let duration = audio.duration;
      let time = audio.currentTime;

      let progressTime = Math.floor((time / duration) * 100);

      return progressTime;
    }

    // Seeking
    audio.ontimeupdate = function (e) {
      progress.value = getProgressTime(audio);
    };

    // Seeking
    progress.oninput = function (e) {
      let currentProgress = progress.value;
      let duration = audio.duration;

      let newTime = (currentProgress * duration) / 100;

      // Set audioTime to current progress
      audio.currentTime = newTime;
    };

    // CD rotation
    cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 8000,
      iterations: Infinity,
    });

    // Next feature
    nextBtn.onclick = function (e) {
      let randomIndex = Math.floor(Math.random() * _this.songs.length);

      if (_this.isRepeat) {
        // Repeat choice doing nothing to the current index
      } else if (_this.isRandom) {
        // Random choice
        _this.currentIndex = randomIndex;
      } else if (_this.currentIndex < _this.songs.length - 1) {
        _this.currentIndex++;
      } else {
        // When the current song have reached the end
        _this.currentIndex = 0;
      }
      _this.loadCurrentSong();
    };

    // Next feature
    prevBtn.onclick = function (e) {
      let randomIndex = Math.floor(Math.random() * _this.songs.length);

      if (_this.isRepeat) {
      } else if (_this.isRandom) {
        // Random choice
        _this.currentIndex = randomIndex;
      } else {
        _this.currentIndex =
          _this.currentIndex > 0
            ? _this.currentIndex - 1
            : _this.songs.length - 1;
      }

      _this.loadCurrentSong();
    };

    // Random feature
    randomBtn.onclick = function () {
      randomBtn.classList.toggle("active");
      if (randomBtn.classList.contains("active")) {
        _this.isRandom = true;
      } else {
        _this.isRandom = false;
      }
    };

    // Repeat feature
    repeatBtn.onclick = function () {
      repeatBtn.classList.toggle("active");
      if (repeatBtn.classList.contains("active")) {
        _this.isRepeat = true;
      } else {
        _this.isRepeat = false;
      }
    };

    // Active song
    const songElements = $$(".song");
    songElements.forEach((curr, idx) => {
      curr.onclick = function () {
        _this.currentIndex = parseInt(this.dataset.index);
        _this.loadCurrentSong();
      };
    });
  },
  render: function () {
    // Render songs to the playlist
    let html = "";
    this.songs.forEach((song, idx) => {
      html += `
            <div class="song ${
              idx === this.currentIndex ? "active" : ""
            }" data-index="${idx}">
            <div
                class="thumb"
                style="
                background-image: url('${song.img}');
                "
            ></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
        `;
    });
    playList.innerHTML = html;
  },
  loadCurrentSong: function () {
    // Active song
    let currentSongEle = $(`.song[data-index="${this.currentIndex}"]`);

    $(".song.active").classList.remove("active");
    currentSongEle.classList.add("active");

    currentSongEle.scrollIntoView({ behavior: "smooth", block: "end" });
    // Render giao diện
    let song = this.songs[this.currentIndex];

    heading.textContent = song.name;
    cdThumb.style.backgroundImage = `url("${song.img}")`;

    audio.src = song.path;
    audio.play();
  },
  start: function () {
    this.defineProperties();

    this.render();

    this.loadCurrentSong();

    this.handleEvents();
  },
};

app.start();
