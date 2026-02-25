Page({
  data: {
    agreed: false,
    showPrivacy: false,
  },

  onAgreeChange(e) {
    this.setData({ agreed: e.detail })
  },

  handleUnagreedLogin() {
    wx.showToast({ title: '请先阅读并同意隐私政策', icon: 'none' })
  },

  onGetPhoneNumber(e) {
    console.log('onGetPhoneNumber', e)
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 获取到加密数据，发送到后端解密
      const { code, encryptedData, iv } = e.detail
      console.log('手机号授权成功', { code, encryptedData, iv })

      // TODO: 调用后端接口，传递 code / encryptedData / iv 换取手机号
      wx.showToast({ title: '登录成功', icon: 'success' })

      setTimeout(() => {
        wx.navigateTo({ url: '/pages/set-location/set-location' })
      }, 1500)
    } else {
      wx.showToast({ title: '已取消授权', icon: 'none' })
    }
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/set-location/set-location' })
    }, 1500)
  },

  openPrivacy() {
    this.setData({ showPrivacy: true })
  },

  closePrivacy() {
    this.setData({ showPrivacy: false })
  },
})
