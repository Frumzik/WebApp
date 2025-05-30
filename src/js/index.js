const modal = document.getElementById("modal");
const btn = document.getElementById("open-modal");
const span = document.getElementsByClassName("custom-close")[0];
const paymentOption = document.getElementById("payment-option");
const cryptoPaymentCheckbox = document.getElementById("crypto-payment");
const amountInput = document.getElementById("amount");

const swiper = new Swiper('.swiper-page1', {
    slidesPerView: 'auto',
    spaceBetween: 10, 
    freeMode: true,
    breakpoints: {
        768: { slidesPerView: 5 },
        992: { slidesPerView: 6 },
    },
});

amountInput.addEventListener("input", function (event) {

    this.value = this.value.replace(/[^0-9.]/g, '');
});

btn.onclick = function() {
    modal.style.display = "block";

}

span.onclick = function() {
    modal.style.display = "none";

}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";

    }
}

paymentOption.onclick = function() {
    cryptoPaymentCheckbox.checked = !cryptoPaymentCheckbox.checked; 
    paymentOption.classList.toggle("active", cryptoPaymentCheckbox.checked);
}


function LoadApiData() {
    const currentPath = window.location.pathname;
    const initData = btoa(window.Telegram.WebApp.initData);
    const params = new URLSearchParams({
        lang: i18next.language,
    }).toString();

    fetch(`/api/user/profile/?${params}`, {
        headers: {'X-Telegram-Init-Data': initData},
        method: "GET",
    })
        .then((response) => redirectNotAuthorized(response))
        .then((data) => {
            const firstName = data.user.firstName.length > 10 ? data.user.firstName.slice(0, 10) : data.user.firstName;
            let lastName;
            if (data.user.lastName === null) lastName = '';
            else lastName = data.user.lastName.length > 10 ? data.user.lastName.slice(0, 10) : data.user.lastName;
            const userName = `${firstName} ${lastName}`;
            const balance = data.user.balance;
            const name = data.series.name;
            const number = data.series.number;
            const progressValue = data.progress;
            const newsArray = data.news;
            const notices = data.notices;

            displayNotifications(notices);
            document.getElementById("userName").innerHTML = userName;
            document.getElementById("balance").textContent = balance;
            document.getElementById("number").textContent = number;
            document.getElementById("name").textContent = name;
            document.getElementById("progress").style.width = progressValue * 100 + "%";
            document.getElementById("avatarLink").src = data.user.avatarLink;
            document.getElementById("communityLink").href = data.communityLink;
            document.getElementById("iconLink").href = data.iconLink;
            document.getElementById("supportLink").href = data.supportLink;

            const newsContainer = document.getElementById("newsContainer");
            newsContainer.innerHTML = "";

            newsArray.forEach((news) => {
                const newsElement = document.createElement("div");
                newsElement.classList.add("swiper-slide", "my-slide");
                newsElement.innerHTML = `
                    <a href="${news.telegraphLink}" class="advertising__blocks">
                        <img src="${news.imageLink}" style="height: inherit; border-radius: 10px; width: 100%;">
                    </a>
                `;
                newsContainer.appendChild(newsElement);
            });

            swiper.update();
        })
        .catch((error) => console.error("Ошибка:", error));
}

document.addEventListener("DOMContentLoaded", initLanguages(LoadApiData));
i18next.on('languageChanged', LoadApiData);

document.querySelectorAll('a').forEach(link => {
    if (link.classList.contains('no-confirm')) {
        return;
    }

    link.addEventListener('click', switchPages);
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('notification-link').addEventListener('click', function(event) {
        event.preventDefault();
        const popup = document.getElementById('popup');
        if (popup.classList.contains('hidden')) {
            popup.classList.remove('hidden');
        } else {
            popup.classList.add('hidden');
        }
        
    markNoticesAsRead();
    });

    document.getElementById('close-button').addEventListener('click', function() {
    document.getElementById('popup').classList.add('hidden');
    });
});
