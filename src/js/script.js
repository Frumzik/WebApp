document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  if (currentPath === "/index.html") {
    fetch("https://test0123481.ru/api/user/profile/?lang=ru") 
      .then((response) => response.json())
      .then((data) => {
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
