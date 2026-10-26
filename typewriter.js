// Hero tagline: types and deletes the texts from taglines.js in a loop, in the page's language.
// Clicking a text that has a link opens it. Off with reduced motion (the first text stays).
(function () {
  var el = document.querySelector('.eyebrow');
  var items = window.TAGLINES || [];
  if (!el || items.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;
  var text = document.createElement('span');
  el.replaceChildren('// ', text);

  var index = 0, timer;
  var HOLD = 2500, TYPE = 70, ERASE = 35;

  function full(i) {
    var item = items[i];
    return typeof item === 'string' ? item : (item[root.lang] || item.en);
  }

  function erase() {
    el.classList.add('typing');
    var t = text.textContent;
    if (t) { text.textContent = t.slice(0, -1); timer = setTimeout(erase, ERASE); return; }
    index = (index + 1) % items.length;
    type();
  }

  function type() {
    var target = full(index), t = text.textContent;
    if (t.length < target.length) { text.textContent = target.slice(0, t.length + 1); timer = setTimeout(type, TYPE); return; }
    el.classList.remove('typing');
    timer = setTimeout(erase, HOLD);
  }

  function show() {
    clearTimeout(timer);
    text.textContent = full(index);
    el.classList.remove('typing');
    timer = setTimeout(erase, HOLD);
  }

  // Switch the current text straight away when the language changes.
  new MutationObserver(show).observe(root, { attributes: true, attributeFilter: ['lang'] });

  el.addEventListener('click', function () {
    var link = items[index].link;
    if (link) window.open(link, '_blank', 'noopener');
  });

  show();
})();
