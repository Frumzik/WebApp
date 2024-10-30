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
