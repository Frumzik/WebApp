

function sendAnswer(event) {}

function switchSlide(event, slideNumber) {
  const slideIndex = slideNumber;
  swiper.slideTo(slideIndex);
}

const swiper = new Swiper(".swiper-container", {
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 0,
  loop: false,
  allowTouchMove: true,
  on: {
    slideChange: function () {
      if (this.activeIndex === 0) {
        this.slideTo(1);
      }

      const footer = document.querySelector(".footer");

      if (this.slides.length === 0) {
        swiper.update();
      }

      const activeSlideClasses = this.slides[this.activeIndex].classList;

      if (activeSlideClasses.contains("slide-without-footer")) {
        footer.style.display = "none";
      } else {
        footer.style.display = "block";
      }
    },
  },
});

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams({
    lang: "ru",
    lang: "en",
  }).toString();

  const initData = btoa(window.Telegram.WebApp.initData);

  let url = new URL(window.location.href);
  let series_id = url.searchParams.get("series_id");
  series_id = parseInt(series_id);

  fetch(`https://test0123481.ru/api/series/play/?series_id=${series_id}&${params}`, {
    headers: {
      "X-Telegram-Init-Data": initData,
      method: "GET",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const pages = data["pages"];
      const container = document.getElementById("main-container");

      //Так swiper не блокирует перелистывание
      container.innerHTML += `<div class="swiper-slide"></div>`;

      for (let i = 0; i < pages.length; i++) {
        let page = pages[i];

        if (page.isAnswerPage) {
          container.innerHTML += `<div class="swiper-slide slide-without-footer">
                    <div class="exercise-text"><pre>${page.text}</pre></div>
                    <div class="response-block">
                        <p class="response-label">Запишите свой ответ:</p>
                        <textarea class="response-input"></textarea>
                        <button class="response-button" onclick="sendAnswer(event)">Отправить</button>
                    </div>
                </div>`;
        } else if (
          page.text !== "" &&
          page.videoLink === null &&
          page.imageLink !== null
        ) {
          container.innerHTML += `
                <div class="swiper-slide">
                    <img class="swiper-slide__image" src="${page.imageLink}" alt="Image">
                    <div class="text-container"><pre>${page.text}</pre></div>
                    <div class="buttons-container">
                    </div>
                </div>
                `;
        } else if (
          page.text !== "" &&
          page.videoLink === null &&
          page.imageLink === null
        ){
          let buttonsHTML = "";
          for (
            let buttonIndex = 0;
            buttonIndex < page.buttons.length;
            buttonIndex++
          ) {
            let button = page.buttons[buttonIndex];
            buttonsHTML += `
                        <button class="buttons-container__btn"
                                onclick="switchSlide(event, ${button.nextPageNumber})">
                            ${button.text}
                        </button>
                    `;
          }
          container.innerHTML += `
                <div class="swiper-slide">
                    <div class="text-container"><pre>${page.text}</pre></div>
                    <div class="buttons-container">
                        ${buttonsHTML}
                    </div>
                </div>
                `;
        } else if (page.text === "" && page.videoLink !== null) {
          container.innerHTML += `
                <div class="swiper-slide slide-without-footer">
                    <iframe
                    src="${page.videoLink}"
                    class="video-full-size"
                    frameborder="0"
                    allowfullscreen>
                </iframe>
                <div class="icon-overlay" id="icon1">
                    <img src="icons/swipe.svg" alt="icon" />
                </div>
                </div>
                `;
        } else if (page.text !== "" && page.videoLink !== null) {
          container.innerHTML += `
                <div class="swiper-slide slide-without-footer">
                    <iframe
                    class="video-half-size"
                    src="${page.videoLink}"
                    frameborder="0"
                    allowfullscreen>
                </iframe>
                <div class="text-container"><pre>${page.text}</pre></div>
                </div>
                `;
        } else if (
          page.text === "" &&
          page.videoLink === null &&
          page.imageLink !== null
        ) {
          container.innerHTML += `
                    <div class="swiper-slide">
                        <img class="swiper-slide__image" src="${page.imageLink}" alt="Image">
                    </div>
                `;
        }
      }
    });

  swiper.update();
  //Это тоже что бы обойти ошибку
  setTimeout(switchSlide, 500, null, 1);
});

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowRight") {
    swiper.slideNext();
  } else if (event.code === "ArrowLeft") {
    swiper.slidePrev();
  }
});

