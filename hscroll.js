// Horizontal scrollers ([data-hscroll]): scroll with the mouse wheel and drag with the mouse.
// Scroll snapping is paused while moving and restored afterwards, so the strip settles on an item.
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('[data-hscroll]'), function (el) {
    var snap = getComputedStyle(el).scrollSnapType;
    var settleTimer = null;

    function pauseSnap() {
      clearTimeout(settleTimer);
      el.style.scrollSnapType = 'none';
    }
    function settle(delay) {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function () { el.style.scrollSnapType = snap; }, delay);
    }
    function canScroll(dir) {
      return dir < 0 ? el.scrollLeft > 0 : el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
    }

    // Wheel: vertical wheel moves the strip sideways; at either end the page scrolls as usual.
    el.addEventListener('wheel', function (e) {
      var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!d || e.ctrlKey || !canScroll(d)) return;
      e.preventDefault();
      pauseSnap();
      el.scrollLeft += e.deltaMode === 1 ? d * 40 : d;
      settle(180);
    }, { passive: false });

    // Drag with the mouse (touch already scrolls natively), with a little inertia on release.
    var dragging = false, moved = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, v = 0, raf = 0;

    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      cancelAnimationFrame(raf);
      dragging = true; moved = false;
      startX = lastX = e.clientX; startLeft = el.scrollLeft; lastT = e.timeStamp; v = 0;
      pauseSnap();
    });

    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.classList.add('dragging');
        el.setPointerCapture(e.pointerId);
      }
      if (!moved) return;
      el.scrollLeft = startLeft - dx;
      var dt = e.timeStamp - lastT;
      if (dt > 0) v = (lastX - e.clientX) / dt;
      lastX = e.clientX; lastT = e.timeStamp;
    });

    function release() {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      if (!moved) { el.style.scrollSnapType = snap; return; }
      var prev = performance.now();
      (function glide(now) {
        var dt = now - prev; prev = now;
        el.scrollLeft += v * dt;
        v *= Math.pow(0.94, dt / 16);
        if (Math.abs(v) > 0.05) raf = requestAnimationFrame(glide);
        else settle(0);
      })(prev);
    }
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);

    // A drag shouldn't also count as a click, and images shouldn't be dragged out as files.
    el.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });
})();
