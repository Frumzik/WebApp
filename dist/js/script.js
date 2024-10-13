async function fetchUserData() {
  try {
      const response = await fetch('https://test0123481.ru/api/user/profile/?lang=ru');
      if (!response.ok) {
          throw new Error('Сеть ответила с ошибкой');
      }
      const data = await response.json();

      const userName = `${data.user.firstName} ${data.user.lastName}`;
      const balance = `${data.user.balance}`;
      const name = `${data.series.name}`;
      const number = `${data.series.number}`;
      const progressValue = `${data.progress}`; 


      const newsArray = `${data.news}`;
      const newsObject = newsArray[0];


      document.getElementById('telegraphLink').href = newsObject.telegraphLink;
      document.getElementById('imageLink').href = newsObject.imageLink;

      document.getElementById('userName').innerHTML = userName;
      document.getElementById('balance').textContent = balance;
      document.getElementById('name').textContent = name;
      document.getElementById('number').textContent = number;
      document.getElementById('progress').style.width = (progressValue * 100) + '%';
      document.getElementById('avatarLink').href = data.avatarLink;
      document.getElementById('communityLink').href = data.communityLink;
      document.getElementById('iconLink').href = data.iconLink;
      document.getElementById('supportLink').href = data.supportLink;
  } catch (error) {
      console.error('Ошибка при получении данных:', error);
  }
}
fetchUserData();




async function fetchData() {
  try {
    // Выполняем два запроса параллельно
    const [response1, response2] = await Promise.all([
      fetch('https://test0123481.ru/api/user/profile/?lang=ru'),
      fetch('https://test0123481.ru/api/series/list/')
    ]);

    // Проверяем ответы
    if (!response1.ok || !response2.ok) {
      throw new Error('Ошибка при выполнении запросов');
    }

    // Преобразуем ответы в JSON
    const data1 = await response1.json();
    const data2 = await response2.json();

      // Работаем с данными из первого API
      const news1 = data1.news[0];
      const userName = `${data1.user.firstName} ${data1.user.lastName}`;
      const balance = `${data1.user.balance}`;
      const name = `${data1.series.name}`;
      const number = `${data1.series.number}`;
      const progressValue = `${data1.progress}`; 
///////////////////////////////////////////////////////////////////////////
      document.getElementById('telegraphLink').href = news1.telegraphLink;
      document.getElementById('imageLink').href = news1.imageLink;
      document.getElementById('userName').innerHTML = userName;
      document.getElementById('balance').textContent = balance;
      document.getElementById('name').textContent = name;
      document.getElementById('number').textContent = number;
      document.getElementById('progress').style.width = (progressValue * 100) + '%';
      document.getElementById('avatarLink').href = data1.avatarLink;
      document.getElementById('communityLink').href = data1.communityLink;
      document.getElementById('iconLink').href = data1.iconLink;
      document.getElementById('supportLink').href = data1.supportLink;
    // Работаем с данными из второго API
    // const news2 = data2.news[0];


  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// Вызываем функцию для загрузки данных
fetchData();





const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModal");

function openModal() {
  modal.style.display = "flex";
}
openModalBtn.addEventListener("click", openModal);
function closeModal() {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};




