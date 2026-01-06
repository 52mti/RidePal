Page({
  data: {
    statusBarHeight: 20,
    activeTab: 2, // 默认选中"服务" (索引从0开始，信息0, 通讯录1, 服务2, 我3)
    showServiceMenu: false, // 控制底部弹窗

    // 筛选状态
    filter: {
      start: '',
      end: '',
      time: '',
    },

    // 服务频道配置 (预留配置入口，支持Scroll)
    services: [
      { id: 1, name: '拼车', icon: 'logistics' }, // 使用vant内置图标模拟
      { id: 2, name: '同城货运', icon: 'shop-collect-o' },
      { id: 3, name: '顺风车', icon: 'guide-o' },
      { id: 4, name: '代驾', icon: 'manager-o' },
      { id: 5, name: '租车', icon: 'logistics' },
      { id: 6, name: '二手车', icon: 'cart-o' },
      { id: 7, name: '车辆保养', icon: 'setting-o' },
      { id: 8, name: '违章查询', icon: 'warn-o' },
      // 测试滚动功能：第9个之后的项目需要滚动才能看到
      { id: 9, name: '加油优惠', icon: 'fire-o' },
      { id: 10, name: 'ETC办理', icon: 'card-o' },
    ],

    // 拼车列表数据模拟
    carpoolList: [
      {
        id: 101,
        avatar: '/static/avatar1.png', // 请替换为本地图片或网络图片
        nickname: '老王车队',
        remark: '准时出发',
        time: '12:20',
        seatsTaken: 4,
        seatsTotal: 5,
        startPoint: '万达广场(北门)',
        wayPoint: '高速路口',
        endPoint: '滨海新区政府',
      },
      {
        id: 102,
        avatar: '/static/avatar2.png',
        nickname: '李师傅',
        remark: '拒载醉酒',
        time: '13:00',
        seatsTaken: 1,
        seatsTotal: 4,
        startPoint: '火车站',
        wayPoint: '',
        endPoint: '大学城',
      },
      // 更多数据...
    ],
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 2 })
    }
  },

  onLoad() {
    // 获取系统状态栏高度，用于适配自定义导航
    const sys = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: sys.statusBarHeight,
    })
  },

  // 底部Tab切换逻辑
  onTabChange(event) {
    const index = event.detail

    // 如果点击的是"服务" (索引2)，拦截跳转，显示弹窗
    if (index === 2) {
      this.setData({ showServiceMenu: true })
      // 保持选中状态不变，或者重置回原来的状态（取决于你的需求）
      // 这里我们为了视觉效果，就让它停留在服务上
    } else {
      // 正常的页面跳转逻辑
      this.setData({ activeTab: index })
      // wx.switchTab({ url: '...' })
      console.log('跳转到 Tab:', index)
    }
  },

  // 顶部筛选逻辑
  onFilterLocation() {
    wx.showToast({ title: '打开地点选择器', icon: 'none' })
    // 实际开发中这里应弹出 van-popup 展示详细的地点输入框
  },

  onFilterTime() {
    wx.showToast({ title: '打开时间选择器', icon: 'none' })
  },

  onOpenMoreFilters() {
    wx.showToast({ title: '打开高级筛选', icon: 'none' })
  },
})
