const roomID = window.location.pathname.split("/").pop();
const videoContainer = document.querySelector(".video-container");
const muteBtn = document.getElementById("muteBtn");
const cameraBtn = document.getElementById("cameraBtn");
const leaveBtn = document.getElementById("leaveBtn");

let stream;

export const socket = io("/");

const peer = new Peer(undefined, {
  host: "/",
  port: 3001,
  path: "/peerjs",
});


peer.on("open", (id) => {
  socket.emit("new user", { roomID: roomID, userID: id });
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((localStream) => {
    stream = localStream;

    const myVideo = document.createElement("video");
    myVideo.muted = true;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user connected", (users) => {
      users
        .filter((id) => id !== peer.id)
        .forEach((userId) => {
          connectToNewUser(userId, stream);
        });
    });

    socket.on("user disconnected", (users) => {
      clearVideoContainer();

      users
        .filter((id) => id !== peer.id)
        .forEach((userId) => {
          connectToNewUser(userId, stream);
        });
      addVideoStream(myVideo, stream);
    });
  })
  .catch((err) => {
    alert("Camera/Microphone access denied");
    console.error(err);
  });

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoContainer.appendChild(video);
}

function clearVideoContainer() {
  videoContainer.innerHTML = "";
}

muteBtn.onclick = () => {
  const audioTracks = stream?.getAudioTracks();
  if (audioTracks?.length > 0) {
    audioTracks[0].enabled = !audioTracks[0].enabled;
    muteBtn.textContent = audioTracks[0].enabled ? "Mute" : "Unmute";
  }
};

cameraBtn.onclick = () => {
  const videoTracks = stream?.getVideoTracks();
  if (videoTracks?.length > 0) {
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
