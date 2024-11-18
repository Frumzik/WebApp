const initData = btoa(window.Telegram.WebApp.initData);
const modal = document.getElementById("modal");
const btn = document.getElementById("open-modal");
const span = document.getElementsByClassName("custom-close")[0];
const amountInput = document.getElementById("amount");
const paymentOption = document.getElementById("payment-option");
const cryptoPaymentCheckbox = document.getElementById("crypto-payment");

amountInput.addEventListener("input", function (event) {

    this.value = this.value.replace(/[^0-9.]/g, '');
});

paymentOption.onclick = function() {
    cryptoPaymentCheckbox.checked = !cryptoPaymentCheckbox.checked; 
    paymentOption.classList.toggle("active", cryptoPaymentCheckbox.checked);
}

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
function loadApiData() {
    fetch("https://test0123481.ru/api/referral/profile/", {
        headers: { 
            'X-Telegram-Init-Data': initData},
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
        const referralLink = data.referralLink;
        const referralBalance = data.referralBalance;
        const referralBalanceInDollars = data.referralBalanceInDollars;
        notices = data.notices;
        displayNotifications(notices);

        document.getElementById("userName").innerHTML = userName;
        document.getElementById("referralLink").innerHTML = referralLink;
        document.getElementById("referralBalance").innerHTML = referralBalance;
        document.getElementById("referralBalanceInDollars").innerHTML = referralBalanceInDollars;
        document.getElementById("balance").textContent = balance;
        document.getElementById("avatarLink").src = data.user.avatarLink;

        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.innerHTML = '';
            const imgIcon = document.createElement("img");
            imgIcon.setAttribute("class", "toast-icon");
            imgIcon.setAttribute("src", "../img/copy.png"); 
            imgIcon.setAttribute("alt", "Icon");
            const toastText = document.createElement("span");
            toastText.textContent = message;
            toast.appendChild(imgIcon);
            toast.appendChild(toastText);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }

        const copyButton = document.getElementById("copyBtn");

        if (window.Telegram.WebApp.initData !== '') {
            copyButton.textContent = 'Поделиться';
            copyButton.addEventListener("click", function() {
                if (referralLink) {
                    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Привет')}`;
                    window.location.href = telegramUrl;
                }
            });
        } else {
            copyButton.textContent = 'Cкопировать';
            copyButton.addEventListener("click", function() {
                if (referralLink) {
                    navigator.clipboard.writeText(referralLink).then(function() {
                        showToast('Реферальная ссылка скопирована.');
                        console.log('Реферальная ссылка скопирована.');
                    }).catch(function(error) {
                        console.error('Ошибка при копировании: ', error);
                    });
                }
            });
        }

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
    })
    .catch((error) => console.error("Ошибка:", error));
}


document.querySelectorAll('a').forEach(link => {
    if (link.classList.contains('no-confirm')) {
        return;
    }

    link.addEventListener('click', switchPages);
});
document.addEventListener("DOMContentLoaded", function () {
    initLanguages(loadApiData);
    const initData = btoa(window.Telegram.WebApp.initData);
    let notices = [];

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



