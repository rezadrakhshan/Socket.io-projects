const button = document.querySelector(".start-btn")
const loader = document.querySelector(".loader-screen")
const bgOverlay = document.querySelector(".background-overlay")
const container = document.querySelector(".container")

i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init(
    {
      fallbackLng: "en",
      backend: {
        loadPath: "/locales/{{lng}}/translation.json",
      },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator"],
        caches: ["localStorage", "cookie"],
      },
    },
    function (err, t) {
      if (err) return console.error(err);
      startTypingTips();
    }
  );

function startTypingTips() {
  const keys = Array.from({ length: 8 }, (_, i) => `tips.tips${i + 1}`);
  const tipText = document.querySelector(".tip-text");
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
    const message = i18next.t(keys[index]);
    typeText(message, tipText);
    index = (index + 1) % keys.length;
  }
  
  updateMessage();
  setInterval(updateMessage, 4000);
}

setTimeout(() => {
  button.classList.add("show");
}, 3000);


button.addEventListener("click",(e)=>{
    loader.remove()
    bgOverlay.remove()
    container.classList.remove("display-none")
    document.querySelector("body").style.backgroundImage = "url('/public/image/bg.gif')";
})

