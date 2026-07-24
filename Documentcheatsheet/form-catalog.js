(function (global) {
  const groups = new Map();

  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (value && typeof value === 'object') return { ...value };
    return value;
  }

  function registerGroup(groupName, definitions, metadata) {
    if (!groupName) throw new Error('FormCatalog.registerGroup requires a group name.');
    if (!Array.isArray(definitions)) throw new Error('FormCatalog.registerGroup requires definitions.');
    const record = {
      definitions: definitions.map(clone),
      metadata: { ...(metadata || {}) }
    };
    groups.set(groupName, record);
    if (global.FormDefinitions) global.FormDefinitions.register(groupName, definitions);
    return list(groupName);
  }

  function list(groupName) {
    const record = groups.get(groupName);
    if (record) return record.definitions.map(clone);
    return global.FormDefinitions ? global.FormDefinitions.list(groupName) : [];
  }

  function find(groupName, id) {
    return list(groupName).find(item => item.id === id) || null;
  }

  function metadata(groupName) {
    return { ...(groups.get(groupName)?.metadata || {}) };
  }

  function pageVersion(formType) {
    if (formType === 'hazard') {
      const hazard = global.ADMIN_FORM_RULES?.hazard || {};
      return {
        versionLabel: hazard.versionLabel || '',
        versionText: hazard.versionText || '',
        label: hazard.versionLabel || '',
        text: hazard.versionText || '',
        footerYear: hazard.footerYear || ''
      };
    }
    return metadata(formType);
  }

  global.FormCatalog = {
    registerGroup,
    list,
    find,
    metadata,
    pageVersion
  };
})(window);
