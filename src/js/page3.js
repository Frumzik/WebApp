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
    fetch("/api/referral/profile/", {
        headers: {
            'X-Telegram-Init-Data': initData
        },
        method: "GET",
    })
    .then((response) => redirectNotAuthorized(response))
    .then((data) => {
        const firstName = data.user.firstName.length > 10 ? data.user.firstName.slice(0, 10) : data.user.firstName;
        const lastName = data.user.lastName 
            ? data.user.lastName.length > 10 ? data.user.lastName.slice(0, 10) : data.user.lastName 
            : '';
        const userName = `${firstName} ${lastName}`;
        const referralLink = data.referralLink;

        document.getElementById("userName").textContent = userName;
        document.getElementById("referralLink").textContent = referralLink;
        document.getElementById("avatarLink").src = data.user.avatarLink;

        const copyButton = document.getElementById("copyBtn");
        if (window.Telegram.WebApp.initData !== '') {
            copyButton.setAttribute('data-i18n', 'share');
            copyButton.addEventListener("click", function () {
                if (referralLink) {
                    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`;
                    window.location.href = telegramUrl;
                }
            });
        } else {
            copyButton.setAttribute('data-i18n', 'copy'); 
            copyButton.addEventListener("click", function () {
                if (referralLink) {
                    navigator.clipboard.writeText(referralLink).then(function () {
                        showToast('toast.copySuccess'); 
                    }).catch(function (error) {
                        console.error('Ошибка при копировании: ', error);
                    });
                }
            });
        }
    })
    .catch((error) => console.error("Ошибка:", error));
}

function showToast(messageKey) {
    const toast = document.getElementById('toast');
    toast.innerHTML = ''; 
    const imgIcon = document.createElement("img");
    imgIcon.setAttribute("class", "toast-icon");
    imgIcon.setAttribute("src", "../img/copy.png");
    imgIcon.setAttribute("alt", "Icon");
    const toastText = document.createElement("span");
    toastText.setAttribute('data-i18n', messageKey); 
    toast.appendChild(imgIcon);
    toast.appendChild(toastText);
    updateLanguageContent();
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
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



