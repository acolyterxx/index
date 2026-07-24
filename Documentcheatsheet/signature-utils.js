(function (global) {
  function isImageData(value) {
    return typeof value === 'string' && value.startsWith('data:image') && value.length > 100;
  }

  function load(key) {
    try {
      return localStorage.getItem(key) || '';
    } catch (e) {
      return '';
    }
  }

  function save(key, value) {
    if (!key) return false;
    try {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('[SignatureUtils] save failed:', key, e);
      return false;
    }
  }

  function remove(key) {
    return save(key, '');
  }

  function canvasDataUrl(canvas) {
    if (!canvas) return '';
    try {
      return canvas.toDataURL('image/png');
    } catch (e) {
      return '';
    }
  }

  global.SignatureUtils = {
    isImageData,
    load,
    save,
    remove,
    canvasDataUrl
  };
})(window);
