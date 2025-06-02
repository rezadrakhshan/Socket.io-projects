const audio = document.getElementById("background-music");
const toggleBtn = document.getElementById("toggle-music");
const modal = document.getElementById("friend-modal");
const modalContent = modal.querySelector(".modal-content");
const notifBtn = document.getElementById("toggle-notif");
const notifBox = document.getElementById("notification-box");
const playWithBotBtn = document.getElementById("play-with-bot");
const contextMenu = document.getElementById("contextMenu");
export const botLoadingScreen = document.getElementById("bot-loading");
const setting = localStorage.getItem("settings") || false;

document.addEventListener("DOMContentLoaded", () => {
  if (!setting) {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        gameVolume: 0.5,
        lang: "en",
        soundEffects: true,
        bgMusic: true,
        theme: "N",
        showAvatar: true,
        animationSpeed: "N",
      })
    );
  }
});

toggleBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  toggleBtn.textContent = audio.muted ? "🔇" : "🔊";
});

const openModal = () => {
  modal.classList.remove("hidden");
  modalContent.style.animation = "fadeScaleIn 0.4s ease forwards";
};

const closeModal = () => {
  modalContent.style.animation = "fadeScaleOut 0.3s ease forwards";
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
};

document.getElementById("open-modal-btn").addEventListener("click", openModal);

document
  .querySelector(".modal-content .close")
  .addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

notifBtn.addEventListener("click", () => {
  notifBox.classList.toggle("hidden");
});

window.addEventListener("click", (e) => {
  if (!notifBox.contains(e.target) && !notifBtn.contains(e.target)) {
    notifBox.classList.add("hidden");
  }
});

playWithBotBtn.addEventListener("click", () => {
  botLoadingScreen.classList.remove("bot-hidden");

  setTimeout(() => {
    window.location.href = "/play-with-bot";
  }, 3000);
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;
  const pageWidth = window.innerWidth;
  const pageHeight = window.innerHeight;

  let posX = e.clientX;
  let posY = e.clientY;

  if (posX + menuWidth > pageWidth) posX = pageWidth - menuWidth - 5;
  if (posY + menuHeight > pageHeight) posY = pageHeight - menuHeight - 5;

  contextMenu.style.top = `${posY}px`;
  contextMenu.style.left = `${posX}px`;
  contextMenu.style.display = "block";
});

document.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

document.querySelector("#edit-profile").addEventListener("click", async (e) => {
  botLoadingScreen.classList.remove("bot-hidden");

  setTimeout(() => {
    window.location.href = "/profile";
  }, 3000);
});
