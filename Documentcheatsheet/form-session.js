(function (global) {
  function ensureDraftId(currentId, type) {
    return currentId || global.DraftStore.makeId(type || 'draft');
  }

  function draftUrl(page, id) {
    return `${page}?draft=${encodeURIComponent(id)}`;
  }

  function syncLocationDraft(id) {
    const url = new URL(global.location.href);
    url.searchParams.set('draft', id);
    global.history.replaceState({}, '', url);
  }

  function backToIndexUrl(id) {
    return `index.html?drafts=${encodeURIComponent(id)}&t=${Date.now()}`;
  }

  function saveDraft(options) {
    const now = new Date().toISOString();
    const id = ensureDraftId(options.id, options.type);
    const record = global.DraftStore.makeRecord({
      id,
      type: options.type,
      typeLabel: options.typeLabel,
      title: options.title,
      url: options.url || draftUrl(options.page || `${options.type}-form.html`, id),
      createdAt: options.createdAt || now,
      updatedAt: now,
      data: options.data || {}
    });
    return global.DraftStore.save(record);
  }

  function loadDraft(id) {
    return id ? global.DraftStore.load(id) : null;
  }

  function signatureData(canvas, state) {
    return canvas && state && state.dirty ? global.SignatureUtils.canvasDataUrl(canvas) : '';
  }

  global.FormSession = {
    ensureDraftId,
    draftUrl,
    syncLocationDraft,
    backToIndexUrl,
    saveDraft,
    loadDraft,
    signatureData
  };
})(window);
