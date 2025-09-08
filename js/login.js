// 비밀번호 숨기기/표시 토글
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".toggle-pass");
  const pass = document.getElementById("password");

  if (toggle && pass) {
    toggle.addEventListener("click", () => {
      const show = pass.type === "password";
      pass.type = show ? "text" : "password";
      toggle.querySelector("i").className = show
        ? "fa-regular fa-eye-slash"
        : "fa-regular fa-eye";
    });
  }
});
