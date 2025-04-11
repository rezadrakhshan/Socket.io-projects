const form = document.getElementsByClassName("modal-content")[0];
const userId = document.getElementById("userID").value;
const notificationList = document.querySelector("#notification-list");
let socket = io();

socket.emit("register", userId);

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

function addNotif(data) {
  const li = document.createElement("li");
  li.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: center;">
      <span>${data[0]}</span>
    </div>`;
  notificationList.appendChild(li);
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
    const inviteId = e.target.parentElement.parentElement.getAttribute("data");
    const rejectResponse = await fetch(`/api/reject-invite/${inviteId}`, {
      method: "DELETE",
    });
    if (!rejectResponse.ok) {
      showToast("Server Error", "error");
      return;
    }
    const result = await rejectResponse.json();
    showToast("Invite Rejected");
    e.target.parentElement.parentElement.remove();
    socket.emit("reject invite", {
      userId: result.sender,
      message: `${result.receiver.username} rejected your invite`,
    });
  }
  if (e.target.classList.contains("accept")) {
    const inviteId = e.target.parentElement.parentElement.getAttribute("data");
    const acceptResponse = await fetch(`/api/accept-invite/${inviteId}`, {
      method: "DELETE",
    });
    if (!acceptResponse.ok) {
      showToast("Server Error", "error");
      return;
    }
    const acceptResult = await acceptResponse.json();
    console.log(acceptResult.receiver.username)
    showToast("Invite Accepted");
    e.target.parentElement.parentElement.remove()
    socket.emit("accept invite", {
      userId: acceptResult.sender,
      message: `${acceptResult.receiver.username} accepted your invite`,
    });
  }
});

socket.on("notif", (data) => {
  addNotif(data);
});
