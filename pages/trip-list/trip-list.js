Page({
  data: {
    currentTab: 1, // 默认选中"拼车记录"，完美匹配您的截图
    dateList: [],  // 动态生成的日期
    
    // 开车记录（演示）
    driveList: [
      { id: 101, time: '今天 08:30', status: '待出发', statusClass: 'tag-blue', start: '万科云城', end: '科技园', driverName: '李先生', carInfo: '特斯拉 Model 3 · 粤B***88' },
    ],

    // 拼车记录（严格匹配图片数据与颜色映射）
    rideList: [
      { id: 201, time: '今天 08:30', status: '待出发', statusClass: 'tag-blue', start: '万科云城', end: '科技园', driverName: '李先生', carInfo: '特斯拉 Model 3 · 粤B***88' },
      { id: 202, time: '今天 18:15', status: '进行中', statusClass: 'tag-orange', start: '深大地铁站', end: '西丽南', driverName: '王女士', carInfo: '蔚来 ET5 · 粤B***21' },
      { id: 203, time: '今天 12:45', status: '已过期', statusClass: 'tag-gray', start: '大冲商务中心', end: '南山医院', driverName: '张师傅', carInfo: '理想 L8 · 粤B***55' },
      { id: 204, time: '今天 07:15', status: '已完成', statusClass: 'tag-green', start: '宝安中心', end: '后海海滨', driverName: '陈先生', carInfo: '比亚迪 汉 · 粤B***99' }
    ]
  },

  onLoad() {
    this.generateDates();
  },

  // 【核心功能】计算今天及往后 3 天的日期
  generateDates() {
    const dateList = [];
    const today = new Date();
    const weekMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < 4; i++) {
      // 循环计算未来日期
      const targetDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      
      const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
      const day = targetDate.getDate().toString().padStart(2, '0');
      const weekIndex = targetDate.getDay();

      dateList.push({
        id: i + 1,
        // 第一个是固定的 TODAY
        week: i === 0 ? 'TODAY' : weekMap[weekIndex],
        // 第一个是固定的 今天，后面的转为 MM-DD 格式
        day: i === 0 ? '今天' : `${month}-${day}`,
        active: i === 0
      });
    }

    this.setData({ dateList });
  },

  onTabChange(event) {
    this.setData({ currentTab: event.detail.index });
  },

  selectDate(e) {
    const id = e.currentTarget.dataset.id;
    const newList = this.data.dateList.map(item => ({
      ...item, active: item.id === id
    }));
    this.setData({ dateList: newList });
    // TODO: 根据选中的日期去后端拉取最新数据
  },

  goToDriveDetail() {
    wx.navigateTo({ url: '/pages/drive-detail/drive-detail' });
  },

  goToRideTrack() {
    wx.navigateTo({ url: '/pages/ride-track/ride-track' });
  },

  // 取消行程 (开车记录专用)
  cancelItinerary(e) {
    wx.showModal({
      title: '取消行程',
      content: '确定要取消您的发车计划吗？',
      confirmColor: '#FF8C00',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '行程已取消', icon: 'success' });
        }
      }
    });
  },

  // 取消订单 (拼车记录专用)
  cancelOrder(e) {
    wx.showModal({
      title: '取消订单',
      content: '确定要取消本次拼车吗？',
      confirmColor: '#FF8C00',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '订单已取消', icon: 'success' });
        }
      }
    });
  },

  handleCall() {
    wx.showToast({ title: '拨打电话...', icon: 'none' });
  },

  handleChat() {
    wx.showToast({ title: '打开聊天窗口...', icon: 'none' });
  }
});