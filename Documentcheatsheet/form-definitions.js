(function (global) {
  const groups = new Map();

  function register(groupName, definitions) {
    if (!groupName) throw new Error('FormDefinitions.register requires a group name.');
    if (!Array.isArray(definitions)) throw new Error('FormDefinitions.register requires an array.');
    groups.set(groupName, definitions.map(item => ({ ...item })));
    return list(groupName);
  }

  function list(groupName) {
    return (groups.get(groupName) || []).map(item => ({ ...item }));
  }

  function find(groupName, id) {
    return list(groupName).find(item => item.id === id) || null;
  }

  function ids(groupName) {
    return list(groupName).map(item => item.id);
  }

  global.FormDefinitions = {
    register,
    list,
    find,
    ids
  };
})(window);
