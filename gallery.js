// Photo gallery: category filters and a full-size lightbox with keyboard and swipe navigation.
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery li'));
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.filters button'));
  var box = document.querySelector('.photo-box');
  var img = box.querySelector('img');
  var cap = box.querySelector('.lb-cap');
  var count = box.querySelector('.lb-count');
  var current = 0;

  // Filters: fill in the counts, then animate between layouts where View Transitions are supported.
  buttons.forEach(function (b) {
    var f = b.getAttribute('data-filter');
    b.querySelector('.count').textContent = items.filter(function (li) {
      return f === 'all' || li.getAttribute('data-cat') === f;
    }).length;
  });
  items.forEach(function (li, i) { li.style.viewTransitionName = 'photo-' + i; });

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      function apply() {
        buttons.forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
        items.forEach(function (li) { li.hidden = f !== 'all' && li.getAttribute('data-cat') !== f; });
      }
      if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(apply);
      else apply();
    });
  });

  // Lightbox
  function visible() { return items.filter(function (li) { return !li.hidden; }); }

  function show(li) {
    var v = visible();
    current = v.indexOf(li);
    img.classList.remove('swap');
    void img.offsetWidth; // Restart the fade-in animation.
    img.classList.add('swap');
    img.src = li.querySelector('a').href;
    img.alt = li.querySelector('img').alt;
    cap.innerHTML = li.querySelector('.cap').innerHTML;
    count.textContent = (current + 1) + ' / ' + v.length;
  }

  function step(d) {
    var v = visible();
    show(v[(current + d + v.length) % v.length]);
  }

  items.forEach(function (li) {
    li.querySelector('a').addEventListener('click', function (e) {
      if (!box.showModal) return; // Old browsers just open the image.
      e.preventDefault();
      show(li);
      box.showModal();
    });
  });

  box.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
  box.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    startX = null;
  });
})();
