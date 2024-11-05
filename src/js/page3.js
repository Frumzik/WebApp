const initData = btoa(window.Telegram.WebApp.initData);

function loadApiData() {
    fetch("https://test0123481.ru/api/referral/profile/", {
        headers: { 'X-Telegram-Init-Data': initData },
        method: "GET",
    })
    .then((response) => redirectNotAuthorized(response))
    .then((data) => {
        const firstName = data.user.firstName.length > 10 ? data.user.firstName.slice(0, 10) : data.user.firstName;
        const lastName = data.user.lastName.length > 10 ? data.user.lastName.slice(0, 10) : data.user.lastName;
        const userName = `${firstName} ${lastName}`;
        const balance = data.user.balance;
        const referralLink = data.referralLink;
        const referralBalance = data.referralBalance;
        const referralBalanceInDollars = data.referralBalanceInDollars;
        notices = data.notices;

        document.getElementById("userName").innerHTML = userName;
        document.getElementById("referralLink").innerHTML = referralLink;
        document.getElementById("referralBalance").innerHTML = referralBalance;
        document.getElementById("referralBalanceInDollars").innerHTML = referralBalanceInDollars;
        document.getElementById("balance").textContent = balance;
        document.getElementById("avatarLink").src = data.user.avatarLink;

        const copyButton = document.getElementById("copyBtn");
        copyButton.addEventListener("click", function() {
            navigator.clipboard.writeText(referralLink).then(function() {
                console.log('Реферальная ссылка скопирована в буфер обмена');
            }).catch(function(error) {
                console.error('Ошибка при копировании: ', error);
            });
        });

        const submitBtn = document.getElementById("submitBtn");
        const inputNumber = document.getElementById("inputNumber");

        inputNumber.addEventListener("input", function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });

        submitBtn.addEventListener("click", function() {
            let amount = inputNumber.value.trim();

            if (!amount) {
                alert('Пожалуйста, введите число.');
                return;
            }

            fetch('https://test0123481.ru/api/referral/order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: amount })
            })
            .then(response => {
                redirectNotAuthorized(response);
                if (response.ok) {
                    console.log('204 OK');
                } else if (response.status === 409) {
                    console.error('409 Не достаточно средств');
                } else {
                    console.log('Ошибка сети');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        });

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


document.addEventListener("DOMContentLoaded", function () {
    initLanguages(loadApiData);
    const initData = btoa(window.Telegram.WebApp.initData);
    let notices = [];

    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.BackButton.onClick(function () {
        window.Telegram.WebApp.BackButton.hide();
        window.location.href = "/page2.html";
    });

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
