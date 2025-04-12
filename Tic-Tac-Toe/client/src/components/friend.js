import { showToast, socket } from "./invite.js";

const sidebar = document.getElementById("friend-sidebar");
const toggleFriendBtn = document.getElementById("toggle-friend");
const closeSidebar = document.getElementById("close-sidebar");
const overlay = document.getElementById("overlay");

document.addEventListener("DOMContentLoaded", () => {
  const openSidebar = () => {
    sidebar.classList.add("show");
    overlay.classList.add("show");
  };

  const closeSidebarFunc = () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  };

  toggleFriendBtn.addEventListener("click", openSidebar);
  closeSidebar.addEventListener("click", closeSidebarFunc);
  overlay.addEventListener("click", closeSidebarFunc);

  window.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !toggleFriendBtn.contains(e.target)) {
      closeSidebarFunc();
    }
  });
});

sidebar.addEventListener("click", async (e) => {
  if (e.target.classList.contains("reject")) {
    const friendId = e.target.parentElement.getAttribute("data");
    await socket.emit("remove friend", {
      friendID: friendId,
    });
    e.target.parentElement.remove();
    showToast("Friend was remove");
  }
});

socket.on("delete friend", (data) => {
  const friendElement = document.querySelector(
    `#friend-list li[data="${data[0]}"]`
  );
  if (friendElement) {
    friendElement.remove();
  }
});
