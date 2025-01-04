const initData = btoa(window.Telegram.WebApp.initData);


function sendAnswer(event) {
    event.preventDefault(); // Отключаем стандартное поведение кнопки отправки

    // Ищем ближайший блок ответа, связанный с этой кнопкой
    const responseBlock = event.target.closest('.response-block');
    if (!responseBlock) {
        console.error('Блок ответа не найден!');
        return;
    }

    // Находим поле ввода внутри этого блока
    const answerInput = responseBlock.querySelector('.response-input');
    if (!answerInput) {
        console.error('Поле ввода ответа не найдено!');
        return;
    }

    const answer = answerInput.value.trim(); // Получаем текст ответа
    if (!answer) {
        console.error('Ответ пустой');
        return;
    }

    // Получаем идентификатор серии
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const seriesId = parseInt(url.searchParams.get('series_id'), 10);

    // Отправка данных на сервер
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
                    console.error('Ошибка отправки:', error);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Ответ успешно отправлен:', data);
            answerInput.value = ''; // Очищаем поле после отправки
            alert('Ваш ответ отправлен!'); // Добавляем уведомление об успехе
        })
        .catch(error => console.error('Ошибка при отправке:', error));
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
    const url = new URL(window.location.href);
    const seriesId = parseInt(url.searchParams.get('series_id'), 10);

    const params = new URLSearchParams({ lang: i18next.language }).toString();

    fetch(`/api/series/play/?series_id=${seriesId}&${params}`, {
        headers: { "X-Telegram-Init-Data": initData },
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                console.error("API responded with status:", response.status);
                throw new Error("Failed to fetch series data");
            }
            return response.json();
        })
        .then(data => {
            const pages = data["pages"];
            const container = document.querySelector(".swiper-wrapper");

            if (!pages || pages.length === 0) {
                container.innerHTML = "<p>Нет доступных вопросов для отображения.</p>";
                return;
            }

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
                        return `<button class="buttons-container__btn" onclick='switchSlide(event, ${button.nextPageNumber - 1})'>${button.text}</button>`;
                    }).join('');
                    slideHTML = `<div class='swiper-slide slide-without-footer'>
                        <div class='exercise-text'><pre>${page.text}</pre></div>
                        <div class='response-block'>
                            <p class='response-label'>${responseLabelText}</p>
                            <textarea class='response-input'></textarea>
                            <button class='response-button' onclick='sendAnswer(event)'>${sendButtonText}</button>
                        </div>
                        <div class='buttons-container'>${buttonsHTML}</div>
                    </div>`;
                }
                else if (page.imageLink && page.buttons) {
                    const buttonsHTML = page.buttons.map(button => {
                        return `<button class="buttons-container__btn" onclick='switchSlide(event, ${button.nextPageNumber - 1})'>${button.text}</button>`;
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
            });

            swiper.update(); // Обновляем swiper после добавления слайдов
        })
        .catch(error => console.error("Ошибка загрузки данных:", error));
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
