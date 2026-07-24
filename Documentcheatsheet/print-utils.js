(function (global) {
  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function printText(value) {
    return escapeHtml(value).replace(/(\d+)/g, '<span class="print-num">$1</span>');
  }

  function printTextWithBreaks(value) {
    return printText(value).replace(/&lt;br&gt;/g, '<br>');
  }

  function printPlateValue(value) {
    return escapeHtml(value).replace(/([A-Za-z0-9-]+)/g, '<span class="print-plate-value">$1</span>');
  }

  function nlToBreaks(value) {
    return escapeHtml(value).replace(/\r?\n/g, '<br>');
  }

  global.AdminPrintUtils = {
    escapeHtml,
    printText,
    printTextWithBreaks,
    printPlateValue,
    nlToBreaks
  };
})(window);
