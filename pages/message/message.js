const serviceBehavior = require('../../behaviors/service-popup')

Page({
  behaviors: [serviceBehavior],
  data: {
    msgList: [],
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 0 })
    }
  },

  onLoad: function () {
    this.generateMockData()
  },

  // 生成模拟数据
  generateMockData: function () {
    let list = []
    // 模拟20条数据，超过8条展示scroll-view效果
    for (let i = 0; i < 20; i++) {
      let type = 'private' // 默认私聊
      let title = `友邻顺路车友 ${i + 1}号`
      let content =
        '你好，明天早上8点出发去软件园还有位置吗？如果没有的话我就自己开车了。'
      let avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + i // 随机头像API

      // 制造一些群聊
      if (i % 3 === 0) {
        type = 'group'
        title = '软件园拼车大群 (500人)'
        content = '张三: 还有人没上车吗？车主已经在楼下等了五分钟了，快点下来！'
      }

      // 制造一些广告
      if (i === 2 || i === 8) {
        type = 'ad'
        title = '拼车优惠券助手'
        content =
          '双11特惠！拼车出行领5元无门槛红包，点击立即领取，仅限今天有效。'
      }

      list.push({
        id: i,
        type: type,
        title: title,
        avatarUrl: avatar,
        content: content, // 这里故意弄长一点测试两行省略
        updatedTime: i === 0 ? '刚刚' : i < 5 ? '12:30' : '昨天',
        unread: i % 5 === 0 ? 1 : 0,
      })
    }
    this.setData({ msgList: list })
  },

  // 跳转详情
  goToChat: function (e) {
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: `/pages/chat/chat?id=${id}&title=${title}`,
    })
  },
})
