// YouTube cards: load the player only when a thumbnail is clicked, so the page stays light.
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.video .play'), function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.video');
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + btn.getAttribute('data-id') + '?autoplay=1&rel=0';
      frame.title = card.querySelector('h3').textContent;
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      card.classList.add('playing');
      card.removeAttribute('data-tilt');
      btn.replaceWith(frame);
    });
  });
})();
