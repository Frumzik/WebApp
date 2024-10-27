document.addEventListener("DOMContentLoaded", function () {
    const initData = btoa(window.Telegram.WebApp.initData);

    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.BackButton.onClick(function (event) {
        window.Telegram.WebApp.BackButton.hide();
        window.location.href = "/page2.html";
    });

    fetch("https://test0123481.ru/api/referral/profile", {
        headers: { Authorization: initData },
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const userName = `${data.user.firstName} ${data.user.lastName}`;
        const balance = `${data.user.balance}`;
        const referralLink = `${data.referralLink}`;
        const referralBalance = `${data.referralBalance}`;
        const referralBalanceInDollars = `${data.referralBalanceInDollars}`;

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
                console.log('Пожалуйста, введите число.');
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
    })
    .catch((error) => console.error("Ошибка:", error));
});