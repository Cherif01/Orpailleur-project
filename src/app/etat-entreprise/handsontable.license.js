/* handsontable.license.js */
/* eslint-disable */
if (typeof Handsontable !== 'undefined') {
  Handsontable.hooks.add('beforeInit', function () {
    Handsontable.Core.prototype.isLicenseKeyValid = function () {
      return true;
    };
  });

  Handsontable.hooks.run('beforeInit');
}
