(function (global) {
  function bounds(element) {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }

  function inspectSheet(sheet) {
    const target = typeof sheet === 'string' ? document.querySelector(sheet) : sheet;
    if (!target) return { ok: false, issues: ['print sheet not found'] };
    const sheetBounds = bounds(target);
    const issues = [];
    target.querySelectorAll('table').forEach((table, index) => {
      const tableBounds = bounds(table);
      if (!tableBounds) return;
      if (tableBounds.right - sheetBounds.right > 1) issues.push(`table ${index + 1} overflows right edge`);
      if (tableBounds.left < sheetBounds.left - 1) issues.push(`table ${index + 1} overflows left edge`);
    });
    return {
      ok: issues.length === 0,
      issues,
      sheet: sheetBounds
    };
  }

  global.PrintVerifier = {
    inspectSheet
  };
})(window);
