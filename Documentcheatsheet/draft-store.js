(function (global) {
  const INDEX_KEY = 'admin-form-drafts';
  const RECORD_PREFIX = 'admin-form-draft:';
  const UPDATED_KEY = 'admin-form-drafts-updated-at';

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[DraftStore] write failed:', key, e);
      return false;
    }
  }

  function toSummary(record) {
    return {
      id: record.id,
      type: record.type,
      typeLabel: record.typeLabel,
      title: record.title,
      url: record.url,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }

  function originInfo() {
    return {
      origin: global.location?.origin || '',
      href: global.location?.href || '',
      storageKey: INDEX_KEY
    };
  }

  function notifyUpdated(timestamp) {
    writeJson(UPDATED_KEY, timestamp || new Date().toISOString());
  }

  function makeRecord(options) {
    const now = new Date().toISOString();
    const id = options.id || makeId(options.type || 'draft');
    return {
      id,
      type: options.type || 'draft',
      typeLabel: options.typeLabel || '暫存表單',
      title: options.title || '未命名表單',
      url: options.url || '',
      createdAt: options.createdAt || now,
      updatedAt: options.updatedAt || now,
      data: options.data || {}
    };
  }

  function list() {
    try {
      const items = readJson(INDEX_KEY, []);
      const indexed = Array.isArray(items) ? items.filter(item => item && item.id) : [];
      const records = [];
      for (let i = 0; i < localStorage.length; i++) {
        try {
          const key = localStorage.key(i);
          if (!key || !key.startsWith(RECORD_PREFIX)) continue;
          const record = readJson(key, null);
          if (record && record.id) records.push(toSummary(record));
        } catch (e) {}
      }

      if (!records.length) return indexed;

      const byId = new Map();
      indexed.forEach(item => byId.set(item.id, item));
      records.forEach(item => byId.set(item.id, { ...byId.get(item.id), ...item }));
      const merged = Array.from(byId.values()).filter(item => item && item.id);
      writeJson(INDEX_KEY, merged);
      return merged;
    } catch (e) {
      console.warn('[DraftStore] list failed:', e);
      return [];
    }
  }

  function load(id) {
    if (!id) return null;
    return readJson(RECORD_PREFIX + id, null);
  }

  function save(record) {
    if (!record || !record.id) throw new Error('DraftStore.save requires a draft id.');
    const now = new Date().toISOString();
    const existing = load(record.id);
    const completeRecord = {
      ...record,
      createdAt: existing?.createdAt || record.createdAt || now,
      updatedAt: record.updatedAt || now
    };
    if (!writeJson(RECORD_PREFIX + completeRecord.id, completeRecord)) {
      throw new Error('暫存失敗：瀏覽器儲存空間不足或無法寫入。');
    }
    const nextIndex = list().filter(item => item.id !== completeRecord.id);
    nextIndex.push(toSummary(completeRecord));
    writeJson(INDEX_KEY, nextIndex);
    notifyUpdated(completeRecord.updatedAt);
    return completeRecord;
  }

  function remove(id) {
    if (!id) return;
    localStorage.removeItem(RECORD_PREFIX + id);
    writeJson(INDEX_KEY, list().filter(item => item.id !== id));
    notifyUpdated();
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now()}`;
  }

  global.DraftStore = {
    list,
    load,
    save,
    remove,
    makeRecord,
    makeId,
    originInfo,
    notifyUpdated,
    INDEX_KEY,
    RECORD_PREFIX,
    UPDATED_KEY
  };
})(window);
