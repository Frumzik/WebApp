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


function redirectNotAuthorized(response) {
    if (response.status === 403) {
        window.location.href = '/auth/login/';
    }

    else {
        return response.json()
    }
}

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
            loadPath: '../json/{{lng}}.json'
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