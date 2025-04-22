import { socket, id } from "../service/room.js";

const joinRoomBtn = document.querySelector("#joinRoom");
const createRoomBtn = document.querySelector("#createRoom");
export const mainContainer = document.querySelector("#mainContainer");
const closeModalBtn = document.querySelector(".close-modal");
export const waitingRoom = document.querySelector("#waitingRoom");
const waitingUsersList = document.querySelector("#waitingUsersList");
const waitingReadyBtn = document.querySelector("#waitingReadyBtn");
const countryModal = document.querySelector("#countryModal");
const countriesGrid = document.querySelector("#countriesGrid");

const countries = [
  { code: "ir", name: "Iran" },
  { code: "us", name: "America" },
  { code: "gb", name: "England" },
  { code: "de", name: "German" },
  { code: "fr", name: "France" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "ru", name: "Russia" },
  { code: "cn", name: "China" },
  { code: "jp", name: "Japan" },
];

document.querySelectorAll(".close-modal").forEach((btn) => {
  btn.addEventListener("click", () => {
    countryModal.style.display = "none";
  });
});

window.addEventListener("click", (event) => {
  if (event.target === countryModal) {
    countryModal.style.display = "none";
  }
});

export function renderCountries(users) {
  countriesGrid.innerHTML = "";
  countries.forEach((country) => {
    const countryElement = document.createElement("div");
    countryElement.className = `country-item ${
      users.some((user) => user.flag == country.code) ? "selected" : ""
    }`;
    countryElement.dataset.code = country.code;

    const flagElement = document.createElement("img");
    flagElement.className = "country-flag";
    flagElement.src = `/public/image/flags/${country.code}.png`;
    flagElement.alt = country.name;

    const nameElement = document.createElement("span");
    nameElement.className = "country-name";
    nameElement.textContent = country.name;

    countryElement.appendChild(flagElement);
    countryElement.appendChild(nameElement);

    countriesGrid.appendChild(countryElement);

    countryElement.addEventListener("click", () => {
      if (!countryElement.classList.contains("selected")) {
        console.log(1);
        const flagCode = countryElement.getAttribute("data-code");
        const roomID = document.querySelector("#waitingRoomId").innerText;
        socket.emit("choose flag", { id: id, code: flagCode, room: roomID });
      }
    });
  });
}

joinRoomBtn.addEventListener("click", () => {
  joinRoomModal.style.display = "block";
  document.querySelector(".input-group").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = e.target.roomId.value;
    socket.emit("join room", value);
    joinRoomModal.style.display = "none";
  });
});

closeModalBtn.addEventListener("click", () => {
  joinRoomModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === joinRoomModal) {
    joinRoomModal.style.display = "none";
  }
});

createRoomBtn.addEventListener("click", () => {
  waitingRoom.style.display = "flex";
  mainContainer.remove();
  socket.emit("create room", id);
});

waitingReadyBtn.addEventListener("click", () => {
  waitingReadyBtn.classList.toggle("ready");
});

export function updateWaitingUsersList(users) {
  waitingUsersList.innerHTML = "";
  users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.className = "waiting-user-item";

    const flagElement = document.createElement("img");
    flagElement.className = "waiting-user-flag";
    flagElement.src = `/public/image/flags/${user.flag}.png`;
    flagElement.alt = user.flag;

    const nameElement = document.createElement("span");
    nameElement.className = "waiting-user-name";
    nameElement.textContent = user.id;

    userElement.appendChild(flagElement);
    userElement.appendChild(nameElement);
    if (!user.isOwner) {
      const statusElement = document.createElement("div");
      statusElement.className = `waiting-user-status ${
        user.isReady ? "ready" : ""
      }`;
      userElement.appendChild(statusElement);
    }

    waitingUsersList.appendChild(userElement);
  });
}
