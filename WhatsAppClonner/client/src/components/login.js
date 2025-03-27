const form = document.querySelector("#login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = await axios.get("/auth/login")
});
