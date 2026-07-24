(function (global) {
  function originInfo() {
    return {
      origin: global.location.origin,
      href: global.location.href
    };
  }

  function renderOriginNote(elementId) {
    const target = document.getElementById(elementId);
    if (!target) return null;
    const info = originInfo();
    target.textContent = `此清冊儲存在目前網址：${info.origin}`;
    return info;
  }

  function registerServiceWorker(path) {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker.register(path || './service-worker.js')
      .then(registration => {
        registration.update();
        return registration;
      })
      .catch(err => {
        console.warn('[AppCache] Service Worker registration failed:', err);
        return null;
      });
  }

  global.AppCache = {
    originInfo,
    renderOriginNote,
    registerServiceWorker
  };
})(window);
