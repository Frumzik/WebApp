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
