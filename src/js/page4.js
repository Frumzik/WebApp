const initData = btoa(window.Telegram.WebApp.initData);

function sendAnswer(event) {
    let currentUrl = window.location.href;
    let url = new URL(currentUrl);
    let seriesId = url.searchParams.get('series_id');
    seriesId = parseInt(seriesId);
    const answer = document.getElementById('answer-area').value;

    fetch('https://i-game.one/api/series/answer/', {
        headers: {'X-Telegram-Init-Data': 'cXVlcnlfaWQ9QUFHUWUxZ3pBQUFBQUpCN1dETlZ4OWY2JnVzZXI9JTdCJTIyaWQlMjIlM0E4NjE0MzY4MTYlMkMlMjJmaXJzdF9uYW1lJTIyJTNBJTIyJUUyJTlEJTk0JTIyJTJDJTIybGFzdF9uYW1lJTIyJTNBJTIyJTIyJTJDJTIydXNlcm5hbWUlMjIlM0ElMjJ0cmFwX3NoYXJrayUyMiUyQyUyMmxhbmd1YWdlX2NvZGUlMjIlM0ElMjJydSUyMiUyQyUyMmFsbG93c193cml0ZV90b19wbSUyMiUzQXRydWUlMkMlMjJwaG90b191cmwlMjIlM0ElMjJodHRwcyUzQSU1QyUyRiU1QyUyRnQubWUlNUMlMkZpJTVDJTJGdXNlcnBpYyU1QyUyRjMyMCU1QyUyRmpybnp3R1RFdVN6LUh5M291eXNLZC1jNFdIZUlvT1ZOakZfWnhPb0RZTlkuc3ZnJTIyJTdEJmF1dGhfZGF0ZT0xNzMyNzkyMzc0JnNpZ25hdHVyZT1mUWk0VFhhNFZ6ZERGR3ExV25ra1g4LXZqQzh3cEl5M2dqY0pWQk5SYWRGNF92OGxvOXRFakt5dmkta2xPeDdvWVZaeFNBUUx3b1JIbkhyQzlGVXpBUSZoYXNoPWQ0OTY4YTAxODU2ZDg2YzNhNWM0MTFmNjdkNmVkMTJjMjUzNjQ1ODQxMWMwNDdiNzMwNzMzMDVmMmUxZmZhYjY='},
        method: 'POST',
        body: JSON.stringify({
            'seriesId': seriesId,
            'answer': answer,
        }),
    });

    window.location.href = '/saveanswers.html';
}

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



function loadApiData() {
  let url = new URL(window.location.href);
  let series_id = url.searchParams.get("series_id");
  series_id = parseInt(series_id);

  const params = new URLSearchParams({
    lang: i18next.language,
  }).toString();

  fetch(`/api/series/play/?series_id=${series_id}&${params}`, {
    headers: {
      "X-Telegram-Init-Data": initData,
      method: "GET",
    },
  })
    .then((response) => redirectNotAuthorized(response))
    .then((data) => {
      const pages = data["pages"];
      const container = document.getElementById("main-container");

      //Так swiper не блокирует перелистывание
      container.innerHTML += `<div class="swiper-slide"></div>`;

      for (let i = 0; i < pages.length; i++) {
        let page = pages[i];

        let sendButtonText;
        let responseLabelText;
        if (['ru-RU', 'ru-BY', 'ru-KZ', 'ru-UA', 'ru', undefined].includes(i18next.language)) {
            sendButtonText = 'Отправить';
            responseLabelText = 'Запишите свой ответ:';
        }

        else {
            sendButtonText = 'Send';
            responseLabelText = 'Write down your answer:';
        }

        if (page.isAnswerPage) {
          container.innerHTML += `<div class="swiper-slide slide-without-footer">
                    <div class="exercise-text"><pre>${page.text}</pre></div>
                    <div class="response-block">
                        <p class="response-label">Запишите свой ответ:</p>
                        <textarea class="response-input" id="answer-area"></textarea>
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
        else if (page.text === "" && page.videoLink === null && page.imageLink === null && page.audio !== null) {
          container.innerHTML += `
              <div id="player-container">
                  <div class="play-pause-btn">
                      <svg id="playIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"></polygon></svg>
                      <svg id="pauseIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="display: none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                  </div>
                  <div id="waveform-${page.audio.replace(/[^a-zA-Z0-9]/g, '_')}"></div>
                  <div class="time-display" id="currentTime-${page.audio.replace(/[^a-zA-Z0-9]/g, '_')}">00:00</div>
              </div>
          `;
        }
      }
    });

  swiper.update();
  //Это тоже что бы обойти ошибку
  setTimeout(switchSlide, 500, null, 1);
}


document.addEventListener("DOMContentLoaded", function () {
  initLanguages(loadApiData);
});

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowRight") {
    swiper.slideNext();
  } else if (event.code === "ArrowLeft") {
    swiper.slidePrev();
  }
});


document.querySelectorAll('a').forEach(link => {
    if (link.classList.contains('no-confirm')) {
        return;
    }

    link.addEventListener('click', switchPages);
});

    // Инициализация Wavesurfer
    const wave = WaveSurfer.create({
      container: `#waveform-${page.audio.replace(/[^a-zA-Z0-9]/g, '_')}`,
      waveColor: '#d3d3d3',
      progressColor: '#a9a9a9',
      height: 40,
      responsive: true,
      barWidth: 2,
      cursorWidth: 0,
  });

  // Загрузка аудио
  wave.load(page.audio);

  // Обновление времени
  wave.on('audioprocess', () => {
      const currentTime = wave.getCurrentTime();
      const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
      const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
      document.getElementById(`currentTime-${page.audio.replace(/[^a-zA-Z0-9]/g, '_')}`).textContent = `${minutes}:${seconds}`;
  });

  // Управление воспроизведением
  const playPauseBtn = container.querySelector(`#waveform-${page.audio.replace(/[^a-zA-Z0-9]/g, '_')}`).parentElement.querySelector('.play-pause-btn');
  playPauseBtn.addEventListener('click', () => {
      if (wave.isPlaying()) {
          wave.pause();
          playPauseBtn.querySelector('#playIcon').style.display = 'block';
          playPauseBtn.querySelector('#pauseIcon').style.display = 'none';
          playPauseBtn.classList.remove('pause');
      } else {
          wave.play();
          playPauseBtn.querySelector('#playIcon').style.display = 'none';
          playPauseBtn.querySelector('#pauseIcon').style.display = 'block';
          playPauseBtn.classList.add('pause');
      }
  });

  // Завершение воспроизведения
  wave.on('finish', () => {
      playPauseBtn.querySelector('#playIcon').style.display = 'block';
      playPauseBtn.querySelector('#pauseIcon').style.display = 'none';
      playPauseBtn.classList.remove('pause');
  });
