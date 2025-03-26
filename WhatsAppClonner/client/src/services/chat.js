let socket = io();
const form = document.querySelector(".text-form");
const input = document.querySelector(".text-input");
const chatMessage = document.querySelector(".chat-messages");


function getTime() {
  const time = new Date();
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hours}:${minutes} ${ampm}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    const data = {
      msg: input.value,
      time: getTime()
    };
    socket.emit("chat message", data);
    input.value = "";
  }
});
socket.on("chat message", (data) => {
  const newMessage = document.createElement("div");
  newMessage.classList.add("chat-message", "received");
  newMessage.innerHTML = `<div class="message-header">
        <i class="fas fa-user me-1"></i>User 1 • ${data.time}
      </div>
      ${data.msg}`;
  chatMessage.appendChild(newMessage);
});
