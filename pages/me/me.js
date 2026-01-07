const serviceBehavior = require('../../behaviors/service-popup')
// pages/me/me.js
Page({
  behaviors: [serviceBehavior],
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 3 })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  // 复制账号功能
  copyId() {
    wx.setClipboardData({
      data: '13888888888',
      success: function () {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },

  // 页面跳转逻辑示例
  navigateTo(event) {
    // const url = event.currentTarget.dataset.url;
    // wx.navigateTo({ url });
  }
})
