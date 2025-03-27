(() => {
  const registerForm = document.querySelector("#register-form");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (e.target.password.value !== e.target.cpassword.value) {
      console.log("invalid password");
      return;
    }
    try {
      const data = await axios.post("/auth/register", {
        email: e.target.email.value,
        username: e.target.username.value,
        password: e.target.password.value,
      });
      window.location.replace(document.location.origin);
    } catch (err) {
      console.error(err);
    }
  });
})();
