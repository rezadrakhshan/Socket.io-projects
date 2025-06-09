const login = document.querySelector("#login-form");
const register = document.querySelector("#register-form");
const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");

loginBtn.addEventListener("click", () => {
  showForm("login");
});
registerBtn.addEventListener("click", () => {
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

login.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    window.location.replace("/");
  } else {
    toastr.error(data.msg);
  }
});

register.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    fullname: e.target.fullname.value,
    email: e.target.email.value,
    password: e.target.password.value,
    confirm: e.target.confirm.value,
  };

  if (data.password.length < 4) {
    return toastr.error("Password must be at least 4 characters long.");
  } else if (data.password != data.confirm) {
    return toastr.error(
      "Passwords do not match. Please make sure both fields are identical."
    );
  }

  const response = await fetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (response.ok) {
    window.location.replace("/");
  } else {
    return toastr.error(result.msg);
  }
});
