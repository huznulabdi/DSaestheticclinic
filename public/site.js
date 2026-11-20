// Animasi scroll reveal & bayangan navbar (sama seperti versi asli)
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var nav = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    nav.style.boxShadow = window.scrollY > 30 ? '0 4px 28px rgba(0,0,0,.06)' : 'none';
  }, { passive: true });
})();
