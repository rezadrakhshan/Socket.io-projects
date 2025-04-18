import { botLoadingScreen } from "./index.js";

const form = document.getElementsByClassName("modal-content")[0];
const userId = document.getElementById("userID").value;
const notificationList = document.querySelector("#notification-list");
const friendList = document.getElementById("friend-list");
const gameInviteBtn = document.querySelector(".play-btn");
export let socket = io();
export let id;

socket.emit("register", userId);
socket.on("connect", () => {
  id = socket.id;
});

function addInviteNotification(data) {
  const li = document.createElement("li");
  li.setAttribute("data", data[2]);
  li.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span><strong>${data[1].username}</strong> sent you an invite</span>
    </div>
    <div style="margin-top: 0.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button class="notif-btn accept" data-id="">Accept</button>
      <button class="notif-btn reject" data-id="">Reject</button>
    </div> 
  `;

  notificationList.appendChild(li);
}
function addRequestNotification(data) {
  const li = document.createElement("li");
  li.setAttribute("data", data._id);
  li.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span><strong>${data.username}</strong> sent you a game request</span>
    </div>
    <div style="margin-top: 0.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button class="notif-btn accept game" data-id="">Play</button>
      <button class="notif-btn reject game" data-id="">Reject</button>
    </div> 
  `;

  notificationList.appendChild(li);
}

function addNotif(data) {
  const li = document.createElement("li");
  li.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: center;">
      <span>${data[0]}</span>
    </div>`;
  notificationList.appendChild(li);
}

function ShowNewFriend(data) {
  const li = document.createElement("li");
  li.setAttribute("data", data._id);
  li.innerHTML = `
            <div>
              <img src=${data.profile}>
            <span>${data.username}</span>
            </div>
            <button class="notif-btn reject" data-id="">Remove</button>`;
  friendList.appendChild(li);
}

export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  document.getElementById("toast-container").appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const result = await response.json();
    const selecteduser = result.data.find(
      (element) => element.username == e.target.username.value
    );

    if (!selecteduser) {
      showToast("User  not found", "error");
      return;
    }

    const inviteResponse = await fetch(`/api/invite/${selecteduser._id}`, {
      method: "POST",
    });

    const inviteResult = await inviteResponse.json();

    if (!inviteResponse.ok) {
      showToast(String(inviteResult), "error");
      return;
    }

    socket.emit("invite", {
      toUserId: selecteduser._id,
      inviteId: inviteResult._id,
      message: "You have been invited!",
    });

    showToast("Invite Sent");
  } catch (err) {
    showToast(err.message, "error");
  }
  form.reset();
});

socket.on("invite", (data) => {
  addInviteNotification(data);
});

notificationList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("reject")) {
    if (!e.target.classList.contains("reject")) {
      const inviteId =
        e.target.parentElement.parentElement.getAttribute("data");
      const rejectResponse = await fetch(`/api/reject-invite/${inviteId}`, {
        method: "DELETE",
      });
      if (!rejectResponse.ok) {
        showToast("Server Error", "error");
        return;
      }
      const result = await rejectResponse.json();
      showToast("Invite Rejected");
      socket.emit("reject invite", {
        userId: result.sender,
        message: `${result.receiver.username} rejected your invite`,
      });
    }
    e.target.parentElement.parentElement.remove();
  }
  if (
    e.target.classList.contains("accept") &&
    !e.target.classList.contains("game")
  ) {
    const inviteId = e.target.parentElement.parentElement.getAttribute("data");
    const acceptResponse = await fetch(`/api/accept-invite/${inviteId}`, {
      method: "DELETE",
    });
    if (!acceptResponse.ok) {
      showToast("Server Error", "error");
      return;
    }
    const acceptResult = await acceptResponse.json();
    e.target.parentElement.parentElement.remove();
    socket.emit("accept invite", {
      userId: acceptResult.sender._id,
      message: `${acceptResult.receiver.username} accepted your invite`,
    });
    showToast("Invite Accepted");
    ShowNewFriend(acceptResult.sender);
  }
});

socket.on("notif", (data) => {
  addNotif(data);
  ShowNewFriend(data[1]);
});

if (gameInviteBtn) {
  gameInviteBtn.addEventListener("click", (e) => {
    botLoadingScreen.classList.remove("bot-hidden");
    document.querySelector(
      ".logo-container"
    ).innerHTML += `<p>waiting for Opponent</p><button class="cancel-btn">Cancel</button>`;
    socket.emit("play request", {
      userId: e.target.parentElement.parentElement.getAttribute("data"),
    });
  });
}

function playGame() {
  const acceptBtn = document.querySelectorAll(".accept.game");
  acceptBtn.forEach((e) => {
    e.addEventListener("click", (e) => {
      socket.emit("request accept", {
        userID: e.target.parentElement.parentElement.getAttribute("data"),
      });
    });
  });
}

socket.on("play request", (data) => {
  addRequestNotification(data[0]);
  showToast("You have new game request");
  playGame();
});
