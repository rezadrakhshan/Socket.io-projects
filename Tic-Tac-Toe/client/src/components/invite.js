const form = document.getElementsByClassName("modal-content")[0];

function showToast(message, type = "success") {
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
  form.reset()
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const result = await response.json();
    const selecteduser = result.data.find(
      (element) => element.username === e.target.username.value
    );

    if (!selecteduser) {
      showToast("User  not found", "error");
      return;
    }

    const inviteResponse = await fetch(`/api/invite/${selecteduser._id}`, {
      method: "POST",
    });

    if (!inviteResponse.ok) {
      showToast("User Invited", "error");
      return;
    }

    const inviteResult = await inviteResponse.json();
    showToast(inviteResult);
  } catch (err) {
    showToast(err.message, "error");
  }
});
