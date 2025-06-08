const login = document.querySelector("#login");
const register = document.querySelector("#register");

login.addEventListener("click", () => {
  showForm("login");
});
register.addEventListener("click", () => {
  showForm("register");
});

function showForm(type) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabs = document.querySelectorAll(".tab");

  if (type === "login") {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
  } else {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
    tabs[0].classList.remove("active");
    tabs[1].classList.add("active");
  }
}
