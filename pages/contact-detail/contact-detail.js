Page({
  data: {
    userInfo: {
      phone: '13888888888'
    }
  },

  onLoad(options) {
    // 页面加载逻辑
  },

  // 复制账号逻辑
  copyAccount() {
    wx.setClipboardData({
      data: this.data.userInfo.phone,
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'none' });
      }
    });
  },

  // 底部按钮点击事件
  handleSendMessage() {
    wx.showToast({ title: '点击了发送消息', icon: 'none' });
  },

  handleVideoCall() {
    wx.showToast({ title: '点击了视频通话', icon: 'none' });
  }
});