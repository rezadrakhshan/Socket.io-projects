const audio = document.querySelector("#background-music");


window.addEventListener(
  "click",
  () => {
    if (audio.muted) {
      audio.muted = false;
      audio.volume = 0.0;
    }
    audio.play().catch((err) => {
      console.warn("Initial autoplay failed:", err);
    });
  },
  { once: true }
);
