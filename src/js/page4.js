const initData = btoa(window.Telegram.WebApp.initData);

function sendAnswer(event) {
    let currentUrl = window.location.href;
    let url = new URL(currentUrl);
    let seriesId = url.searchParams.get('series_id');
    seriesId = parseInt(seriesId);

    const answer = document.getElementById('answer-area').value.trim();
    if (!answer) {
        console.error('Answer is empty');
        return;
    }

    fetch('/api/series/answer/', {
        headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': initData,
        },
        method: 'POST',
        body: JSON.stringify({
            'seriesId': seriesId,
            'answer': answer,
        }),
    })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                return response.json().then(error => {
                    console.error('Error details:', error);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Answer sent successfully:', data);
            window.location.href = '/saveanswers.html';
        })
        .catch(error => console.error('Error sending answer:', error));
}


function switchSlide(event, slideNumber) {
    swiper.slideTo(slideNumber);
}

const swiper = new Swiper(".swiper-container", {
    direction: "horizontal",
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    allowTouchMove: true,
    on: {
        slideChange: function () {
            const footer = document.querySelector(".footer");
            if (!footer) {
                return;
            }

            const activeSlide = this.slides[this.activeIndex];
            if (!activeSlide) {
                return;
            }
            footer.style.display = activeSlide.classList.contains("slide-without-footer") ? "none" : "block";
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
            "X-Telegram-Init-Data": initData
        },
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                console.error("API responded with status:", response.status);
                throw new Error("Failed to fetch series data");
            }
            return response.json();
        })
        .then((data) => {
            const pages = data["pages"];
            const container = document.querySelector(".swiper-wrapper");

            container.innerHTML = "";

            pages.forEach((page, index) => {
                let slideHTML = "";

                if (page.videoLink) {
                    slideHTML = `<div class='swiper-slide slide-without-footer'>
                        <iframe src='${page.videoLink}' class='video-full-size' frameborder='0' allowfullscreen style="margin-right: 10px;margin-left: 10px;"></iframe>
                    </div>`;
                } else if (page.imageLink && page.text) {
                    slideHTML = `<div class='swiper-slide'>
                        <img class="swiper-slide__image" src="${page.imageLink}" alt="Image">
                        <div class='text-container'><pre>${page.text}</pre></div>
                    </div>`;
                } else if (page.imageLink && page.audio) {
                    slideHTML = `<div class='swiper-slide'>
                        <img class="swiper-slide__image" src="${page.imageLink}" alt="Image">
                        <div id='player-container'>
                            <div class='play-pause-btn' id='play-pause-${index}'>
                                <svg id='playIcon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><polygon points='5,3 19,12 5,21'></polygon></svg>
                                <svg id='pauseIcon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' style='display: none;'><rect x='6' y='4' width='4' height='16'></rect><rect x='14' y='4' width='4' height='16'></rect></svg>
                            </div>
                            <div id='waveform-${index}'></div>
                            <div class='time-display' id='time-display-${index}'>00:00</div>
                        </div>
                    </div>`;
                } else if (page.text && page.audio) {
                    slideHTML = `<div class='swiper-slide'>
                        <div class='text-container'><pre>${page.text}</pre></div>
                        <div id='player-container'>
                            <div class='play-pause-btn' id='play-pause-${index}'>
                                <svg id='playIcon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><polygon points='5,3 19,12 5,21'></polygon></svg>
                                <svg id='pauseIcon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' style='display: none;'><rect x='6' y='4' width='4' height='16'></rect><rect x='14' y='4' width='4' height='16'></rect></svg>
                            </div>
                            <div id='waveform-${index}'></div>
                            <div class='time-display' id='time-display-${index}'>00:00</div>
                        </div>
                    </div>`;
                } else if (page.text && page.isAnswerPage) {
                    const sendButtonText = i18next.language.startsWith("ru") ? 'Отправить' : 'Send';
                    const responseLabelText = i18next.language.startsWith("ru") ? 'Запишите свой ответ:' : 'Write down your answer:';
                    const buttonsHTML = page.buttons.map(button => {
                        return `<button class="buttons-container__btn" onclick='switchSlide(event, ${button.nextPageNumber})'>${button.text}</button>`;
                    }).join('');
                    slideHTML = `<div class='swiper-slide slide-without-footer'>
                        <div class='exercise-text'><pre>${page.text}</pre></div>
                        <div class='response-block'>
                            <p class='response-label'>${responseLabelText}</p>
                            <textarea class='response-input' id='answer-area'></textarea>
                            <button class='response-button' onclick='sendAnswer(event)'>${sendButtonText}</button>
                        </div>
                        <div class='buttons-container'>${buttonsHTML}</div>
                    </div>`;
                } else if (page.imageLink && page.buttons) {
                    const buttonsHTML = page.buttons.map(button => {
                        return `<button class="buttons-container__btn" onclick='switchSlide(event, ${button.nextPageNumber})'>${button.text}</button>`;
                    }).join('');

                    slideHTML = `<div class='swiper-slide'>
                        <img class="swiper-slide__image" src="${page.imageLink}" alt="Image">
                        <div class='buttons-container'>${buttonsHTML}</div>
                    </div>`;
                } else if (page.text && page.imageLink === null && page.videoLink === null && page.audio === null) {
                    slideHTML = `<div class='swiper-slide'>
                        <div class='text-container'><pre>${page.text}</pre></div>
                    </div>`;
                }

                container.innerHTML += slideHTML;

                if (page.audio) {
                    setTimeout(() => {
                        const waveformContainer = document.querySelector(`#waveform-${index}`);
                        if (!waveformContainer) {
                            return;
                        }
                        const wave = WaveSurfer.create({
                            container: `#waveform-${index}`,
                            waveColor: '#d3d3d3',
                            progressColor: '#a9a9a9', 
                            height: 40, 
                            responsive: true, 
                            barWidth: 2, 
                            cursorWidth: 0, 
                        });
                        wave.load(page.audio);
                        wave.on('ready', () => {
                            console.log(`Файл ${page.audio} успешно загружен для #waveform-${index}`);
                        });
                        wave.on('error', (e) => {
                            console.error(`Ошибка Wavesurfer для #waveform-${index}:`, e);
                        });
                        const playPauseBtn = document.getElementById(`play-pause-${index}`);
                        if (!playPauseBtn) {
                            console.error(`Кнопка Play/Pause #play-pause-${index} не найдена.`);
                            return;
                        }
                        playPauseBtn.addEventListener('click', () => {
                            if (wave.isPlaying()) {
                                wave.pause();
                                playPauseBtn.querySelector('#playIcon').style.display = 'block';
                                playPauseBtn.querySelector('#pauseIcon').style.display = 'none';
                            } else {
                                wave.play();
                                playPauseBtn.querySelector('#playIcon').style.display = 'none';
                                playPauseBtn.querySelector('#pauseIcon').style.display = 'block';
                            }
                        });
                        wave.on('audioprocess', () => {
                            const currentTime = wave.getCurrentTime();
                            const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
                            const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
                            const timeDisplay = document.getElementById(`time-display-${index}`);
                            if (timeDisplay) {
                                timeDisplay.textContent = `${minutes}:${seconds}`;
                            }
                        });
                        wave.on('finish', () => {
                            playPauseBtn.querySelector('#playIcon').style.display = 'block';
                            playPauseBtn.querySelector('#pauseIcon').style.display = 'none';
                        });
                    }, 200);
                }
            });

            setTimeout(() => swiper.update(), 100);
        })
        .catch(error => console.error("Error loading API data:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    initLanguages(loadApiData);

    document.addEventListener("keydown", function (event) {
        if (event.code === "ArrowRight") {
            swiper.slideNext();
        } else if (event.code === "ArrowLeft") {
            swiper.slidePrev();
        }
    });
});
