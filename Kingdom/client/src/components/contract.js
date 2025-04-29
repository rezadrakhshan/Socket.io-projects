const openModalBtn = document.getElementById("openContractModal");
const closeModalBtn = document.getElementById("closeContractModal");
const contractModal = document.getElementById("contractModal");

openModalBtn.addEventListener("click", () => {
  contractModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  contractModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === contractModal) {
    contractModal.style.display = "none";
  }
});


