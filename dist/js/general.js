function switchPages(event) {
    try {
        const currentUrl = window.location.href;
        let history = sessionStorage.getItem('pageHistory');

        if (history === null) history = [];
        else history = JSON.parse(history);

        history.push(currentUrl);
        sessionStorage.setItem('pageHistory', JSON.stringify(history));
        window.Telegram.WebApp.BackButton.show();

        window.location.href = event.currentTarget.href;

    } catch (error) {
        window.location.href = event.currentTarget.href;
    }

}
function markLinksAsTelegram() {
    let settings = document.getElementsByClassName('settings');
    if (settings.length > 0) {
        settings = settings[0];
        if (window.Telegram.WebApp.initData !== '') {
            settings.href = '/auth/login/?telegram=true';
        }
    }
}

function redirectNotAuthorized(response) {
    if (response.status === 403) {
        window.location.href = '/auth/login/';
    }

    else {
        return response.json()
    }
}

function markNoticesAsRead() {
    let bellIcon = document.getElementById('bell-icon');
    bellIcon.src = '/icons/material-symbols-light_notifications-unread-outline-rounded.svg';

    const initData = btoa(window.Telegram.WebApp.initData);
    fetch('/api/user/notice/read/', {
        'method': 'POST',
        headers: {'X-Telegram-Init-Data': initData},
    })
}

function displayNotifications(notices) {
    const notificationText = document.getElementById('notification-text');
    notificationText.innerHTML = '';

    let readAllMessages = true;
    for (let i = 0; i < notices.length; i++) {
        const p = document.createElement('p');

        const noticeType = notices[i].text;
        const message = i18next.t(`notifications.${noticeType}`);

        if (message !== undefined) {
            const textSpan = document.createElement('span');
            textSpan.textContent = message;

            const dateSpan = document.createElement('span');
            dateSpan.textContent = formatDateTime(notices[i].datetime);
            dateSpan.style.fontSize = '0.85em'; 
            dateSpan.style.color = '#999'; 

            p.appendChild(textSpan); 
            p.appendChild(dateSpan); 
            notificationText.appendChild(p);

            if (!notices[i].read) readAllMessages = false;
        }
    }

    if (!readAllMessages) {
        const bellIcon = document.getElementById('bell-icon');
        bellIcon.src = '/icons/material_symbols_light_notifications_unread_outline_rounded_1.svg';
    }
}

// Функция для форматирования даты и времени
function formatDateTime(datetime) {
    const date = new Date(datetime);
    return date.toLocaleString(); // Локализованный формат даты и времени
}

function updateLanguageContent() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (element.tagName === "INPUT") {
            element.setAttribute("placeholder", i18next.t(key));
        } else {
            element.textContent = i18next.t(key);
        }
    });
}

function initLanguages(after) {
    i18next
    .use(i18nextBrowserLanguageDetector)
    .use(i18nextHttpBackend)
    .init({
        backend: {
            loadPath: '/json/{{lng}}.json'
        },
        fallbackLng: "ru",
        detection: {
            order: ['cookie', 'localStorage', 'navigator'],
            caches: ['cookie']
        }
    }, () => {
        updateLanguageContent();

        i18next.on('languageChanged', updateLanguageContent());
    })
    .then(() => after());
}

function redirectOnPaymentPage(event) {
    let amount = document.getElementById('amount').value;
    if (!amount.match(/^\d+$/)) {
        alert('Введите сумму для вывода средств');
        return
    }

    const initData = btoa(window.Telegram.WebApp.initData);
    fetch('/api/payment/create/', {
        headers: {
            'X-Telegram-Init-Data': initData,
        },
        method: "POST",
        body: JSON.stringify({'amount': amount})
    })
    .then((response) => response.json())
    .then((data) => {
        window.location.href = data.payUrl;
    })
}

window.Telegram.WebApp.BackButton.onClick(() => {
    let backHistory = sessionStorage.getItem('pageHistory');

    if (backHistory !== null) {
        backHistory = JSON.parse(backHistory);
        let backUrl = backHistory.pop();

        if (backHistory.length === 0) window.Telegram.WebApp.BackButton.hide();
        sessionStorage.setItem('pageHistory', JSON.stringify(backHistory));
        window.location.href = backUrl;
    }

    else window.Telegram.WebApp.BackButton.hide();

});


document.addEventListener("DOMContentLoaded", function () {
    if(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.expand){
        window.Telegram.WebApp.expand();
    }
    markLinksAsTelegram();
});