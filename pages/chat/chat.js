Page({
  data: {
    statusBarHeight: 20,
    chatTitle: '聊天对象',
    messages: [],
    toViewId: '',
    inputValue: '',
    triggered: false,
    isDynamic: false,
    dynamicInfo: {},
  },

  onLoad: function (options) {
    // 获取状态栏高度
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight })

    // 设置标题
    if (options.title) {
      this.setData({ chatTitle: options.title })
    }

    // 判断是否为动态类型，固定展示蓝色公告卡
    if (options.type === 'dynamic') {
      this.setData({
        isDynamic: true,
        dynamicInfo: {
          date: '2025/12/25',
          plateNumber: '豫A3i3il3',
          carColor: '白色',
          carModel: '丰田 凯美瑞',
          route: '7:30开车，四期西门，六期东门，五期北门',
        },
      })
    }

    this.loadMockMessages()
  },

  loadMockMessages: function () {
    const mockData = [
      {
        id: 1,
        isMe: false,
        type: 'text',
        content: '您好！我已经到达北门接送点。我在喷泉附近的白色SUV里。',
        time: '1672534800000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      },
      {
        id: 2,
        isMe: true,
        type: 'text',
        content: '好的，我现在过去。大约2分钟到！',
        time: '1672534860000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ME',
      },
      {
        id: 3,
        isMe: false,
        type: 'text',
        content: '不着急，您慢点！👍',
        time: '1672534920000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      },
    ]

    const formattedData = this.processTimeDisplay(mockData)

    this.setData({
      messages: formattedData,
      toViewId: 'bottom-anchor',
    })
  },

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
          displayTime: '昨天 10:00',
        },
      ]
      this.setData({
        messages: [...history, ...this.data.messages],
        triggered: false,
      })
    }, 1000)
  },

  processTimeDisplay: function (list) {
    let lastTime = 0
    return list.map((item) => {
      const currentTime = parseInt(item.time)
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

  formatTime: function (timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    if (date.getDate() === now.getDate()) {
      return `今天 ${hours}:${minutes}`
    } else {
      return `昨天 ${hours}:${minutes}`
    }
  },

  onInput: function (e) {
    this.setData({ inputValue: e.detail.value })
  },

  sendMessage: function () {
    const text = this.data.inputValue
    if (!text.trim()) return

    const newMsg = {
      id: Date.now(),
      isMe: true,
      type: 'text',
      content: text,
      time: Date.now().toString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ME',
      showTime: false,
    }

    this.setData({
      messages: [...this.data.messages, newMsg],
      inputValue: '',
      toViewId: `msg-${newMsg.id}`,
    })
  },

  previewImg: function (e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({ urls: [src] })
  },

  goBack: function () {
    wx.navigateBack()
  },

  showMore: function () {
    wx.showToast({ title: '更多功能待开发', icon: 'none' })
  },

  onVoiceClick: function () {
    wx.showToast({ title: '语音功能待开发', icon: 'none' })
  },

  onEmojiClick: function () {
    wx.showToast({ title: '表情功能待开发', icon: 'none' })
  },

  onImageClick: function () {
    wx.showToast({ title: '图片功能待开发', icon: 'none' })
  },

  onMoreClick: function () {
    wx.showToast({ title: '更多功能待开发', icon: 'none' })
  },
})
