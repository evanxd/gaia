
'use strict';

var MockDownloadFormatter = {
  getUUID: function mdf_getUUID(download) {
    return download.id;
  },

  getFileName: function mdf_getFileName(download) {
    return download.path.split('/').pop();
  },

  getDownloadedPercentage: function mdf_getDownloadedPercentage() {
    return 40;
  }
};
