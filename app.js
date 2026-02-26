import socketManager from './utils/socketManager'

// app.js
App({
  onLaunch() {
    console.log('🚀 小程序启动')

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: (res) => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 如果用户之前登录过（本地有 token），启动时就直接连！
        wx.setStorageSync('token', res.code)
        socketManager.connect(res.code)
      },
    })
  },
  onShow() {
    console.log('👀 小程序切回前台')
    const token = wx.getStorageSync('token')

    // 微信切到后台大概率会断网。切回来时，如果发现断了，立刻重连！
    if (token && !socketManager.isConnected) {
      socketManager.reconnectCount = 0 // 重置重连次数（因为是用户主动切回来的）
      socketManager.connect(token)
    }
  },

  onHide() {
    console.log('🙈 小程序切到后台')
    // 这里其实什么都不用写。
    // 如果微信为了省电把连接掐断了，socketManager 内部的 onClose 会捕获到，
    // 等用户再次 onShow 的时候，就会自动恢复。
  },
  globalData: {
    userInfo: null,
    homeData: {
      address: { title: '理想城八期西门' },
      waypoints: [
        {
          title: '理想城公交站',
        },
        {
          title: '八期北门便利店',
        },
      ],
    },
    companyData: {
      address: { title: '德胜门外大街8号' },
      waypoints: [{ title: '德胜门地铁站C口' }],
    },
    otherLocations: [{ id: 1, title: '万达广场南2门' }],
  },
})
