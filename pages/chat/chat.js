// 在文件最顶部引入插件和全局管理器
const plugin = requirePlugin('WechatSI')
const manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    chatTitle: '聊天对象',
    messages: [],
    toViewId: '',
    inputValue: '',
    triggered: false,
    isDynamic: false,
    dynamicInfo: {},

    // 新增：控制语音模式的开关状态
    isVoiceMode: false,
  },

  onLoad: function (options) {
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
    // ... (保留你原有的 onLoad 逻辑)

    // 新增：初始化语音识别管理器
    this.initVoiceRecognition()
  },

  // ... (保留你原有的 loadMockMessages, onPullDownRefresh, formatTime 等逻辑)

  // ===== 新增：初始化语音识别回调 =====
  initVoiceRecognition: function () {
    // 录音开始
    manager.onStart = (res) => {
      console.log('语音识别开始')
      this.setData({ isVoiceMode: true })
      // 记录开始说话前的输入框内容，方便后面做追加拼写
      this.originalInputValue = this.data.inputValue || ''
    }

    // 录音过程中实时返回（流式识别）
    manager.onRecognize = (res) => {
      // 将原有的文字和正在识别的文字拼接起来，实时展示在输入框
      this.setData({
        inputValue: this.originalInputValue + res.result,
      })
    }

    // 录音结束
    manager.onStop = (res) => {
      console.log('语音识别结束')
      this.setData({
        inputValue: this.originalInputValue + res.result,
        isVoiceMode: false,
      })
    }

    // 录音报错（如超时、没说话等）
    manager.onError = (res) => {
      console.error('语音报错', res)
      this.setData({ isVoiceMode: false })
      wx.showToast({ title: '未听到声音或超时', icon: 'none' })
    }
  },

  // ===== 修改：点击话筒按钮交互 =====
  onVoiceClick: function () {
    // 如果当前正在录音，再次点击则停止录音
    if (this.data.isVoiceMode) {
      manager.stop()
      return
    }

    // 如果未在录音，则请求权限并开始录音
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        manager.start({
          lang: 'zh_CN', // 识别普通话
        })
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '需要录音权限才能使用语音转文字功能',
          success: (res) => {
            if (res.confirm) wx.openSetting()
          },
        })
      },
    })
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

  // 修改：发送消息逻辑（优化：如果发消息时正在录音，强制停掉）
  sendMessage: function () {
    if (this.data.isVoiceMode) {
      manager.stop()
    }

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
