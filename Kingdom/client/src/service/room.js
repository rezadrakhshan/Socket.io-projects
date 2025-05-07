import {
  updateWaitingUsersList,
  renderCountries,
  mainContainer,
  waitingRoom,
  renderRoomInfo,
  renderPublicMessage,
  submitPublicForm,
  renderPrivateChat,
  renderPrivateMessage,
  renderTimer,
} from "../components/index.js";

const roomID = document.querySelector("#waitingRoomId");
const selectCountryBtn = document.querySelector("#selectCountry");
const title = document.querySelector("#title");
const roomContainer = document.querySelector("#roomContainer");

export let socket = io();
export let id;
export let users;

selectCountryBtn.addEventListener("click", () => {
  countryModal.style.display = "block";
  renderCountries(users);
});

socket.on("connect", () => {
  id = socket.id;
  socket.emit("register", id);
});

socket.on("create room", (data) => {
  roomID.innerText = data.roomID;
  users = data.users;
  updateWaitingUsersList(users);
});

socket.on("update users", (updatedUsers) => {
  users = updatedUsers;
  document.querySelectorAll(".country-item").forEach((item) => {
    item.classList.remove("selected");
  });

  users.forEach((user) => {
    if (user.flag) {
      const selectedCountryElement = document.querySelector(
        `.country-item[data-code="${user.flag}"]`
      );
      if (selectedCountryElement) {
        selectedCountryElement.classList.add("selected");
      }
    }
  });

  updateWaitingUsersList(users);
});

socket.on("new user", (data) => {
  users = data;
  const me = users.find((user) => user.id == id);
  updateWaitingUsersList(users);
  if (users.length >= 3 && me.flag != "") {
    document.querySelector("#waitingReadyBtn").style.display = "block";
  }
});

socket.on("room find", (data) => {
  roomID.innerText = data.roomID;
  waitingRoom.style.display = "flex";
  mainContainer.remove();
});

socket.on("ready", (data) => {
  users = data.users;
  if (data.starting) {
    if (window.gameTimer) {
      clearInterval(window.gameTimer);
    }

    let timer = 5;
    window.gameTimer = setInterval(() => {
      if (timer > 0) {
        title.innerText = `Game starting in ${timer}`;
        timer--;
      } else {
        clearInterval(window.gameTimer);
        window.gameTimer = null;
        socket.emit("game start", parseInt(roomID.innerText));
      }
    }, 1000);
  } else {
    if (window.gameTimer) {
      clearInterval(window.gameTimer);
      window.gameTimer = null;
    }
    title.innerText = "Waiting Room";
  }
  updateWaitingUsersList(users);
});

socket.on("game start", (data) => {
  waitingRoom.remove();
  roomContainer.style.display = "grid";
  renderRoomInfo(data.users);
  submitPublicForm();
  renderPrivateChat(data.privateChats);
  renderTimer();
});

socket.on("public message", (data) => {
  renderPublicMessage(data);
});

socket.on("private message", (data) => {
  renderPrivateMessage(data);
});

socket.on("vote result", (newUsers) => {
  users = newUsers;
});

socket.on("lose", () => {
  Swal.fire({
    title: "You Lose 😔",
    icon: "error",
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: "Ok",
    customClass: {
      popup: "my-popup-class",
      title: "my-title-class",
      confirmButton: "my-confirm-button-class",
      cancelButton: "my-cancel-button-class",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
});

socket.on("win", () => {
  Swal.fire({
    title: "You Win ",
    icon: "success",
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: "Ok",
    customClass: {
      popup: "my-popup-class",
      title: "my-title-class",
      confirmButton: "my-confirm-button-class",
      cancelButton: "my-cancel-button-class",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
});

socket.on("game over", (data) => {
  Swal.fire({
    title: "Game over",
    icon: "info",
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: "Ok",
    customClass: {
      popup: "my-popup-class",
      title: "my-title-class",
      confirmButton: "my-confirm-button-class",
      cancelButton: "my-cancel-button-class",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
});

socket.on("game draw", (data) => {
  Swal.fire({
    title: "Game Draw",
    icon: "info",
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: "Ok",
    customClass: {
      popup: "my-popup-class",
      title: "my-title-class",
      confirmButton: "my-confirm-button-class",
      cancelButton: "my-cancel-button-class",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
});

socket.on("user have contract", () => {
  toastr.error("Target have contract");
});

socket.on("receive contract", (data) => {
  Swal.fire({
    title: "You have a new offer",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; font-size: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <strong>From:</strong>
          <img src="/public/image/flags/${data.detail.sender.flag}.png" alt="From" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; box-shadow: 0 0 4px rgba(0,0,0,0.2);">
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <strong>Amount:</strong>
          <span>${data.detail.amount} $</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <strong>Vote:</strong>
          <img src="/public/image/flags/${data.detail.vote}.png" alt="Vote" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; box-shadow: 0 0 4px rgba(0,0,0,0.2);">
        </div>
      </div>
    `,
    icon: "info",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    confirmButtonText: "Accept",
    cancelButtonText: "Reject",
    customClass: {
      popup: "my-popup-class",
      title: "my-title-class",
      confirmButton: "my-confirm-button-class",
      cancelButton: "my-cancel-button-class",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const vote = users.find((user) => user.flag == data.detail.vote);
      socket.emit("new vote", {
        vote: vote.id,
        room: parseInt(roomID.innerText),
      });
      socket.emit("contract accept", {
        detail: data.detail,
        room: parseInt(roomID.innerText),
      });
      document
        .querySelector(".users-list .chat-overlay")
        .classList.remove("hidden");
    }
  });
});

socket.on("target accept contract", () => {
  toastr.success("Target accept contract");
});

socket.on("contract update users", (data) => {
  users = data;
});

socket.on("user-left", (data) => {
  users = data;
  updateWaitingUsersList(users);
});
