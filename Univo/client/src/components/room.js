const roomID = window.location.pathname.split("/").pop();
const videoContainer = document.querySelector(".video-container");
const video = document.getElementById("myVideo");
const muteBtn = document.getElementById("muteBtn");
const cameraBtn = document.getElementById("cameraBtn");
const leaveBtn = document.getElementById("leaveBtn");
let stream;

export const socket = io("/");

socket.on("connect", () => {
  socket.emit("new user", { roomID: roomID, userID: socket.id})
});

export function renderRoomUser(data) {
  videoContainer.innerHTML = "";
  data.forEach((item) => {
    const newUser = document.createElement("video");
    document.querySelector(".video-container").appendChild(newUser);
  });
}

// async function startVideo() {
//   try {
//     stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     video.srcObject = stream;
//   } catch (err) {
//     alert("Could not access camera/microphone");
//     console.error(err);
//   }
// }

muteBtn.onclick = () => {
  const audioTracks = stream.getAudioTracks();
  if (audioTracks.length > 0) {
    audioTracks[0].enabled = !audioTracks[0].enabled;
    muteBtn.textContent = audioTracks[0].enabled ? "Mute" : "Unmute";
  }
};

cameraBtn.onclick = () => {
  const videoTracks = stream.getVideoTracks();
  if (videoTracks.length > 0) {
    videoTracks[0].enabled = !videoTracks[0].enabled;
    cameraBtn.textContent = videoTracks[0].enabled ? "Camera Off" : "Camera On";
  }
};

leaveBtn.onclick = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  window.location.href = "/";
};
