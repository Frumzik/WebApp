const initData = btoa(window.Telegram.WebApp.initData);

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function sendAnswer(event) {
    event.preventDefault();

    const responseBlock = event.target.closest('.response-block');
    if (!responseBlock) {
        console.error('Блок ответа не найден!');
        return;
    }

    const answerInput = responseBlock.querySelector('.response-input');
    if (!answerInput) {
        console.error('Поле ввода ответа не найдено!');
        return;
    }

    const answer = answerInput.value.trim();
    if (!answer) {
        showToast('Пожалуйста, введите ответ');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = parseInt(urlParams.get('series_id'), 10);

    const pageId = parseInt(responseBlock.dataset.pageId, 10);

    if (isNaN(seriesId) || isNaN(pageId)) {
        console.error('Некорректные параметры series_id или page_id');
        return;
    }

    fetch('/api/series/answer/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': initData,
        },
        body: JSON.stringify({
            seriesId: seriesId,
            answer: answer,
            pageId: pageId,
        }),
    })
    .then(response => {
        if (response.status === 204) {
            showToast('Ответ успешно отправлен!');
            answerInput.value = '';
            return;
        }
        if (!response.ok) {
            return response.json().then(error => {
                console.error('Ошибка сервера:', error);
                throw new Error(`Ошибка: ${error.message || 'Некорректный ответ сервера'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            showToast('Ответ принят сервером');
        }
    })
    .catch(error => console.error('Ошибка при отправке ответа:', error));
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
        headers: { "X-Telegram-Init-Data": initData},
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
            // const baseUrl = "https://i-game.one";


            const iconHTML = `
            <div class='icon-container'>
                <svg width="40" height="40" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="31" cy="31" r="31" fill="white"/>
                        <path d="M31.6431 19.1308C31.6106 19.1145 28.3858 17.5831 25.8198 17.3878C23.1228 17.1778 20.4203 18.6092 20.3924 18.6247L20.0274 17.9404C20.1452 17.8776 22.9569 16.3966 25.8787 16.6144C28.5904 16.8221 31.84 18.3666 31.9771 18.4317L31.6431 19.1308Z" fill="#111111"/>
                        <path d="M28.9167 20.6551L28.5772 19.9584L31.2355 18.6626L29.5181 16.3027L30.145 15.847L32.4057 18.9532L28.9167 20.6551Z" fill="#111111"/>
                        <path d="M17.3428 22.6833L17.0088 21.9843C17.146 21.9192 20.3955 20.3746 23.108 20.1669C26.0205 19.9545 28.8407 21.4301 28.9585 21.4929L28.5935 22.1772C28.5664 22.1625 25.8554 20.7303 23.1669 20.9403C20.6009 21.1356 17.3754 22.6678 17.3428 22.6833Z" fill="#111111"/>
                        <path d="M20.07 24.2078L16.5802 22.5059L18.8409 19.3997L19.4678 19.8554L17.7505 22.2152L20.4087 23.511L20.07 24.2078Z" fill="#111111"/>
                        <path d="M34.6369 45.5644C33.6504 45.5644 32.6498 45.4575 31.7446 45.256C30.2001 44.9119 26.9505 42.4326 26.2631 41.7204C25.6415 41.0764 23.9768 38.6041 23.7327 36.593C23.6257 35.7173 24.2977 33.1078 25.1199 32.1794C25.2827 31.997 25.4511 31.8753 25.6252 31.8144L25.5191 31.5757C24.9843 30.4116 24.1923 29.067 23.4932 27.8797C22.3098 25.8693 21.8688 25.0664 21.9432 24.6092C22.068 23.8342 22.7035 22.9398 23.5498 22.7833L23.6994 22.7531C23.9175 22.7001 24.1407 22.671 24.3651 22.6663C25.1037 22.6663 25.7802 23.0879 26.4956 23.9923C27.1148 24.7758 28.1176 26.9388 28.9616 28.8957C28.9229 28.4028 28.9376 27.9913 29.0414 27.751C29.4599 26.78 30.6271 26.3979 30.9828 26.3754L31.0704 26.3731C31.2959 26.3731 32.4499 26.4297 32.9846 27.5519C33.0699 27.7317 33.1513 27.9254 33.2264 28.1215C33.3225 27.7882 33.4589 27.4976 33.6535 27.3318C34.2518 26.8234 35.0709 26.5599 35.6282 26.7164C36.2272 26.8846 36.7318 27.5185 36.9139 28.3346C36.9922 28.1579 37.0867 28.0145 37.1983 27.9308C37.74 27.5247 38.6824 27.4813 39.2792 27.8952C40.0077 28.4005 41.6832 31.4276 41.9777 34.075C42.2188 36.2512 42.4908 40.1402 41.5926 41.7429C40.6595 43.4053 38.7506 44.6964 37.3719 45.1916C36.7008 45.4311 35.7297 45.5644 34.6369 45.5644ZM25.9027 32.5599C25.3881 32.6111 24.3798 35.4941 24.5015 36.4977C24.72 38.3019 26.2693 40.6098 26.8211 41.1818C27.4775 41.8622 30.5852 44.2027 31.912 44.498C32.7638 44.6879 33.7046 44.7886 34.6362 44.7886C35.6274 44.7886 36.5279 44.6685 37.1076 44.4593C38.15 44.0849 40.0224 42.9511 40.9144 41.36C41.4941 40.3285 41.6003 37.7028 41.2058 34.1587C40.9261 31.6338 39.2931 28.8469 38.8367 28.5291C38.4701 28.2757 37.8594 28.3997 37.6618 28.5485C37.5525 28.6733 37.3905 29.4033 37.3277 30.0985L37.1332 32.2429L36.5682 30.1652C36.5682 30.1652 36.3171 29.2429 36.159 28.5121C36.0242 27.8944 35.6801 27.5333 35.4174 27.4604C35.1283 27.3783 34.5478 27.5852 34.1549 27.92C33.941 28.1021 33.7821 29.1546 33.7751 29.9838L33.7457 33.2055L33.0102 30.0683C33.0071 30.0543 32.6994 28.7485 32.2848 27.8828C31.95 27.1806 31.2138 27.145 31.0704 27.145C30.8449 27.1605 30.0195 27.4379 29.7529 28.0556C29.5669 28.4888 29.9885 30.7495 30.4853 32.5948L29.7506 32.8366C29.725 32.7692 27.0241 25.9065 25.8887 24.4705C25.1587 23.5467 24.6704 23.4397 24.3666 23.4397C24.1961 23.4397 24.0318 23.4738 23.859 23.5102L23.6924 23.5436C23.2568 23.6242 22.7988 24.1798 22.7081 24.7324C22.7151 25.0285 23.5172 26.3909 24.162 27.486C24.8696 28.6888 25.6725 30.052 26.2235 31.2509C26.3636 31.5563 26.4938 31.8715 26.6141 32.1964L26.6157 32.2019C27.4566 33.3605 27.8751 37.1712 27.9208 37.609L27.1512 37.6982C27.1481 37.671 26.7932 34.957 25.9329 32.5886L25.9027 32.5599Z" fill="#111111"/>
                </svg>
            </div>
            `;


            pages.forEach((page, index) => {
                // const imageLink = page.imageLink ? `${baseUrl}${page.imageLink}` : null;
                let slideHTML = "";
                if (page.videoLink) {
                    slideHTML = `<div class='swiper-slide slide-without-footer'>
                        <iframe src='${page.videoLink}' class='video-full-size' frameborder='0' allowfullscreen style="margin-right: 10px;margin-left: 10px;"></iframe>
                        ${iconHTML}
                    </div>`;
                } else if (page.imageLink && page.text && page.isBigImage) {
                    slideHTML = `<div class='swiper-slide'>
                        <img class="swiper-slide__image third-two-image" src="${page.imageLink}" alt="Image">
                        <div class='text-container three'><pre>${page.text}</pre></div>
                        ${iconHTML}
                    </div>`;
                } else if (page.imageLink && page.text) {
                    slideHTML = `<div class='swiper-slide'>
                        <img class="swiper-slide__image half-image" src="${page.imageLink}" alt="Image" style="object-fit: cover;">
                        <div class='text-container'><pre>${page.text}</pre></div>
                        ${iconHTML}
                    </div>`;
                } else if (page.buttons?.length > 0 && page.imageLink) {
                    const buttonsHTML = page.buttons.map(button => {
                        return `<button class="buttons-container__btn" onclick='switchSlide(event, ${button.nextPageNumber - 1})'>${button.text}</button>`;
                    }).join('');
                    slideHTML = `<div class='swiper-slide'>
                        <img class="swiper-slide__image butt" src="${page.imageLink}" alt="Image" style="object-fit: cover;">
                        <div class='buttons-container'>${buttonsHTML}</div>
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
                        ${iconHTML}
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
                        ${iconHTML}
                    </div>`;
                } else if (page.text && page.isAnswerPage) {
                    const sendButtonText = i18next.language.startsWith("ru") ? 'Отправить' : 'Send';
                    const responseLabelText = i18next.language.startsWith("ru") ? 'Запишите свой ответ:' : 'Write down your answer:';
                    const buttonsHTML = page.buttons.map(button => {
                        return `<button class="buttons-container__btn" onclick='switchSlide(event, ${button.nextPageNumber - 1})'>${button.text}</button>`;
                    }).join('');
                    slideHTML = `<div class='swiper-slide slide-without-footer'>
                        <div class='exercise-text'><pre>${page.text}</pre></div>
                        <div class='response-block' data-page-id="${page.id}">
                            <p class='response-label'>${responseLabelText}</p>
                            <textarea class='response-input'></textarea>
                            <button class='response-button' onclick='sendAnswer(event)'>${sendButtonText}</button>
                        </div>
                        <div class='buttons-container'>${buttonsHTML}</div>
                    </div>`;
                } else if (page.imageLink) {
                    slideHTML = `<div class='swiper-slide'>
                        <img class="swiper-slide__image" src="${page.imageLink}" alt="Image" style="height:66%;">
                        ${iconHTML}
                    </div>`;
                }else if (page.text && page.imageLink === null && page.videoLink === null && page.audio === null) {
                    slideHTML = `<div class='swiper-slide' style="justify-content: center;">
                        <div class='text-container'><pre>${page.text}</pre></div>
                        ${iconHTML}
                    </div>`;
                }


                container.innerHTML += slideHTML;
                if (page.audio) {
                    setTimeout(() => {
                        const waveformContainer = document.querySelector(`#waveform-${index}`);
                        if (!waveformContainer) {
                            console.error(`Контейнер #waveform-${index} не найден.`);
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
                
                        console.log(`Загрузка файла ${page.audio}`);
                        wave.load(page.audio);
                
                        wave.on('ready', () => console.log(`Волны готовы для #waveform-${index}`));
                        wave.on('error', (e) => console.error(`Ошибка Wavesurfer для #waveform-${index}:`, e));
                
                        const playPauseBtn = document.getElementById(`play-pause-${index}`);
                        if (!playPauseBtn) {
                            console.error(`Кнопка Play/Pause не найдена для слайда ${index}.`);
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
                            document.getElementById(`time-display-${index}`).textContent = `${minutes}:${seconds}`;
                        });
                
                        wave.on('finish', () => {
                            playPauseBtn.querySelector('#playIcon').style.display = 'block';
                            playPauseBtn.querySelector('#pauseIcon').style.display = 'none';
                        });
                    }, 200);  // Увеличил задержку для надежности
                }
                
            });
            setTimeout(() => {
                swiper.update();
                if (swiper.activeIndex === 0) {
                    showPopup();
                }
            }, 300);
        })
        .catch(error => console.error("Ошибка загрузки данных:", error));
}


