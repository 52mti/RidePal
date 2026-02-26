// 获取应用实例，用于全局状态管理
const app = getApp();

Page({
  data: {
    statusBarHeight: 0,
    homeAddress: '',
    companyAddress: ''
  },

  onLoad() {
    // 获取状态栏高度，适配刘海屏，防止顶部内容被遮挡
    const windowInfo = wx.getWindowInfo();
    this.setData({
      statusBarHeight: windowInfo.statusBarHeight
    });
  },

  /**
   * 生命周期函数--监听页面显示
   * 使用 onShow 而不是 onLoad，这样从地址选择页面返回时，能自动触发重新读取全局状态
   */
  onShow() {
    // 读取 app.globalData 中的全局状态
    // 如果你在其他页面修改了 app.globalData.homeAddress，这里会自动更新到视图
    this.setData({
      homeAddress: app.globalData.homeData.address?.title || '',
      companyAddress: app.globalData.companyData.address?.title || ''
    });
  },

  // === 交互方法 ===

  // 跳转设置【家】地址
  goToSelectHome() {
    wx.navigateTo({
      url: '/pages/select-location/select-location?type=home' // 假设你的地址搜索页路径
    });
  },

  // 跳转设置【公司】地址
  goToSelectCompany() {
    wx.navigateTo({
      url: '/pages/select-location/select-location?type=company'
    });
  },

  // 进入首页
  enterHome() {
    const { homeAddress, companyAddress } = this.data;
    
    // （可选）加个基础的校验提示
    if (!homeAddress && !companyAddress) {
      wx.showToast({
        title: '建议至少设置一个地址',
        icon: 'none'
      });
      // 根据业务需求，你可以 return 拦截，也可以直接放行
    }

    wx.showLoading({ title: '加载中' });
    setTimeout(() => {
      wx.hideLoading();
      // 通常"进入首页"是跳转到 TabBar 页面，必须用 switchTab
      wx.switchTab({
        url: '/pages/message/message' // 替换为你实际的首页路径
      });
    }, 500);
  }
});