const serviceBehavior = require('../../behaviors/service-popup')

Page({
  behaviors: [serviceBehavior],
  data: {
    msgList: [],
    loading: false,
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 0 })
    }
  },

  handleSearchClick() {
    wx.showToast({
      title: '搜索功能待开发，敬请期待~',
      icon: 'none',
    })
  },

  handleAddClick() {
    wx.navigateTo({
      url: '/pages/select-contact/select-contact',
    })
  },

  onLoad: function () {
    this.generateMockData()
  },

  generateMockData: function () {
    const list = [
      {
        id: 1,
        type: 'private',
        title: '张三',
        tag: '拼车群主',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
        content: '确认一下明天出发的具体位置吗？',
        updatedTime: '01/01日 11:20',
        unread: 2,
      },
      {
        id: 2,
        type: 'group',
        title: '我的上班拼车群',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group1',
        content: '李四：好的，没问题。',
        updatedTime: '01/01日 11:20',
        unread: 0,
      },
      {
        id: 3,
        type: 'dynamic',
        title: '拼车动态',
        plateNumber: '豫A 3i3il3',
        carColor: '白色',
        carModel: '凯美瑞',
        departTime: '7:30',
        updatedTime: '01/01日 11:20',
        unread: 0,
      },
      {
        id: 4,
        type: 'private',
        title: '李四',
        tag: '',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
        content: '好的，我现在在过去。大约2分钟到！',
        updatedTime: '12/31日 09:15',
        unread: 0,
      },
      {
        id: 5,
        type: 'group',
        title: '软件园拼车大群',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group2',
        content: '王五：还有人没上车吗？车主已经在楼下等了。',
        updatedTime: '12/30日 18:00',
        unread: 5,
      },
      {
        id: 6,
        type: 'private',
        title: '王五',
        tag: '车主',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
        content: '明天早上走高架还是走地面？高架快一点。',
        updatedTime: '12/30日 16:30',
        unread: 0,
      },
      {
        id: 7,
        type: 'dynamic',
        title: '拼车动态',
        plateNumber: '京B 88F56',
        carColor: '黑色',
        carModel: '大众帕萨特',
        departTime: '8:00',
        updatedTime: '12/29日 20:00',
        unread: 0,
      },
      {
        id: 8,
        type: 'private',
        title: '赵六',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
        content: '收到，谢谢！',
        updatedTime: '12/28日 14:20',
        unread: 0,
      },
    ]
    this.setData({ msgList: list })
  },

  goToChat: function (e) {
    const { id, title, type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/chat/chat?id=${id}&title=${title}&type=${type || 'private'}`,
    })
  },
})
