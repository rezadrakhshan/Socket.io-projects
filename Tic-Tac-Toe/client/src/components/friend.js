document.addEventListener("DOMContentLoaded", () => {
  const toggleFriendBtn = document.getElementById("toggle-friend");
  const sidebar = document.getElementById("friend-sidebar");
  const closeSidebar = document.getElementById("close-sidebar");
  const overlay = document.getElementById("overlay");

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
