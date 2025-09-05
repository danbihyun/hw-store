// jQuery와 owl.carousel.js가 먼저 로드돼 있어야 함
$(function () {
  /* ========== 1) Loader ========== */
  $("#loader").show();
  setTimeout(function () {
    $("#loader").fadeOut("slow", function () {
      $("#content").fadeIn("slow");
    });
  }, 1000);

  /* ========== 2) Sticky Header ========== */
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (!header) return;
    if (window.scrollY > 0) header.classList.add("sticky");
    else header.classList.remove("sticky");
  });

  /* ========== 3) Search ========== */
  const myModal = document.getElementById("staticBackdrop");
  if (myModal) {
    myModal.addEventListener("shown.bs.modal", () => {
      const input = document.getElementById("searchInput");
      if (input) input.focus();
    });
  }
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  function goSearch(q) {
    if (q) window.location.href = `search.html?query=${encodeURIComponent(q)}`;
  }
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        goSearch(this.value);
      }
    });
  }
  if (searchButton) {
    searchButton.addEventListener("click", function (e) {
      e.preventDefault();
      goSearch(searchInput ? searchInput.value : "");
    });
  }

  /* ========== 4) Counter ========== */
  document.querySelectorAll(".count").forEach(function (el) {
    const target = parseInt(el.dataset.number || "0", 10);
    if (isNaN(target) || target <= 0) return;
    let current = 0;
    const step = Math.max(1, Math.round(target / 60)); // ~1초
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 16);
  });

  /* ========== 5) Footer Subscribe ========== */
  const form1 = document.getElementById("subscribeForm");
  if (form1) {
    form1.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email");
      const thanks = document.getElementById("thanksMessage");
      if (email && email.value) {
        if (thanks) thanks.style.display = "block";
        email.value = "";
      } else {
        if (thanks) thanks.style.display = "none";
      }
    });
  }
  const form2 = document.getElementById("subscribeFormAccordion");
  if (form2) {
    form2.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email-accordion");
      const thanks = document.getElementById("thanksMessage-accordion");
      if (email && email.value) {
        if (thanks) thanks.style.display = "block";
        email.value = "";
      } else {
        if (thanks) thanks.style.display = "none";
      }
    });
  }

  /* ========== 6) Owl Carousel ========== */
  const $owl = $(".owl-carousel-hero").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    dots: true,
    nav: false,
    smartSpeed: 600,
  });

  // (D) 커스텀 버튼 + 일시정지/재개
  const prevBtn = document.querySelector(".banner-prev");
  const nextBtn = document.querySelector(".banner-next");
  function pauseThenResume() {
    $owl.trigger("stop.owl.autoplay");
    clearTimeout(window.__owlResume);
    window.__owlResume = setTimeout(() => {
      $owl.trigger("play.owl.autoplay", [4000]);
    }, 5000);
  }
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      $owl.trigger("prev.owl.carousel");
      pauseThenResume();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      $owl.trigger("next.owl.carousel");
      pauseThenResume();
    });

  // (E) 키보드 제어
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      $owl.trigger("prev.owl.carousel");
      pauseThenResume();
    }
    if (e.key === "ArrowRight") {
      $owl.trigger("next.owl.carousel");
      pauseThenResume();
    }
  });

  /* ========== 7) WOW: 고정 오버레이엔 미적용 ========== */
  document
    .querySelector(".banner-overlay")
    ?.classList.remove("wow", "animate__animated");
  document
    .querySelector(".banner-controls")
    ?.classList.remove("wow", "animate__animated");
  if (typeof WOW !== "undefined") {
    new WOW({
      boxClass: "wow",
      animateClass: "animate__animated",
      offset: 0,
      mobile: true,
      live: true,
    }).init();
  }
});
