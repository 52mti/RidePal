// config.js
const accountInfo = wx.getAccountInfoSync()
const envVersion = accountInfo.miniProgram.envVersion // develop, trial, release

let config = {}
if (envVersion === 'develop') {
  config = {
    mapKey: 'I73BZ-3MTLU-KS7VI-BZMVI-7NSX6-KJB5J',
    appId: 'wx069ba97219f66d99',
  }
} else if (envVersion === 'trial') {
  config = {
    mapKey: 'I73BZ-3MTLU-KS7VI-BZMVI-7NSX6-KJB5J',
    appId: 'wx069ba97219f66d99',
  }
} else {
  config = { mapKey: 'prod-key', appId: 'appid' }
}

module.exports = config
