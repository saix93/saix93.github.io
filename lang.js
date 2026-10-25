// Language switch: elements marked lang="en" or lang="es" inside <body> are shown only
// when <html lang> matches. Load this in <head>, after <title>, so the page never flashes
// the wrong language. The Spanish title goes in <title data-es="...">.
(function () {
  var root = document.documentElement;
  var title = document.querySelector('title');
  var titles = title ? { en: title.textContent, es: title.getAttribute('data-es') || title.textContent } : null;

  function apply(lang) {
    root.lang = lang;
    if (titles) document.title = titles[lang];
  }

  var saved;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  apply(saved === 'en' || saved === 'es' ? saved : (/^es\b/i.test(navigator.language || '') ? 'es' : 'en'));

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.lang-toggle')) return;
    var next = root.lang === 'es' ? 'en' : 'es';
    apply(next);
    try { localStorage.setItem('lang', next); } catch (e) {}
  });
})();
