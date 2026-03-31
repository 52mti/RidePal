Page({
  data: {
    statusBarHeight: 20,
    
    // 模拟订单数据
    tripInfo: {
      lat: 23.10623, // 广州塔大致坐标
      lng: 113.32431,
      driverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      driverName: '张师傅',
      rating: '4.9',
      carPlate: '粤A88888',
      carModel: '白色汉EV',
      tripTime: '10月24日 14:30',
      orderType: '拼车单',
      startName: '广州塔',
      startDesc: '海珠区阅江西路222号',
      endName: '珠江新城',
      endDesc: '天河区花城广场',
      totalPrice: '25.00',
      tipPrice: '0.00',
      actualPrice: '25.00',
      orderNo: 'CP2023102488889999'
    }
  },

  onLoad() {
    // 获取设备状态栏高度，完美适配刘海屏
    const windowInfo = wx.getWindowInfo();
    this.setData({
      statusBarHeight: windowInfo.statusBarHeight
    });
  },

  // 顶部返回按钮
  goBack() {
    wx.navigateBack();
  },

  // 拨打司机电话 (原生能力)
  callDriver() {
    wx.makePhoneCall({
      phoneNumber: '13800138000', // 替换为真实的司机号码
      success() {
        console.log('拨打电话成功');
      },
      fail() {
        console.log('用户取消拨打');
      }
    });
  },

  // ================= 底部按钮页面跳转逻辑 =================

  // 返回首页 (通常首页是 tabBar 页面，所以用 switchTab)
  goHome() {
    wx.switchTab({
      url: '/pages/index/index' // 请替换为您实际的首页路径
    });
    // 如果您的首页不是 tabBar，请换成 wx.reLaunch({ url: '...' })
  },

  // 联系司机 (跳转到 IM 聊天页面)
  contactDriver() {
    wx.navigateTo({
      // 可以在 url 后面拼接参数传给聊天页面，比如订单号或司机ID
      url: `/pages/message/message?driverName=${this.data.tripInfo.driverName}&orderNo=${this.data.tripInfo.orderNo}`
    });
  }
});