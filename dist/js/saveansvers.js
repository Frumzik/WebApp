const initData = btoa(window.Telegram.WebApp.initData);

function loadApiData() {
    const params = new URLSearchParams({
        lang: i18next.language,
    }).toString();

    fetch(`https://i-game.one/api/series/history/?${params}`, {
        headers: { "X-Telegram-Init-Data": 'cXVlcnlfaWQ9QUFHUWUxZ3pBQUFBQUpCN1dETlZ4OWY2JnVzZXI9JTdCJTIyaWQlMjIlM0E4NjE0MzY4MTYlMkMlMjJmaXJzdF9uYW1lJTIyJTNBJTIyJUUyJTlEJTk0JTIyJTJDJTIybGFzdF9uYW1lJTIyJTNBJTIyJTIyJTJDJTIydXNlcm5hbWUlMjIlM0ElMjJ0cmFwX3NoYXJrayUyMiUyQyUyMmxhbmd1YWdlX2NvZGUlMjIlM0ElMjJydSUyMiUyQyUyMmFsbG93c193cml0ZV90b19wbSUyMiUzQXRydWUlMkMlMjJwaG90b191cmwlMjIlM0ElMjJodHRwcyUzQSU1QyUyRiU1QyUyRnQubWUlNUMlMkZpJTVDJTJGdXNlcnBpYyU1QyUyRjMyMCU1QyUyRmpybnp3R1RFdVN6LUh5M291eXNLZC1jNFdIZUlvT1ZOakZfWnhPb0RZTlkuc3ZnJTIyJTdEJmF1dGhfZGF0ZT0xNzMyNzkyMzc0JnNpZ25hdHVyZT1mUWk0VFhhNFZ6ZERGR3ExV25ra1g4LXZqQzh3cEl5M2dqY0pWQk5SYWRGNF92OGxvOXRFakt5dmkta2xPeDdvWVZaeFNBUUx3b1JIbkhyQzlGVXpBUSZoYXNoPWQ0OTY4YTAxODU2ZDg2YzNhNWM0MTFmNjdkNmVkMTJjMjUzNjQ1ODQxMWMwNDdiNzMwNzMzMDVmMmUxZmZhYjY=' },
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
            document.getElementById("userName").innerHTML = userName;
            document.getElementById("balance").textContent = balance;
            document.getElementById("avatarLink").src = data.user.avatarLink;
            notices = data.notices;
            displayNotifications(notices);

            const answersArray = data.answers;
            answersArray.forEach((answerObj) => {
                const series = answerObj.series;
                const answer = answerObj.answer;

                if (series) {
                    let seriesElement = document.querySelector(`.block[data-id="${series.id}"]`);
                    if (!seriesElement) {
                        seriesElement = document.createElement('div');
                        seriesElement.classList.add('block');
                        seriesElement.setAttribute('data-id', series.id);
                        seriesElement.onclick = () => window.location.href = `/answers.html?series_id=${series.id}&answer=${encodeURIComponent(answer)}`;
                        seriesElement.innerHTML = `
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
                        `;
                        document.getElementById('seriesContainer').appendChild(seriesElement);
                    } else {
                        seriesElement.querySelector('.series__block-logo img').src = series.iconLink;
                        seriesElement.querySelector('.seriesNumber').textContent = `СЕРИЯ ${series.number}`;
                        seriesElement.querySelector('.seriesName').textContent = `«${series.name}»`;
                    }
                }
            });
        })
        .catch((error) => console.error("Ошибка:", error));
}


document.addEventListener("DOMContentLoaded", function () {
    initLanguages(loadApiData);
    const currentPath = window.location.pathname;
    const initData = btoa(window.Telegram.WebApp.initData);

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
        const popup = document.getElementById('popup');
        popup.classList.add('hidden');
    });
    
});

document.querySelectorAll('a').forEach(link => {
    if (link.classList.contains('no-confirm')) {
        return;
    }

    link.addEventListener('click', switchPages);
});

const paymentModal = document.getElementById('paymentModal');
const openPaymentModalBtn = document.getElementById('open-payment-modal');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const confirmPaymentBtn = document.getElementById('confirmPayment');
const paymentOption = document.getElementById("paymentOption");
const cryptoPaymentCheckbox = document.getElementById("cryptoPayment");
const amountInput = document.getElementById("amount");

function openPaymentModal() {
    paymentModal.style.display = 'flex';
}

function closePaymentModal() {
    paymentModal.style.display = 'none'; 
}

openPaymentModalBtn.addEventListener('click', openPaymentModal);
modalCloseBtn.addEventListener('click', closePaymentModal);
window.addEventListener('click', function (event) {
    if (event.target === paymentModal) {
        closePaymentModal(); 
    }
});
amountInput.addEventListener("input", function (event) {
    this.value = this.value.replace(/[^0-9.]/g, '');
});
paymentOption.onclick = function() {
    cryptoPaymentCheckbox.checked = !cryptoPaymentCheckbox.checked; 
    paymentOption.classList.toggle("active", cryptoPaymentCheckbox.checked);
}