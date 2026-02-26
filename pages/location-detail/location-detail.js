// 获取应用实例，用于全局状态管理
const app = getApp()

Page({
  data: {
    homeData: {
      address: {},
      waypoints: [],
    },
    companyData: {
      address: {},
      waypoints: [],
    },
    otherLocations: [],
  },

  onLoad() {
    // 初始化逻辑
  },

  onShow() {
    this.setData({
      homeData: app.globalData.homeData,
      companyData: app.globalData.companyData,
      otherLocations: app.globalData.otherLocations
    })
  },

  // === 统一的页面跳转逻辑 ===
  goToSelect(e) {
    const type = e.currentTarget.dataset.type
    // 根据触发来源传递不同参数给 select-location 页面
    wx.navigateTo({
      url: `/pages/select-location/select-location?type=${type}`,
    })
  },

  // === 统一的删除确认逻辑 ===
  confirmDelete(e) {
    const { target, index } = e.currentTarget.dataset

    // 弹窗提示
    wx.showModal({
      title: '确认删除',
      content: '您确定要删除该位置信息吗？',
      confirmColor: '#FF8C00', // 橙色确认键
      success: (res) => {
        if (res.confirm) {
          this.executeDelete(target, index)
        }
      },
    })
  },

  // 执行删除数组元素的逻辑
  executeDelete(target, index) {
    if (target === 'home-waypoint') {
      const newWaypoints = [...this.data.homeData.waypoints]
      newWaypoints.splice(index, 1)
      this.setData({ 'homeData.waypoints': newWaypoints })
      app.globalData.homeData.waypoints.splice(index, 1)
    }
    if (target === 'company-waypoint') {
      const newWaypoints = [...this.data.companyData.waypoints]
      newWaypoints.splice(index, 1)
      this.setData({ 'companyData.waypoints': newWaypoints })
      app.globalData.companyData.waypoints.splice(index, 1)
    }
    if (target === 'other-location') {
      const newOthers = [...this.data.otherLocations]
      newOthers.splice(index, 1)
      this.setData({ otherLocations: newOthers })
      app.globalData.otherLocations.splice(index, 1)
    }
    wx.showToast({
      title: '已删除',
      icon: 'success',
    })
  },
})
