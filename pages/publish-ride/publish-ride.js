Page({
  data: {
    // 1. 起终点数据
    startLocation: {
      city: '北京市',
      name: '圆明园-长春园'
    },
    endLocation: {
      city: '北京市',
      name: '清华大学-西门' // 预设不同地点以便演示
    },

    // 2. 途经点数据
    waypointUp: '中关村二桥、上地地铁站',
    waypointDown: '',

    // 3. 时间与频次数据
    date: '2024年11月20日',
    time: '07:00',
    frequency: '仅当次',

    // 4. 座位与价格数据
    seats: 4,
    price: 10,

    // 5. 备注信息
    remark: ''
  },

  onLoad(options) {
    // 页面加载时的初始化操作
  },

  // =============== 交互方法 ===============

  // 切换起终点
  handleSwapLocation() {
    const temp = this.data.startLocation;
    this.setData({
      startLocation: this.data.endLocation,
      endLocation: temp
    });
    // 增加一个小震动反馈，提升体验
    wx.vibrateShort();
  },

  // 选择出发点
  handleSelectStart() {
    wx.showToast({ title: '打开地图选择起点', icon: 'none' });
  },

  // 选择终点
  handleSelectEnd() {
    wx.showToast({ title: '打开地图选择终点', icon: 'none' });
  },

  // 选择上车点
  handleSelectWayUp() {
    wx.showToast({ title: '设置上车途经点', icon: 'none' });
  },

  // 选择下车点
  handleSelectWayDown() {
    wx.showToast({ title: '设置下车途经点', icon: 'none' });
  },

  // 选择日期
  handleSelectDate() {
    wx.showToast({ title: '唤起日期选择器', icon: 'none' });
  },

  // 选择时间
  handleSelectTime() {
    wx.showToast({ title: '唤起时间选择器', icon: 'none' });
  },

  // 选择频次
  handleSelectFrequency() {
    wx.showActionSheet({
      itemList: ['仅当次', '每天', '工作日', '周末'],
      success: (res) => {
        const list = ['仅当次', '每天', '工作日', '周末'];
        this.setData({ frequency: list[res.tapIndex] });
      }
    });
  },

  // 选择座位
  handleSelectSeats() {
    wx.showActionSheet({
      itemList: ['1个座位', '2个座位', '3个座位', '4个座位', '5个座位'],
      success: (res) => {
        this.setData({ seats: res.tapIndex + 1 });
      }
    });
  },

  // 选择价格
  handleSelectPrice() {
    wx.showToast({ title: '唤起价格输入键盘', icon: 'none' });
  },

  // 备注输入双向绑定
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 点击发布按钮
  handlePublish() {
    const { startLocation, endLocation, date, time, seats, price } = this.data;
    
    // 基础表单校验模拟
    if (!startLocation.name || !endLocation.name) {
      wx.showToast({ title: '请完善起终点', icon: 'none' });
      return;
    }

    // 提交加载状态
    wx.showLoading({ title: '发布中...', mask: true });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      
      // 模拟返回或跳转
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  }
});