const audio = document.getElementById("background-music");
const toggleBtn = document.getElementById("toggle-music");
const modal = document.getElementById("friend-modal");
const modalContent = modal.querySelector(".modal-content");
const notifBtn = document.getElementById("toggle-notif");
const notifBox = document.getElementById("notification-box");
const playWithBotBtn = document.getElementById("play-with-bot");
const botLoadingScreen = document.getElementById("bot-loading");

window.addEventListener(
  "click",
  () => {
    if (audio.muted) {
      audio.muted = false;
      audio.volume = 0.4;
    }
    audio.play().catch((err) => {
      console.warn("Initial autoplay failed:", err);
    });
  },
  { once: true }
);

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
  }, 5000)
});
