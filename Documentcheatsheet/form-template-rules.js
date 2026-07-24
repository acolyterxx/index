(function (global) {
  const rules = {
    hazard: {
      versionLabel: '115-07-22',
      versionText: '民國115年07月22日',
      footerYear: '115',
      printTemplate: {
        useSeparateTemplate: true,
        preserveMobileForm: true,
        fontFamily: "'標楷體','DFKai-SB',serif",
        page: {
          size: 'A4 portrait',
          margin: '0.75cm 1.35cm 1cm 1.35cm'
        },
        basicTable: {
          columns: 10,
          labelsWithOriginalBreaks: {
            workName: '承攬作業<br>名稱',
            workPeriod: '承攬作業<br>期間',
            workLocation: '承攬作業<br>地點'
          },
          contentSingleLineFields: ['work-name', 'work-location'],
          periodSingleLine: true,
          signatureCells: {
            bossColspan: 2,
            supervisorColspan: 2
          }
        },
        hazardCheckLayout: [
          [0, 7, 13],
          [1, 8, 14],
          [2, 9, 15],
          [3, 10, 16],
          [4, 11, 17],
          [5, 12, null],
          [6, null, null]
        ],
        pledge: {
          numberLabels: ['一、', '二、', '三、', '四、', '五、', '六、'],
          signatureFallback: ['sig-pledge', 'sig-boss'],
          dateAtPageBottomCenter: true
        },
        printMustHide: ['.toast', '[data-toast="true"]']
      }
    }
  };

  global.ADMIN_FORM_RULES = rules;
})(window);
