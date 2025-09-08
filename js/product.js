// 썸네일 / 슬라이드
(function () {
  const thumbs = document.querySelectorAll(".thumbs img");
  const mainImg = document.getElementById("mainImage");
  const prevBtn = document.querySelector(".preview .prev");
  const nextBtn = document.querySelector(".preview .next");
  let idx = 0;

  function setActive(i, dir) {
    // dir: 'left' | 'right' | undefined
    if (!thumbs.length) return;
    idx = (i + thumbs.length) % thumbs.length;

    // 활성 썸네일 표시
    thumbs.forEach((t) => t.classList.remove("active"));
    thumbs[idx].classList.add("active");

    // 애니메이션 방향 클래스 부여
    const cls =
      dir === "left"
        ? "slide-in-left"
        : dir === "right"
        ? "slide-in-right"
        : "slide-in-right"; // 기본은 오른쪽에서 들어오는 느낌
    mainImg.classList.remove("slide-in-left", "slide-in-right"); // 초기화 트릭
    // reflow 강제해서 애니메이션 재적용
    void mainImg.offsetWidth;

    // src 교체 후 애니메이션
    mainImg.src = thumbs[idx].dataset.target;
    mainImg.classList.add(cls);
  }

  // 초기 바인딩
  thumbs.forEach((t, i) =>
    t.addEventListener("click", () => setActive(i, i > idx ? "right" : "left"))
  );

  prevBtn?.addEventListener("click", () => setActive(idx - 1, "left"));
  nextBtn?.addEventListener("click", () => setActive(idx + 1, "right"));

  // 첫 로드
  setActive(0, "right");
})();

document.addEventListener("DOMContentLoaded", () => {
  const qtyInput = document.getElementById("qty");
  const payTotal = document.getElementById("payTotal");
  const unitPrice = 400; // 상품 단가 (원하는 가격으로 수정)

  // 총액 업데이트 함수
  function updateTotal() {
    let qty = parseInt(qtyInput.value) || 1;
    if (qty < 1) qty = 1;
    qtyInput.value = qty;

    const total = qty * unitPrice;
    payTotal.textContent = total.toLocaleString("ko-KR"); // 천단위 콤마
  }

  // - 버튼
  document.querySelector(".qty-box .minus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
    updateTotal();
  });

  // + 버튼
  document.querySelector(".qty-box .plus").addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
    updateTotal();
  });

  // input 직접 수정할 때도 반영
  qtyInput.addEventListener("input", updateTotal);

  // 초기 계산
  updateTotal();
});
