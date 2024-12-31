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
    }).then(response => {
        if (!response.ok) {
            console.error('Failed to send answer:', response.status);
        }
    }).catch(error => console.error('Error sending answer:', error));

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

    fetch(`https://i-game.one/api/series/play/?series_id=${series_id}&${params}`, {
        headers: {"X-Telegram-Init-Data": 'cXVlcnlfaWQ9QUFHUWUxZ3pBQUFBQUpCN1dETlZ4OWY2JnVzZXI9JTdCJTIyaWQlMjIlM0E4NjE0MzY4MTYlMkMlMjJmaXJzdF9uYW1lJTIyJTNBJTIyJUUyJTlEJTk0JTIyJTJDJTIybGFzdF9uYW1lJTIyJTNBJTIyJTIyJTJDJTIydXNlcm5hbWUlMjIlM0ElMjJ0cmFwX3NoYXJrayUyMiUyQyUyMmxhbmd1YWdlX2NvZGUlMjIlM0ElMjJydSUyMiUyQyUyMmFsbG93c193cml0ZV90b19wbSUyMiUzQXRydWUlMkMlMjJwaG90b191cmwlMjIlM0ElMjJodHRwcyUzQSU1QyUyRiU1QyUyRnQubWUlNUMlMkZpJTVDJTJGdXNlcnBpYyU1QyUyRjMyMCU1QyUyRmpybnp3R1RFdVN6LUh5M291eXNLZC1jNFdIZUlvT1ZOakZfWnhPb0RZTlkuc3ZnJTIyJTdEJmF1dGhfZGF0ZT0xNzMyNzkyMzc0JnNpZ25hdHVyZT1mUWk0VFhhNFZ6ZERGR3ExV25ra1g4LXZqQzh3cEl5M2dqY0pWQk5SYWRGNF92OGxvOXRFakt5dmkta2xPeDdvWVZaeFNBUUx3b1JIbkhyQzlGVXpBUSZoYXNoPWQ0OTY4YTAxODU2ZDg2YzNhNWM0MTFmNjdkNmVkMTJjMjUzNjQ1ODQxMWMwNDdiNzMwNzMzMDVmMmUxZmZhYjY='},
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
            console.log("Fetched series data:", data); // Debugging log
            const pages = data["pages"];
            const container = document.getElementById("main-container");

            // Clear the container to prevent duplicate slides
            container.innerHTML = "";

            for (let i = 0; i < pages.length; i++) {
                let page = pages[i];

                let sendButtonText = i18next.language.startsWith("ru") ? 'Отправить' : 'Send';
                let responseLabelText = i18next.language.startsWith("ru") ? 'Запишите свой ответ:' : 'Write down your answer:';

                if (page.isAnswerPage) {
                    container.innerHTML += `<div class="swiper-slide slide-without-footer">
                        <div class="exercise-text"><pre>${page.text}</pre></div>
                        <div class="response-block">
                            <p class="response-label">${responseLabelText}</p>
                            <textarea class="response-input" id="answer-area"></textarea>
                            <button class="response-button" onclick="sendAnswer(event)">${sendButtonText}</button>
                        </div>
                    </div>`;
                } else if (page.text !== "" && page.videoLink === null && page.imageLink !== null) {
                    container.innerHTML += `<div class="swiper-slide">
                        <img class="swiper-slide__image" src="${page.imageLink}" alt="Image">
                        <div class="text-container"><pre>${page.text}</pre></div>
                    </div>`;
                } else if (page.text !== "" && page.videoLink === null && page.imageLink === null) {
                    let buttonsHTML = page.buttons.map(button => {
                        return `<button class="buttons-container__btn" onclick="switchSlide(event, ${button.nextPageNumber})">${button.text}</button>`;
                    }).join('');

                    container.innerHTML += `<div class="swiper-slide">
                        <div class="text-container"><pre>${page.text}</pre></div>
                        <div class="buttons-container">${buttonsHTML}</div>
                    </div>`;
                } else if (page.text === "" && page.videoLink !== null) {
                    container.innerHTML += `<div class="swiper-slide slide-without-footer">
                        <iframe src="${page.videoLink}" class="video-full-size" frameborder="0" allowfullscreen></iframe>
                    </div>`;
                } else if (page.text === "" && page.videoLink === null && page.imageLink !== null) {
                    container.innerHTML += `<div class="swiper-slide">
                        <img class="swiper-slide__image" src="${page.imageLink}" alt="Image">
                    </div>`;
                }
            }

            swiper.update();
        })
        .catch((error) => console.error("Error loading API data:", error));
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
