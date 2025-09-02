$(document).ready(function () {

    // loader js 

    $('#loader').show();

    setTimeout(function () {
        $('#loader').fadeOut('slow', function () {
            $('#content').fadeIn('slow');
        });
    }, 1000);

    // header

    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // search

    const myModal = document.getElementById('staticBackdrop');
    myModal.addEventListener('shown.bs.modal', () => {
        document.getElementById('searchInput').focus();
    });

    document.getElementById('searchInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            const query = this.value;
            window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        }
    });

    document.getElementById('searchButton').addEventListener('click', function (event) {
        event.preventDefault();
        const query = document.getElementById('searchInput').value;
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    });

    // counter

    let count = document.querySelectorAll(".count")
    let arr = Array.from(count)

    arr.map(function (item) {
        let startnumber = 0

        function counterup() {
            startnumber++
            item.innerHTML = startnumber

            if (startnumber == item.dataset.number) {
                clearInterval(stop)
            }
        }

        let stop = setInterval(function () {
            counterup()
        },)

    })

    // footer

    document.getElementById('subscribeForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var emailInput = document.getElementById('email').value;
        var thanksMessage = document.getElementById('thanksMessage');

        if (emailInput) {
            thanksMessage.style.display = 'block';
            document.getElementById('email').value = '';
        } else {
            thanksMessage.style.display = 'none';
        }
    });

    document.getElementById('subscribeFormAccordion').addEventListener('submit', function (event) {
        event.preventDefault();

        var emailInput = document.getElementById('email-accordion').value;
        var thanksMessage = document.getElementById('thanksMessage-accordion');

        if (emailInput) {
            thanksMessage.style.display = 'block';
            document.getElementById('email-accordion').value = '';
        } else {
            thanksMessage.style.display = 'none';
        }
    });

    // animation

   new WOW({
    boxClass: 'wow',            // wow 클래스 지정
    animateClass: 'animate__animated',  // Animate.css v4 이상이면 animate__animated 사용
    offset: 0,                   // 애니메이션 발동 위치
    mobile: true,                // 모바일에서도 실행
    live: true
}).init();

});