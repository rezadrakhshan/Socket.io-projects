document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.querySelector('.chat-messages');
  const observer = new MutationObserver(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
  });
  observer.observe(chatMessages, { childList: true, subtree: true });
});

document.querySelector(".settings-btn").addEventListener("click", (e) => {
  console.log(1)
  document.getElementById("settings-sidebar").classList.toggle("active");
  document.querySelector(".members-btn").classList.toggle("remove-member-btn");
});

document.querySelector(".members-btn").addEventListener("click", (e) => {
  console.log(2)
  document.getElementById("members-sidebar").classList.toggle("active");
});
