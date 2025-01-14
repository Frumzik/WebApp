const initData = btoa(window.Telegram.WebApp.initData);
function loadApiData() {
    const seriesId = parseInt(new URL(window.location.href).searchParams.get('series_id'), 10);

    if (isNaN(seriesId)) {
        console.error("Ошибка: seriesId не найден или некорректен.");
        return;
    }

    const lang = 'ru';

    fetch(`/api/series/history/?lang=${lang}`, {
        headers: {
            "X-Telegram-Init-Data": initData,
        },
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных. Статус: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const answersArray = (data.answers || []).filter(answerObj => answerObj.series && answerObj.series.id === seriesId);

            const modalNumber = document.getElementById('modalNumber');
            const modalName = document.getElementById('modalName');

            if (answersArray.length && modalNumber && modalName) {
                const seriesWord = lang === 'ru' ? 'СЕРИЯ' : 'SERIES';
                modalNumber.innerText = `${seriesWord} ${answersArray[0].series.number}`;
                modalName.innerText = `«${answersArray[0].series.name}»`;
            } else {
                console.warn("Нет данных для отображения модального окна.");
            }

            const answersList = document.getElementById('answers-list');
            if (!answersList) {
                console.error("Контейнер для списка ответов не найден.");
                return;
            }

            answersList.innerHTML = "";

            if (answersArray.length === 0) {
                answersList.innerHTML = "<p>Нет сохранённых ответов для этой серии.</p>";
                return;
            }

            answersArray.forEach((answerObj) => {
                const answer = answerObj.answer || "Ответ отсутствует";
                const question = answerObj.question || "Вопрос не найден"; 

                const answerBlock = document.createElement('div');
                answerBlock.classList.add('answer-answer');

                answerBlock.innerHTML = `
                    <h2 class="answer-answer-title"><span>${question}</span></h2>
                    <p id="answer-text">${answer}</p>
                `;

                answersList.appendChild(answerBlock);
            });
        })
        .catch(error => {
            console.error("Ошибка загрузки данных:", error);
            const answersList = document.getElementById('answers-list');
            if (answersList) {
                answersList.innerHTML = `<p>${error.message}</p>`;
            }
        });
}

document.addEventListener("DOMContentLoaded", loadApiData);
