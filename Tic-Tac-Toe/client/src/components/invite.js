const form = document.getElementsByClassName("modal-content")[0];
const userId = document.getElementById("userID").value
let socket = io()

socket.emit("register", userId);


function addInviteNotification(data) {
  const notificationList = document.getElementById("notification-list");

  const li = document.createElement("li");
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


function showToast(message, type = "success") {
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

    if (!inviteResponse.ok) {
      showToast("User Invited", "error");
      return;
    }
    
    const inviteResult = await inviteResponse.json();
    socket.emit("invite", {
      toUserId: selecteduser._id,
      message: "You have been invited!"
    });
    
    showToast(inviteResult);
  } catch (err) {
    showToast(err.message, "error");
  }
  form.reset();
});


socket.on("invite", (data) => {
  addInviteNotification(data);
});