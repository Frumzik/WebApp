const swiper = new Swiper(".swiper-container", {
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 0,
  loop: false,
  on: {
    slideChange: function () {
      const footer = document.querySelector(".footer");
      if (swiper.activeIndex === 1) {
        footer.style.display = "none";
      } else {
        footer.style.display = "block";
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
