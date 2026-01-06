Page({
  data: {
    messages: [],
    toViewId: '', // 用于滚动定位
    inputValue: '',
    triggered: false, // 下拉刷新状态
    chatTitle: '聊天对象',
  },

  onLoad: function (options) {
    // 设置导航栏标题
    if (options.title) {
      wx.setNavigationBarTitle({ title: options.title })
    }
    // 加载初始消息
    this.loadMockMessages()
  },

  // 1. 加载模拟消息
  loadMockMessages: function () {
    // 模拟历史数据
    const mockData = [
      {
        id: 1,
        isMe: false,
        type: 'text',
        content: '你好，我是顺路车友，看到你发布的行程了。',
        time: '1672531200000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      },
      {
        id: 2,
        isMe: false,
        type: 'text',
        content: '请问明天早上8点确定能出发吗？',
        time: '1672531260000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      },
      {
        id: 3,
        isMe: true,
        type: 'text',
        content: '你好！是的，准时出发。目前车上还有2个空位。',
        time: '1672534800000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ME',
      },
      {
        id: 4,
        isMe: false,
        type: 'image',
        content: 'https://via.placeholder.com/150',
        time: '1672535000000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      },
      {
        id: 5,
        isMe: false,
        type: 'text',
        content: '这是我的位置，你看方便接吗？',
        time: '1672535010000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      },
    ]

    // 处理时间戳显示逻辑 (如果两条消息间隔超过5分钟，则显示时间)
    const formattedData = this.processTimeDisplay(mockData)

    this.setData({
      messages: formattedData,
      toViewId: 'bottom-anchor', // 初始直接滚到底部
    })
  },

  // 2. 下拉加载历史 (模拟)
  onPullDownRefresh: function () {
    setTimeout(() => {
      const history = [
        {
          id: 99,
          isMe: false,
          type: 'text',
          content: '--- 历史消息 ---',
          time: '1672000000000',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
          showTime: true,
        },
      ]
      // 将历史消息插到数组最前面
      const newMsgs = [...history, ...this.data.messages]

      this.setData({
        messages: newMsgs,
        triggered: false, // 关闭下拉动画
      })
    }, 1000)
  },

  // 3. 处理时间显示逻辑 (Helper Function)
  processTimeDisplay: function (list) {
    let lastTime = 0
    return list.map((item) => {
      const currentTime = parseInt(item.time)
      // 间隔超过5分钟(300000ms)显示时间
      if (currentTime - lastTime > 300000) {
        item.showTime = true
        item.displayTime = this.formatTime(currentTime)
      } else {
        item.showTime = false
      }
      lastTime = currentTime
      return item
    })
  },

  // 4. 简单的格式化时间 (昨天 12:30)
  formatTime: function (timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    // 简单判断是否是今天
    if (date.getDate() === now.getDate()) {
      return `${hours}:${minutes}`
    } else {
      return `昨天 ${hours}:${minutes}`
    }
  },

  // 输入监听
  onInput: function (e) {
    this.setData({ inputValue: e.detail.value })
  },

  // 5. 发送消息
  sendMessage: function () {
    const text = this.data.inputValue
    if (!text.trim()) return

    const newMsg = {
      id: Date.now(),
      isMe: true,
      type: 'text',
      content: text,
      time: Date.now(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ME',
      showTime: false, // 连续发送不显示时间
    }

    const list = [...this.data.messages, newMsg]

    this.setData({
      messages: list,
      inputValue: '',
      toViewId: `msg-${newMsg.id}`, // 滚动到最新的一条
    })
  },

  // 预览图片
  previewImg: function (e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({
      urls: [src],
    })
  },
})
