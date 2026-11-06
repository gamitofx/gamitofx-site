// Analytics and click-to-play video.
(function () {
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
