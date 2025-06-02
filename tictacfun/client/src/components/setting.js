const audio = document.getElementById("background-music");

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/settings");
  const data = await response.json();
  audio.muted = !data.backgroundMusic;
  audio.volume = data.gameValue;
});
