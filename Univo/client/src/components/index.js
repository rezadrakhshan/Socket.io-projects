const logout = document.querySelector("#logout");

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

