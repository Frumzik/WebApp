const swiper = new Swiper(".swiper-container", {
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 0,
  loop: false,
});



const videoPlayer = videojs("fullscreen-video");
const icon1 = document.getElementById("icon1");

swiper.on("slideChange", function () {
  if (!videoPlayer.paused()) {
    videoPlayer.pause();
  }
});


document.addEventListener("keydown", function (event) {

  if (event.code === "ArrowRight") {
    swiper.slideNext(); 
  } else if (event.code === "ArrowLeft") {
    swiper.slidePrev(); 
  }
});


videoPlayer.on("play", function () {
  swiper.allowTouchMove = false; 
  icon1.style.display = "none";
});


videoPlayer.on("pause", function () {
  swiper.allowTouchMove = true; 
  icon1.style.display = "block";
});


videoPlayer.on("ended", function () {
  swiper.allowTouchMove = true;
  icon1.style.display = "block";
});
