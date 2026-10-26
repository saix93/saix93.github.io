// YouTube cards: shows SHOWN random videos from videos-list.js on every visit. Clicking a
// thumbnail opens the video in a lightbox like the photo viewer. The player is only created
// when opened and removed on close, which also stops playback.
(function () {
  var SHOWN = 4;
  var list = document.querySelector('.videos');
  var pool = (window.VIDEOS || []).slice();

  // "Game - Clip name" titles show the game as the tag above the clip name.
  for (var n = 0; n < SHOWN && pool.length; n++) {
    var v = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    var dash = v.title.indexOf(' - ');
    var name = dash > 0 ? v.title.slice(dash + 3) : v.title;
    var li = document.createElement('li');
    li.innerHTML =
      '<article class="video">' +
        '<button class="play" type="button"><img alt="" width="640" height="360" loading="lazy"><span class="duration"></span></button>' +
        '<div class="info">' + (dash > 0 ? '<span class="vtag"></span>' : '') + '<h3><a></a></h3></div>' +
      '</article>';
    var play = li.querySelector('.play');
    play.setAttribute('data-id', v.id);
    play.setAttribute('aria-label', 'Play ' + v.title);
    li.querySelector('img').src = 'img/videos/' + v.id + '.jpg';
    li.querySelector('.duration').textContent = v.duration;
    if (dash > 0) li.querySelector('.vtag').textContent = v.title.slice(0, dash);
    var a = li.querySelector('h3 a');
    a.href = 'https://www.youtube.com/watch?v=' + v.id;
    a.textContent = name;
    a.title = v.title;
    list.appendChild(li);
  }

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.video .play'));
  var box = document.querySelector('.video-box');
  var frame = box.querySelector('.lb-frame');
  var cap = box.querySelector('.lb-cap');
  var count = box.querySelector('.lb-count');
  var current = 0;

  function show(i) {
    current = (i + buttons.length) % buttons.length;
    var btn = buttons[current];
    var title = btn.closest('.video').querySelector('h3 a').title;
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
