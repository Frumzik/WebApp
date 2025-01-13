const initData = btoa(window.Telegram.WebApp.initData);

function loadApiData() {
    const params = new URLSearchParams({
        lang: i18next.language,
    }).toString();

    fetch(`/api/series/history/?${params}`, {
        headers: { "X-Telegram-Init-Data": initData },
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`Ошибка ответа API: ${response.status}`);
                return Promise.reject(`Ошибка: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Ответ от API:', data); 

            if (!data || !data.user || !data.answers) {
                console.error("Некорректные данные API");
                return;
            }

            const firstName = data.user.firstName ? data.user.firstName.slice(0, 10) : 'Нет имени';
            const lastName = data.user.lastName ? data.user.lastName.slice(0, 10) : '';
            const userName = `${firstName} ${lastName}`.trim();
            const balance = data.user.balance || 0;

            // Проверка существования элементов DOM
            if (document.getElementById("userName") && document.getElementById("balance") && document.getElementById("avatarLink")) {
                document.getElementById("userName").innerHTML = userName;
                document.getElementById("balance").textContent = balance;
                document.getElementById("avatarLink").src = data.user.avatarLink || '';
            } else {
                console.warn("Элементы userName, balance или avatarLink не найдены");
            }

            notices = data.notices || [];
            displayNotifications(notices);

            const answersArray = data.answers || [];
            console.log('Ответы пользователя:', answersArray); // Лог для проверки ответов

            const seriesContainer = document.getElementById('seriesContainer');
            if (!seriesContainer) {
                console.error("Контейнер seriesContainer не найден");
                return;
            }

            answersArray.forEach((answerObj) => {
                const series = answerObj.series;
                const answer = answerObj.answer;

                if (!series || !series.id || !series.iconLink || !series.number || !series.name) {
                    console.warn("Некорректные данные серии:", series);
                    return;
                }

                let seriesElement = document.querySelector(`.block[data-id="${series.id}"]`);
                if (!seriesElement) {
                    seriesElement = document.createElement('div');
                    seriesElement.classList.add('block');
                    seriesElement.setAttribute('data-id', series.id);
                    seriesElement.onclick = () => window.location.href = `/answers.html?series_id=${series.id}&answer=${encodeURIComponent(answer)}`;
                    seriesElement.innerHTML = `
                        <div class="series__block-logo" id="iconLink">
                            <img src="${series.iconLink}" alt="Логотип" class='seriesIcon'>
                        </div>
                        <div class="main-text">
                            <div class="main-text__title">
                                <span></span><span class="seriesNumber">СЕРИЯ ${series.number}</span>
                            </div>
                            <div class="main-text__subtitle seriesName">«${series.name}»</div>
                        </div>
                        <div class="arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="35" viewBox="0 0 18 35" fill="none">
                                <path d="M3.67798 9.59583L5.26948 8.05L13.938 16.4748C14.0777 16.6098 14.1886 16.7703 14.2643 16.9471C14.3399 17.124 14.3789 17.3136 14.3789 17.5051C14.3789 17.6966 14.3399 17.8862 14.2643 18.0631C14.1886 18.2399 14.0777 18.4004 13.938 18.5354L5.26948 26.9646L3.67948 25.4188L11.8155 17.5073L3.67798 9.59583Z" fill="#2A2A2A"/>
                            </svg>
                        </div>
                    `;
                    seriesContainer.appendChild(seriesElement);
                } else {
                    seriesElement.querySelector('.series__block-logo img').src = series.iconLink;
                    seriesElement.querySelector('.seriesNumber').textContent = `СЕРИЯ ${series.number}`;
                    seriesElement.querySelector('.seriesName').textContent = `«${series.name}»`;
                }
            });
        })
        .catch((error) => console.error("Ошибка загрузки данных:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    try {
        initLanguages(loadApiData);
    } catch (error) {
        console.error("Ошибка инициализации языков:", error);
    }

    const modal = document.getElementById("modal");
    if (!modal) {
        console.warn("Модальное окно modal не найдено");
        return;
    }

    function closeModal() {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    window.ontouchstart = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    const notificationLink = document.getElementById('notification-link');
    if (notificationLink) {
        notificationLink.addEventListener('click', function (event) {
            event.preventDefault();
            const popup = document.getElementById('popup');
            if (popup) {
                popup.classList.toggle('hidden');
                markNoticesAsRead();
            } else {
                console.warn("Попап для уведомлений не найден");
            }
        });
    }

    const closeButton = document.getElementById('close-button');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            const popup = document.getElementById('popup');
            if (popup) {
                popup.classList.add('hidden');
            }
        });
    }
});
