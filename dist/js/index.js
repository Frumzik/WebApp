
const modal = document.getElementById("modal");
const btn = document.getElementById("open-modal");
const span = document.getElementsByClassName("custom-close")[0];
const paymentOption = document.getElementById("payment-option");
const cryptoPaymentCheckbox = document.getElementById("crypto-payment");
const amountInput = document.getElementById("amount");

const swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 10, 
    freeMode: true,
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
const params = new URLSearchParams({
    lang:'ru',
    lang:'en'
}).toString();


document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const initData = btoa(window.Telegram.WebApp.initData);
    
    let notices = []; 
    if (currentPath === "/") {
        fetch(`https://test0123481.ru/api/user/profile/?${params}`, {
            headers: { 'X-Telegram-Init-Data': initData },
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            const userName = `${data.user.firstName} ${data.user.lastName}`;
            const balance = data.user.balance;
            const name = data.series.name;
            const number = data.series.number;
            const progressValue = data.progress;
            const newsArray = data.news;
            notices = data.notices; 

            const bellIcon = document.getElementById('bell-icon');
            bellIcon.src = notices.length > 0
                ? '../icons/material_symbols_light_notifications_unread_outline_rounded_1.svg'
                : '../icons/material-symbols-light_notifications-unread-outline-rounded.png';

            document.getElementById("userName").innerHTML = userName;
            document.getElementById("balance").textContent = balance;
            document.getElementById("number").textContent = number;
            document.getElementById("name").textContent = name;
            document.getElementById("progress").style.width = progressValue * 100 + "%";
            document.getElementById("avatarLink").src = data.user.avatarLink;
            document.getElementById("communityLink").href = data.communityLink;
            document.getElementById("iconLink").href = data.iconLink;
            document.getElementById("supportLink").href = data.supportLink;

            for (let i = 0; i < newsArray.length; i++) {
                let newsElement = `<div class="swiper-slide">
                                    <a href="${newsArray[i].telegraphLink}" class="advertising__blocks">
                                        <img src='icons' style='height: inherit; border-radius: 10px; width: 100%;'>
                                    </a>
                                </div>`;
                document.getElementById("newsContainer").innerHTML += newsElement;
            }

            document.getElementById('notification-link').addEventListener('click', function(event) {
                event.preventDefault();
                const popup = document.getElementById('popup');
                if (popup.classList.contains('hidden')) {
                    displayNotifications(notices);
                    popup.classList.remove('hidden');
                    updatePopupPosition(popup); 
                } else {
                    popup.classList.add('hidden');
                }
            });

            document.getElementById('close-button').addEventListener('click', function() {
                document.getElementById('popup').classList.add('hidden');
            });
        })
        .catch((error) => console.error("Ошибка:", error));
    }
});

const notificationMessages = {
    buy: "Покупка",
    sc: "Успешный вывод",
    cn: "Отказ в выводе",
    cr: "Заявка на вывод создана",
    rf: "Пополнение счета",
    bn: "Реферальный бонус",
};

function displayNotifications(notices) {
    const notificationText = document.getElementById('notification-text');
    notificationText.innerHTML = ''; 
    for (let i = 0; i < notices.length; i++) {
        const p = document.createElement('p');
        const noticeType = notices[i].text;
        const message = notificationMessages[noticeType] || "Неизвестное уведомление";
        p.textContent = message;
        notificationText.appendChild(p);
    }
}
