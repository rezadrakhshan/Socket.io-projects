export const audio = document.querySelector("#background-music");
const setting = JSON.parse(localStorage.getItem("settings"));

window.addEventListener(
  "click",
  () => {
    audio.muted = !setting.bgMusic;
    audio.volume = setting.gameVolume;
    audio.play().catch((err) => {
      console.warn("Initial autoplay failed:", err);
    });
  },
  { once: true }
);
