/*********************************************************
 * HW-STORE 임시 로그인/회원가입 (프론트 전용 · 로컬스토리지)
 * - 데모 계정: demo@demo.com / 1234
 * - SOCIAL_MODE:
 *    - "redirect": 실제 네이버/구글 로그인 화면으로 이동만 함
 *    - "mock": 백엔드 없이 즉시 소셜 로그인 성공 처리
 *********************************************************/
const SOCIAL_MODE = "redirect"; // "redirect" | "mock"

// 기본 데모 유저 주입 (없으면 생성)
(function seedDemoUser() {
  const users = getUsers();
  if (!users.find((u) => u.email === "demo@demo.com")) {
    users.push({ email: "demo@demo.com", password: "1234", name: "데모유저" });
    setUsers(users);
  }
})();

// ===== 로컬 "DB" 유틸 =====
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("hw_users") || "[]");
  } catch {
    return [];
  }
}
function setUsers(arr) {
  localStorage.setItem("hw_users", JSON.stringify(arr));
}
function setSession(user) {
  // 실제 서비스라면 JWT 등을 쓰지만, 데모는 로컬스토리지에 세션 저장
  localStorage.setItem("hw_token", "demo-token-" + Date.now());
  localStorage.setItem(
    "hw_user",
    JSON.stringify({ email: user.email, name: user.name || "" })
  );
}
function clearSession() {
  localStorage.removeItem("hw_token");
  localStorage.removeItem("hw_user");
}

// ===== UI 헬퍼 =====
function toast(msg, type = "info") {
  // 아주 간단한 토스트
  let box = document.getElementById("toast");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast";
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.padding = "10px 14px";
    box.style.borderRadius = "8px";
    box.style.background = "#111";
    box.style.color = "#fff";
    box.style.fontSize = "14px";
    box.style.boxShadow = "0 10px 20px rgba(0,0,0,.15)";
    box.style.zIndex = "9999";
    document.body.appendChild(box);
  }
  box.textContent = msg;
  box.style.background =
    type === "error" ? "#e11d48" : type === "success" ? "#0ea5e9" : "#111";
  box.style.display = "block";
  setTimeout(() => (box.style.display = "none"), 1600);
}

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

// ===== 로그인 제출 =====
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    toast("이메일 또는 비밀번호가 올바르지 않습니다.", "error");
    return;
  }
  setSession(user);
  if (document.getElementById("remember")?.checked) {
    localStorage.setItem("hw_remember", "1");
  } else {
    localStorage.removeItem("hw_remember");
  }
  toast("로그인 성공!", "success");
  setTimeout(() => (location.href = "index.html"), 700);
});

// ===== 회원가입 (링크 클릭 시 모드 전환 + 동일 폼에서 처리) =====
const signupLink = document.querySelector(".hint .link");
let isSignupMode = false;

signupLink?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleSignupMode(true);
});

function toggleSignupMode(on) {
  isSignupMode = on;
  const title = document.querySelector(".title");
  const hint = document.querySelector(".hint");
  const form = document.getElementById("loginForm");

  if (on) {
    title.textContent = "회원가입";
    hint.innerHTML = `이미 계정이 있다면 <a href="#" class="link" id="toLogin">로그인</a>`;
    // 이름 필드 추가
    if (!document.getElementById("name-field")) {
      const nameField = document.createElement("div");
      nameField.className = "form-field";
      nameField.id = "name-field";
      nameField.innerHTML = `
        <label for="name">이름 (선택)</label>
        <div class="input">
          <i class="fa-regular fa-user"></i>
          <input type="text" id="name" name="name" placeholder="홍길동"/>
        </div>
      `;
      form.insertBefore(nameField, form.firstElementChild);
    }
    // 제출 핸들러 교체
    form.removeEventListener("submit", handleLoginSubmit);
    form.addEventListener("submit", handleSignupSubmit);
    document.getElementById("toLogin").addEventListener("click", (e) => {
      e.preventDefault();
      toggleSignupMode(false);
    });
  } else {
    title.textContent = "로그인";
    hint.innerHTML = `아직 회원이 아니라면 <a href="#" class="link">회원가입</a>`;
    document.getElementById("name-field")?.remove();
    form.removeEventListener("submit", handleSignupSubmit);
    form.addEventListener("submit", handleLoginSubmit);
    // 다시 링크 바인딩
    document.querySelector(".hint .link")?.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSignupMode(true);
    });
  }
}

// 로그인 핸들러(재바인딩용)
function handleLoginSubmit(e) {
  e.preventDefault();
  const event = new Event("submit", { cancelable: true, bubbles: true });
  document.getElementById("loginForm").dispatchEvent(event); // 위 기본 submit 로직 재사용
}

// 회원가입 제출
function handleSignupSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const name = document.getElementById("name")?.value.trim();

  if (!email || !password) {
    toast("이메일/비밀번호를 입력해줘!", "error");
    return;
  }
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    toast("이미 존재하는 이메일이야.", "error");
    return;
  }
  users.push({ email, password, name });
  setUsers(users);
  toast("회원가입 성공! 자동 로그인할게.", "success");
  setSession({ email, name });
  setTimeout(() => (location.href = "index.html"), 700);
}

// ===== 소셜 로그인 버튼 =====
document.querySelector(".btn-google")?.addEventListener("click", () => {
  if (SOCIAL_MODE === "redirect") {
    // 실제 구글 로그인 페이지(연동은 안 됨)
    window.open("https://accounts.google.com/signin", "_blank");
    toast("구글 로그인 페이지가 열렸어 (데모).", "info");
  } else {
    // 백엔드 없이 즉시 성공 처리
    setSession({ email: "google_user@demo", name: "Google User" });
    toast("구글(데모) 로그인 성공!", "success");
    setTimeout(() => (location.href = "index.html"), 700);
  }
});

document.querySelector(".btn-naver")?.addEventListener("click", () => {
  if (SOCIAL_MODE === "redirect") {
    // 실제 네이버 로그인 페이지(연동은 안 됨)
    window.open("https://nid.naver.com/nidlogin.login", "_blank");
    toast("네이버 로그인 페이지가 열렸어 (데모).", "info");
  } else {
    setSession({ email: "naver_user@demo", name: "Naver User" });
    toast("네이버(데모) 로그인 성공!", "success");
    setTimeout(() => (location.href = "index.html"), 700);
  }
});

// ===== 데모 계정 자동 입력 =====
window.addEventListener("DOMContentLoaded", () => {
  const emailEl = document.getElementById("email");
  const pwEl = document.getElementById("password");
  if (emailEl && pwEl) {
    emailEl.value = "demo@demo.com";
    pwEl.value = "1234";
  }
});
