const initData = btoa(window.Telegram.WebApp.initData);

function loadApiData() {
    const params = new URLSearchParams({
        lang: i18next.language,
    }).toString();

    fetch(`https://test0123481.ru/api/series/history/?${params}`, {
        headers: { "X-Telegram-Init-Data": initData },
        method: "GET",
    })
        .then((response) => redirectNotAuthorized(response))
        .then((data) => {
          // Заполняем информацию о пользователе
        const userName = `${data.user.firstName} ${data.user.lastName}`;
        const balance = data.user.balance;
        document.getElementById("userName").innerHTML = userName;
        document.getElementById("balance").textContent = balance;
        document.getElementById("avatarLink").src = data.user.avatarLink;

        const answersArray = data.answers;
        let seriesElement;
        answersArray.forEach((answerObj) => {
            const series = answerObj.series;
            const answer = answerObj.answer;

            if (series) {
            seriesElement = `
                <div class="block" onclick="window.location.href='/answers.html?series_id=${series.id}&answer=${encodeURIComponent(answer)}'" data-id=${series.id}>
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
                <span style="display: none;" class="seriesDescription">${series.description}</span>
                </div>`;

            document.getElementById("seriesContainer").innerHTML += seriesElement;
            }
        });
        })
        .catch((error) => console.error("Ошибка:", error));
}


document.addEventListener("DOMContentLoaded", function () {
    initLanguages(loadApiData);
    const currentPath = window.location.pathname;
    const initData = btoa(window.Telegram.WebApp.initData);

    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.BackButton.onClick(function () {
        window.Telegram.WebApp.BackButton.hide();
        window.location.href = "/";
    });

    const modal = document.getElementById("modal");

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
});