document.addEventListener("DOMContentLoaded", function () {
    initLanguages(loadApiData);
    let button = document.querySelector(".VideoPlayerEmbed__button");
    if (button) {
        button.remove();
    }
    let toastContainer = document.getElementById('toast');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast';
        toastContainer.className = 'toast';
        document.body.appendChild(toastContainer);
    }
    document.addEventListener("keydown", function (event) {
        if (event.code === "ArrowRight") {
            swiper.slideNext();
        } else if (event.code === "ArrowLeft") {
            swiper.slidePrev();
        }
    });
});
let isPopupShown = false;

function showPopup() {
    if (isPopupShown) return;
    isPopupShown = true;

    const userLang = navigator.language.startsWith("ru") ? "ru" : "en";

    const messages = {
        ru: "Свайп влево для перехода на следующую страницу",
        en: "Swipe left to go to the next page.",
    };

    const popupup = document.createElement("div");
    popupup.className = "swipe-popup";
    popupup.textContent = messages[userLang];

    document.body.appendChild(popup);

    setTimeout(() => {
        popupup.classList.add("show");
    }, 10);

    setTimeout(() => {
        popupup.classList.remove("show");
        popupup.classList.add("hide");
        setTimeout(() => {
            popupup.remove();
        }, 300);
    }, 3000);
}