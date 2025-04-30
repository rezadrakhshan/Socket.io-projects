import { users, id, socket } from "../service/room.js";

const openModalBtn = document.getElementById("openContractModal");
const closeModalBtn = document.getElementById("closeContractModal");
const contractModal = document.getElementById("contractModal");
const contractFrom = document.getElementById("contractForm");

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

contractFrom.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    from: e.target.fromFlag.value,
    amount: e.target.contractAmount.value,
    vote: e.target.toFlag.value,
  };
  const my = users.find((user) => user.id == id);
  if (my.amount < data.amount) {
    toastr.error("Insufficient funds.");
  } else {
    const target = users.find((user) => user.flag == data.from);
    socket.emit("new contract", { id: target.id, detail: data });
    toastr.success("Contract Send");
  }
  contractModal.style.display = "none";
});
