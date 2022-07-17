/**
 * 1. Render songs *
 * 2. Scroll Top *
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 * 11. Limit repeatition of songs
 * 12. Fix draging progress bar bugs.
 * 13. Fix scroll into view bugs
 * 14. Save current songs when refresh
 * 15. Add adjusting volume features
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $(".playlist");
const heading = $("header h2");

const cd = $(".cd");
const cdThumb = $(".cd-thumb");

const audio = $("#audio");

const playBtn = $(".btn-toggle-play");
const app = {
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
    const cdWidth = cd.offsetWidth;

    // Handle scroll top cd thumb resizing
    document.onscroll = function () {
      let scrollPos = window.scrollY || document.documentElement.scrollTop;
      let newCdWidth = cdWidth - scrollPos;

      let opacity = newCdWidth / cdWidth;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = opacity;
    };
    playBtn.onclick = function () {};
  },
  loadSongs: function () {
    // Load all songs
    let html = "";
    this.songs.forEach((song, idx) => {
      html += `
            <div class="song" data-index="${idx}">
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
  render: function () {
    // Render giao diện
    let song = this.songs[this.currentIndex];

    heading.textContent = song.name;
    cdThumb.style.backgroundImage = `url("${song.img}")`;

    audio.src = song.path;
    this.loadSongs();
  },
  start: function () {
    this.defineProperties();

    this.render();

    this.handleEvents();
  },
};

app.start();
