const messages = [
  "Challenge your mind with a classic game of Tic-Tac-Toe.",
  "Think ahead, block your opponent, and claim victory!",
  "Every move counts — plan wisely!",
  "Three in a row, and the glory is yours!",
  "Right-click anywhere on the screen to unlock more options and customize your experience!",
  "Tic-Tac-Toe: Simple rules, infinite possibilities.",
  "Ready to outsmart your rival? Let's go!",
  "A timeless game, now with a modern twist.",
];
const tipText = document.querySelector(".tip-text");
const button = document.querySelector(".start-btn")
const loader = document.querySelector(".loader-screen")
const bgOverlay = document.querySelector(".background-overlay")
const container = document.querySelector(".container")


let index = 0;

function typeText(text, element, speed = 30) {
  element.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i === text.length) clearInterval(interval);
  }, speed);
}

function updateMessage() {
  typeText(messages[index], tipText);
  index = (index + 1) % messages.length;
}

updateMessage();

setInterval(updateMessage, 4000);

setTimeout(() => {
  button.classList.add("show");
}, 3000);


button.addEventListener("click",(e)=>{
    loader.remove()
    bgOverlay.remove()
    container.classList.remove("display-none")
    document.querySelector("body").style.backgroundImage = "url('/public/image/bg.gif')";
})
