function saveQuery() {
  const initData = btoa(window.Telegram.WebApp.initData);
  const cookies = document.cookie.split('; ');

  let isInitDataSaved = false;
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    const name = cookie[0];
    if (name === 'X-Telegram-Init-Data') {
        isInitDataSaved = true;
    }
  }

  if (!isInitDataSaved) {
    document.cookie = `X-Telegram-Init-Data=${initData}; path=/; samesite=strict`;
  }

}

window.addEventListener('DOMContentLoaded', saveQuery)
