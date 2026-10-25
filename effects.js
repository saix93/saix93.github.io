// Page effects: 3D tilt that follows the mouse ([data-tilt], value = max degrees)
// and reveal-on-scroll for blocks as they enter the screen. Both are off with reduced motion.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Tilt
  if (matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tilt]'), function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 10;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add('tilting');
        el.style.setProperty('--ry', ((x - 0.5) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Reveal on scroll, staggered within each group of siblings
  if (!('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll('.section-title, .featured, .grid > li, .gallery > li, .filters, .section-intro, .more, .banner, .game-head, .tagline, .shots, .feature, .footer');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('in');
      io.unobserve(el);
      // Drop the stagger once revealed so it doesn't delay hover effects.
      setTimeout(function () { el.style.transitionDelay = ''; }, 1000);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  Array.prototype.forEach.call(targets, function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    if (el.matches('.grid > li, .gallery > li, .feature')) el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
    el.classList.add('reveal');
    io.observe(el);
  });
})();
