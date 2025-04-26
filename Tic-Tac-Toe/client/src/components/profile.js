const form = document.querySelector("#ProfileForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value ? e.target.password.value : "";
  const avatarFile = document.getElementById("avatarInput").files[0];

  const formData = new FormData();
  formData.append("username", username);
  if (password) formData.append("password", password);
  if (avatarFile) formData.append("avatar", avatarFile);

  const response = await fetch("/api/upload-avatar", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  console.log(data);
});
