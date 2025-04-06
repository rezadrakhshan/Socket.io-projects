const audio = document.getElementById("background-music");
const toggleBtn = document.getElementById("toggle-music");

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
