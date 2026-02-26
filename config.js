// config.js
const accountInfo = wx.getAccountInfoSync();
const envVersion = accountInfo.miniProgram.envVersion; // develop, trial, release

let config = {};
if (envVersion === 'develop') {
  config = { mapKey: 'I73BZ-3MTLU-KS7VI-BZMVI-7NSX6-KJB5J' };
} else if (envVersion === 'trial') {
  config = { mapKey: 'I73BZ-3MTLU-KS7VI-BZMVI-7NSX6-KJB5J' };
} else {
  config = { mapKey: 'prod-key' };
}

module.exports = config;
