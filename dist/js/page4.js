const swiper = new Swiper(".swiper-container", {
  direction: "horizontal",
  loop: false,
  slidesPerView: 1,
  spaceBetween: 0,
  loop: false,
});

// Инициализация Video.js плеера
const videoPlayer = videojs("fullscreen-video");
const icon1 = document.getElementById("icon1");
// Обработчик события смены слайда
swiper.on("slideChange", function () {
  // Останавливаем видео при смене слайда
  if (!videoPlayer.paused()) {
    videoPlayer.pause(); // Остановить видео при смене слайда
  }
});

// Обработчик клавиатурных событий
document.addEventListener("keydown", function (event) {
  // Обработка стрелок
  if (event.code === "ArrowRight") {
    swiper.slideNext(); // Переход к следующему слайду
  } else if (event.code === "ArrowLeft") {
    swiper.slidePrev(); // Переход к предыдущему слайду
  }
});

// Отключаем свайпы, когда видео играет
videoPlayer.on("play", function () {
  swiper.allowTouchMove = false; // Отключаем свайпы, пока видео играет
  icon1.style.display = "none";
});

// Разрешаем свайпы, когда видео на паузе
videoPlayer.on("pause", function () {
  swiper.allowTouchMove = true; // Разрешаем свайпы, когда видео на паузе
  icon1.style.display = "block";
});

// Разрешаем свайпы после завершения видео
videoPlayer.on("ended", function () {
  swiper.allowTouchMove = true; // Разрешаем свайпы после завершения видео
  icon1.style.display = "block";
});
