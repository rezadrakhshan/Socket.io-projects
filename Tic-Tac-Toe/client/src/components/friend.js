const friendModal = document.querySelector(".modal-friend");
const friendModalContent = document.querySelector(".modal-content-friend");

const openFriendModal = () => {
  friendModal.classList.remove("hidden");
  friendModalContent.style.animation = "fadeScaleIn 0.4s ease forwards";
};

const closeFriendModal = () => {
  friendModalContent.style.animation = "fadeScaleOut 0.3s ease forwards";
  setTimeout(() => {
    friendModal.classList.add("hidden");
  }, 300);
};

document.getElementById("toggle-friend").addEventListener("click", openFriendModal);

friendModal.addEventListener("click", (e) => {
    if (e.target === friendModal) {
      closeFriendModal();
    }
  });
