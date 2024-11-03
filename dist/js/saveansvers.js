document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const initData = btoa(window.Telegram.WebApp.initData);

    if (currentPath === "/saveanswers.html") {
    fetch("https://test0123481.ru/api/series/history", {
        headers: { 'X-Telegram-Init-Data': initData },
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
        const userName = `${data.user.firstName} ${data.user.lastName}`;
        const balance = `${data.user.balance}`;

        const firstAnswer = data.answers[0];
        const seriesName = firstAnswer.series.name;
        const seriesNumber = firstAnswer.series.number;
        const seriesPrice = firstAnswer.series.price;
        const seriesDescription = firstAnswer.series.description;
        const seriesIconLink = firstAnswer.series.icon_link;

        document.getElementById("userName").innerHTML = userName;
        document.getElementById("balance").textContent = balance;
        document.getElementById("number").textContent = `Серия ${seriesNumber}`;
        document.getElementById("price").textContent = `Серия ${seriesPrice}`;
        document.getElementById("name").textContent = `"${seriesName}"`;
        document.getElementById("avatarLink").src = data.user.avatarLink;
        document.getElementById("icon_link").href = data.icon_link;
        })
        .catch((error) => console.error("Ошибка:", error));
    }
});