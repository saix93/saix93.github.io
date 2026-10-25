// YouTube cards: clicking a thumbnail opens the video in a lightbox like the photo viewer.
// The player is only created when opened and removed on close, which also stops playback.
(function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.video .play'));
  var box = document.querySelector('.video-box');
  var frame = box.querySelector('.lb-frame');
  var cap = box.querySelector('.lb-cap');
  var count = box.querySelector('.lb-count');
  var current = 0;

  function show(i) {
    current = (i + buttons.length) % buttons.length;
    var btn = buttons[current];
    var title = btn.closest('.video').querySelector('h3').textContent;
    var player = document.createElement('iframe');
    player.src = 'https://www.youtube-nocookie.com/embed/' + btn.getAttribute('data-id') + '?autoplay=1&rel=0';
    player.title = title;
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin'; // YouTube refuses embeds without a referrer.
    frame.replaceChildren(player);
    cap.textContent = title;
    count.textContent = (current + 1) + ' / ' + buttons.length;
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      if (!box.showModal) { window.location.href = btn.closest('.video').querySelector('h3 a').href; return; }
      show(i);
      box.showModal();
    });
  });

  box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  box.addEventListener('close', function () { frame.replaceChildren(); });
})();
