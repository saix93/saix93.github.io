// Photo gallery: category filters and a lightbox with keyboard and swipe navigation.
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery li'));
  var buttons = document.querySelectorAll('.filters button');
  var box = document.querySelector('.lightbox');
  var img = box.querySelector('img');
  var current = 0;

  Array.prototype.forEach.call(buttons, function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      Array.prototype.forEach.call(buttons, function (o) { o.setAttribute('aria-pressed', o === b); });
      items.forEach(function (li) { li.hidden = f !== 'all' && li.getAttribute('data-cat') !== f; });
    });
  });

  function visible() { return items.filter(function (li) { return !li.hidden; }); }

  function show(li) {
    var a = li.querySelector('a');
    current = visible().indexOf(li);
    img.src = a.href;
    img.alt = a.querySelector('img').alt;
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
