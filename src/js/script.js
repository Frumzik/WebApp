document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  if (currentPath === "/index.html") {
    fetch("https://test0123481.ru/api/user/profile/?lang=ru") // Замените URL на свой API
      .then((response) => response.json())
      .then((data) => {
        // Предполагаем, что data содержит firstName и lastName
        const userName = `${data.user.firstName} ${data.user.lastName}`;
        const balance = `${data.user.balance}`;
        const name = `${data.series.name}`;
        const number = `${data.series.number}`;
        const progressValue = `${data.progress}`;
        const newsArray = data.news[0];
        document.getElementById("userName").innerHTML = userName;
        document.getElementById("balance").textContent = balance;
        document.getElementById("name").textContent = name;
        document.getElementById("number").textContent = number;
        document.getElementById("progress").style.width =
          progressValue * 100 + "%";
        document.getElementById("avatarLink").href = data.avatarLink;
        document.getElementById("communityLink").href = data.communityLink;
        document.getElementById("iconLink").href = data.iconLink;
        document.getElementById("supportLink").href = data.supportLink;
        document.getElementById("telegraphLink").href = newsArray.telegraphLink;
        document.getElementById("imageLink").href = newsArray.imageLink;
      })
      .catch((error) => console.error("Ошибка:", error));
  } else if (currentPath === "/page2.html") {
    fetch("https://test0123481.ru/api/series/list/") 
      .then((response) => response.json())
      .then((data) => {
        const userName = `${data.user.firstName} ${data.user.lastName}`;
        const balance = `${data.user.balance}`;
        const series = data.series[0];


        document.getElementById("userName").innerHTML = userName;
        document.getElementById("balance").textContent = balance;
        document.getElementById("name").textContent = series.name;
        document.getElementById("number").textContent = series.number;
        document.getElementById("avatarLink").href = data.avatarLink;
        document.getElementById("avatarLink").href = series.iconLink;
        
      })
      .catch((error) => console.error("Ошибка:", error));
  }
});

// async function fetchUserData() {
//   try {
//     const response = await fetch(
//       "https://test0123481.ru/api/user/profile/?lang=ru"
//     );
//     if (!response.ok) {
//       throw new Error("Сеть ответила с ошибкой");
//     }
//     const data = await response.json();

//     const userName = `${data.user.firstName} ${data.user.lastName}`;
//     const balance = `${data.user.balance}`;
//     const name = `${data.series.name}`;
//     const number = `${data.series.number}`;
//     const progressValue = `${data.progress}`;
//     const newsArray = data.news[0];

//     document.getElementById("telegraphLink").href = newsArray.telegraphLink;
//     document.getElementById("imageLink").href = newsArray.imageLink;

//     document.getElementById("userName").innerHTML = userName;
//     document.getElementById("balance").textContent = balance;
//     document.getElementById("name").textContent = name;
//     document.getElementById("number").textContent = number;
//     document.getElementById("progress").style.width = progressValue * 100 + "%";
//     document.getElementById("avatarLink").href = data.avatarLink;
//     document.getElementById("communityLink").href = data.communityLink;
//     document.getElementById("iconLink").href = data.iconLink;
//     document.getElementById("supportLink").href = data.supportLink;
//   } catch (error) {
//     console.error("Ошибка при получении данных:", error);
//   }
// }
// fetchUserData();

// async function fetchUserData() {
//   try {
//     // Выполняем два запроса параллельно
//     const [response1, response2] = await Promise.all([
//       fetch("https://test0123481.ru/api/user/profile/?lang=ru"),
//       fetch("https://test0123481.ru/api/series/list/"),
//     ]);

//     // Проверяем ответы
//     if (!response1.ok || !response2.ok) {
//       throw new Error("Ошибка при выполнении запросов");
//     }

//     // Преобразуем ответы в JSON
//     const data1 = await response1.json();
//     const data2 = await response2.json();

//     // Работаем с данными из первого API
//     const news1 = data1.news[0];
//     const userName = `${data1.user.firstName} ${data1.user.lastName}`;
//     const balance = `${data1.user.balance}`;
//     const name = `${data1.series.name}`;
//     const number = `${data1.series.number}`;
//     const progressValue = `${data1.progress}`;
//     ///////////////////////////////////////////////////////////////////////////
//     document.getElementById("userName").innerHTML = userName;
//     document.getElementById("balance").innerHTML = balance;
//     document.getElementById("name").textContent = name;
//     document.getElementById("number").innerHTML = number;
//     document.getElementById("progress").style.width = progressValue * 100 + "%";
//     document.getElementById("avatarLink").href = data1.avatarLink;
//     document.getElementById("telegraphLink").href = news1.telegraphLink;
//     document.getElementById("imageLink").href = news1.imageLink;
//     document.getElementById("communityLink").href = data1.communityLink;
//     document.getElementById("iconLink").href = data1.iconLink;
//     document.getElementById("supportLink").href = data1.supportLink;
//     // Работаем с данными из второго API
//     // const news2 = data2.news[0];
//     const userName2 = `${data2.user.firstName} ${data2.user.lastName}`;
//     const balance2 = `${data2.user.balance}`;
//     ///////////////////////////////////////////////////////////////////////////
//     document.getElementById("userName").innerHTML = userName2;
//     document.getElementById("balance").textContent = balance2;
//   } catch (error) {
//     console.error("Ошибка:", error);
//   }
// }

// // Вызываем функцию для загрузки данных
// fetchUserData();

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
