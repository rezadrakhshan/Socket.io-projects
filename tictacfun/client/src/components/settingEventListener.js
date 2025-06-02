import { audio } from "./audio.js";

const audioVolume = document.querySelector("#volume");
const bgMusic = document.querySelector("#bgMusic");

audioVolume.addEventListener("change", (e) => {
  audio.volume = e.target.value;
});

bgMusic.addEventListener("click", () => { 
  audio.muted = !audio.muted;
});
