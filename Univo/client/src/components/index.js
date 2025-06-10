const logout = document.querySelector("#logout");
const createRoomBtn = document.querySelector("#create-room-btn");

logout.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/auth/logout", {
      method: "POST",
    });
    if (res.ok) {
      window.location.href = "/";
    }
  } catch (err) {
    console.log("Logout error:", err);
  }
});

createRoomBtn.addEventListener("click", async () => {
  const response = await fetch("/create-room", {
    method: "POST",
  });
  const data = await response.json();
  if (response.ok) {
    window.location.replace(`/room/${data._id}`);
  }
});
