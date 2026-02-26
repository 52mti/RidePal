const serviceBehavior = require('../../behaviors/service-popup')

Page({
  behaviors: [serviceBehavior],
  data: {
    activeTab: 2, // 默认选中"服务" 
    showServiceMenu: false, // 控制底部弹窗
    activeDateTab: 0, // 0: 今天发车, 1: 明天发车

    // 完美匹配截图的数据结构
    carpoolList: [
      {
        id: 1,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', // 替换为你的本地头像路径
        nickname: '王先生',
        time: '12:20',
        startPoint: '理想成八期西门, 地安门',
        startWaypoints: [],
        endPoint: '天安门广场, 复兴门',
        endWayPoints: [],
        price: '25',
        status: 'normal',
        statusText: '差1人',
      },
      {
        id: 2,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        nickname: '陈女士',
        time: '07:30',
        startPoint: '西红门医院南门',
        endPoint: '德胜门外大街, 积水潭',
        price: '30',
        status: 'normal',
        statusText: '差3人',
      },
      {
        id: 3,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        nickname: '张师傅',
        time: '08:15',
        startPoint: '广安门内大街',
        endPoint: '北京南站, 永定门',
        price: '20',
        status: 'full', // 控制时间变灰
        statusText: '已满',
      }
    ],

    // 控制弹窗显示隐藏
    showFilterPopup: false,

    // 筛选数据源
    filterDates: [], 
    filterHours: [],
    filterMinutes: ['00', '15', '30', '45'], // 15分钟间隔

    // 当前选中的值
    selectedDateIndex: 0,
    selectedHour: '00',
    selectedMinute: '00',
  },

  onLoad() {
    this.initFilterData();
  },

  // === 1. 初始化筛选器数据 ===
  initFilterData() {
    // 1. 生成日期 (今天 + 未来3天)
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const targetDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const month = targetDate.getMonth() + 1;
      const day = targetDate.getDate();
      
      dates.push({
        id: i,
        label: i === 0 ? '今天' : `${month}月${day}日`,
        fullDate: targetDate // 留存完整日期对象备用
      });
    }

    // 2. 生成小时 (00 - 23)
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }

    this.setData({
      filterDates: dates,
      filterHours: hours
    });
  },

  // === 2. 弹窗控制 ===
  openFilterPopup() {
    this.setData({ showFilterPopup: true });

    // 隐藏自定义 TabBar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ show: false });
    }
  },

  closeFilter() {
    this.setData({ showFilterPopup: false });

    // 恢复显示自定义 TabBar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ show: true });
    }
  },

  // === 3. 选择交互 ===
  onSelectFilterDate(e) {
    this.setData({ selectedDateIndex: e.currentTarget.dataset.index });
  },

  onSelectFilterHour(e) {
    this.setData({ selectedHour: e.currentTarget.dataset.val });
  },

  onSelectFilterMinute(e) {
    this.setData({ selectedMinute: e.currentTarget.dataset.val });
  },

  // === 4. 底部按钮交互 ===
  resetFilter() {
    this.setData({
      selectedDateIndex: 0,
      selectedHour: '00',
      selectedMinute: '00'
    });
    wx.showToast({ title: '已重置', icon: 'none' });
  },

  saveFilter() {
    const { filterDates, selectedDateIndex, selectedHour, selectedMinute } = this.data;
    const chosenDateObj = filterDates[selectedDateIndex];
    
    // 组装结果，打印检查
    const resultTime = `${chosenDateObj.label} ${selectedHour}:${selectedMinute}`;
    console.log('保存的筛选时间：', resultTime);

    wx.showToast({ title: '保存成功', icon: 'success' });
    this.closeFilter();
    
    // TODO: 在这里触发列表接口刷新，携带筛选参数
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 2 })
    }
  },

  // 切换今天/明天
  onSwitchDate(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ activeDateTab: index });
    // TODO: 可以在这里请求对应日期的数据
  },

  // 点击时间筛选
  onFilterTime() {
    wx.showToast({ title: '打开时间选择器', icon: 'none' })
  },

  // 点击卡片预约座位
  onMakeReservation(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/makeReservation/makeReservation"
    })
  },

  // 点击悬浮加号发布
  onPublish() {
    wx.showToast({ title: '跳转发布行程页面', icon: 'none' })
    wx.navigateTo({ url: '/pages/publish-ride/publish-ride' })
  }
})