const form = document.querySelector("#ProfileForm");
const avatarInput = document.getElementById("avatarInput");
const preview = document.getElementById("preview");
const sidebarOption = document.querySelectorAll("li");

avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  document.getElementById("toast-container").appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.elements.username.value;
  const password = e.target.elements.password?.value || "";
  const avatarFile = document.getElementById("avatarInput").files[0];

  const formData = new FormData();
  formData.append("username", username);
  if (password) {
    document.querySelector("#password").remove();
    formData.append("password", password);
  }
  if (avatarFile) formData.append("avatar", avatarFile);

  const response = await fetch("/api/upload-avatar", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (response.ok) {
    showToast("Profile Updated");
  } else {
    showToast(data.message, "error");
  }
});

sidebarOption.forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    item.classList.add("active");
    document.querySelector(".active-box").style.display = "none";
    switch (item.innerText) {
      case "Edit Profile":
        break;
      case "Change Password":
        break;
      case "Link Google Account":
        break;
      case "Notifications":
        break;
      case "Switch Acount":
        break;
      default:
        break;
    }
  });
});
