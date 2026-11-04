// Plan length toggle: recalculates package prices from the monthly base.
(function () {
  var buttons = document.querySelectorAll('.plans [data-plan]');
  var pkgs = document.querySelectorAll('.pkg[data-base]');
  var usd = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };

  function apply(btn) {
    var off = parseFloat(btn.getAttribute('data-plan'));
    var months = parseInt(btn.getAttribute('data-months'), 10);
    buttons.forEach(function (b) { b.setAttribute('aria-checked', b === btn ? 'true' : 'false'); });
    pkgs.forEach(function (p) {
      var base = parseFloat(p.getAttribute('data-base'));
      p.querySelector('.amt').textContent = usd(base * (1 - off));
      p.querySelector('.pkg__save').textContent = off > 0
        ? 'Save ' + usd(base * off * months) + ' over ' + months + ' months'
        : ' ';
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b); track('plan_select', {months: b.getAttribute('data-months')}); });
  });

  // Analytics events (work once GA4 is installed; no-op before that).
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  document.querySelectorAll('a[data-track]').forEach(function (a) {
    a.addEventListener('click', function () { track(a.getAttribute('data-track')); });
  });
  // Click-to-play: video loads only when asked; only one plays at a time.
  var videos = document.querySelectorAll('.player video');
  document.querySelectorAll('.player').forEach(function (pl) {
    var v = pl.querySelector('video');
    pl.querySelector('.play').addEventListener('click', function () {
      pl.classList.add('is-on');
      v.controls = true;
      v.play();
    });
    v.addEventListener('play', function () {
      videos.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });
  document.querySelectorAll('video[data-track]').forEach(function (v) {
    v.addEventListener('play', function () { track(v.getAttribute('data-track')); }, {once: true});
  });
})();
