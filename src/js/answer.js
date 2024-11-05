const initData = btoa(window.Telegram.WebApp.initData);

function loadApiData() {
    let url = window.location.href;
    url = new URL(url);
    let seriesId = url.searchParams.get('series_id');
    seriesId = parseInt(seriesId);

    fetch(`https://test0123481.ru/api/series/history/`, {
        headers: { "X-Telegram-Init-Data": initData },
        method: "GET",
    })
        .then((response) => redirectNotAuthorized(response))
        .then((data) => {
        const answersArray = data.answers;
        let seriesElement;
        answersArray.forEach((answerObj) => {
            const series = answerObj.series;
            const answer = answerObj.answer;

            if (series.id === seriesId) {
                document.getElementById('answer-text').innerHTML = answer;
                document.getElementById('modalNumber').innerHTML = `СЕРИЯ ${series.number}`;
                document.getElementById('modalName').innerHTML = `«${series.name}»`;
            }

        });
        })
        .catch((error) => console.error("Ошибка:", error));
}


document.addEventListener("DOMContentLoaded", loadApiData);