const swiper = new Swiper(".swiper-container", {
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 0,
  loop: false,
  on: {
    slideChange: function () {
      const footer = document.querySelector('.footer');
      const activeSlideId = this.slides[this.activeIndex].id;
      
      if (activeSlideId === 'slide1' || activeSlideId === 'slide4' || activeSlideId === 'slide5') {
        footer.style.display = 'block'; 
      } else {
        footer.style.display = 'none';
      }
    },
  },
});

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowRight") {
    swiper.slideNext();
  } else if (event.code === "ArrowLeft") {
    swiper.slidePrev();
  }
});


const playPauseBtn = document.getElementById("playPauseBtn");
const currentTimeDisplay = document.getElementById("currentTime");
const playerContainer = document.getElementById("player-container");

// Создаем WaveSurfer
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#d3d3d3',
    progressColor: '#888',
    cursorColor: 'transparent',
    height: 40,
    barWidth: 2,
    responsive: true,
});

// Загружаем аудиофайл
wavesurfer.load('../img/Новая запись 97.m4a');

// Управление воспроизведением и переключение классов для кнопки Play/Pause
playPauseBtn.addEventListener("click", () => {
    if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        playerContainer.classList.remove("playing");
    } else {
        wavesurfer.play();
        playerContainer.classList.add("playing");
    }
});

// Обновление таймера
wavesurfer.on("audioprocess", () => {
    const currentTime = Math.floor(wavesurfer.getCurrentTime());
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    currentTimeDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

// Обновление кнопки по завершении трека
wavesurfer.on("finish", () => {
    playerContainer.classList.remove("playing");
    currentTimeDisplay.textContent = "00:00";
});


