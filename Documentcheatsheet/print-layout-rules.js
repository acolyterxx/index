(function (global) {
  const inspection = {
    contentHeading(form) {
      if (!form) return '';
      if (form.id === 'electric-cart') return '檢查方法';
      if (form.id === 'protective-equipment') return '檢點內容';
      return form.contentHeading || '檢點內容 / 檢查方法';
    },

    firstHeadCell(form, helpers) {
      const printText = helpers?.printText || (value => String(value || ''));
      const heading = form?.partHeading || '檢點部分';
      if (form?.id === 'lab-safety') {
        return `<th class="print-lab-merged-head" colspan="2">${printText(heading)}</th>`;
      }
      return `<th class="print-part">${printText(heading)}</th>
            <th class="print-content">${printText(this.contentHeading(form))}</th>`;
    },

    tableColumns(form, periodCount) {
      if (form?.id !== 'lab-safety') return '';
      return `<colgroup>
            <col style="width:13mm">
            <col style="width:68mm">
            ${Array.from({ length: periodCount }, () => '<col style="width:6.38mm">').join('')}
          </colgroup>`;
    },

    colspan(periodCount) {
      return periodCount + 2;
    }
  };

  const hazard = {
    rules() {
      return global.ADMIN_FORM_RULES?.hazard?.printTemplate || {};
    },

    pledgeNumbers() {
      return this.rules().pledge?.numberLabels || ['一、', '二、', '三、', '四、', '五、', '六、'];
    },

    hazardCheckLayout() {
      return this.rules().hazardCheckLayout || [
        [0, 7, 13], [1, 8, 14], [2, 9, 15], [3, 10, 16], [4, 11, 17], [5, 12, null], [6, null, null]
      ];
    },

    basicLabels() {
      return this.rules().basicTable?.labelsWithOriginalBreaks || {};
    },

    signatureFallback() {
      return this.rules().pledge?.signatureFallback || ['sig-pledge', 'sig-boss'];
    }
  };

  global.AdminPrintLayout = {
    inspection,
    hazard
  };
})(window);
