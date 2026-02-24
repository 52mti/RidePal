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
        endPoint: '天安门广场, 复兴门',
        price: '25',
        status: 'normal',
        statusText: '差1人',
        statusClass: 'tag-orange' // 橘色标签
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
        statusClass: 'tag-green' // 绿色标签
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
        statusClass: 'tag-gray' // 灰色标签
      }
    ],
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

  // 点击高级筛选
  onOpenMoreFilters() {
    wx.showToast({ title: '打开高级筛选', icon: 'none' })
  },

  // 点击悬浮加号发布
  onPublish() {
    wx.showToast({ title: '跳转发布行程页面', icon: 'none' })
    // wx.navigateTo({ url: '/pages/publish/publish' })
  }
})