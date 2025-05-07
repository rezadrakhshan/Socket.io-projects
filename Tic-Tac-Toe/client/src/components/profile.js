const form = document.querySelector("#ProfileForm");
const avatarInput = document.getElementById("avatarInput");
const preview = document.getElementById("preview");
const passswordForm = document.querySelector("#PasswordForm");

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
    const changePasswordOption = document.createElement("li");
    changePasswordOption.innerText = "Change Password";
    const sidebarList = document.querySelector(".sidebar ul");
    const allOptions = sidebarList.querySelectorAll("li");
    const editProfileItem = allOptions[0];
    sidebarList.insertBefore(changePasswordOption, editProfileItem.nextSibling);
    bindSidebarEvents();
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

passswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    currentPassword: e.target.currentPassword.value,
    newPassword: e.target.newPassword.value,
    confirmPassword: e.target.confirmPassword.value,
  };
  if (data.newPassword != data.confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }
  const response = await fetch("/api/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (response.ok) {
    showToast("Password updated successfully");
    e.target.reset();
  } else {
    showToast(result.message || "Error updating password", "error");
    return;
  }
});

function bindSidebarEvents() {
  const sidebarOption = document.querySelectorAll("li");
  sidebarOption.forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active");
      item.classList.add("active");
      switch (item.innerText) {
        case "Edit Profile":
          ShowEditProfileSection();
          break;
        case "Change Password":
          ShowChangePasswordSection();
          break;
        case "Link Google Account":
          break;
        case "Switch Acount":
          break;
        default:
          break;
      }
    });
  });
}

function ShowEditProfileSection() {
  const card = document.querySelector(".card");
  if (!card.classList.contains("active-box")) {
    const activeBox = document.querySelector(".active-box");
    activeBox.style.display = "none";
    activeBox.classList.remove("active-box");
    card.classList.add("active-box");
    card.style.display = "block";
  }
}

function ShowChangePasswordSection() {
  const box = document.querySelector(".show-password");
  if (!box.classList.contains("active-box")) {
    const activeBox = document.querySelector(".active-box");
    activeBox.style.display = "none";
    activeBox.classList.remove("active-box");
    box.classList.add("active-box");
    box.style.display = "block";
  }
}

bindSidebarEvents();
