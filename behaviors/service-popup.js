module.exports = Behavior({
  data: {
    showServiceMenu: false, // 控制弹窗显示
  },
  methods: {
    openServiceMenu() {
      this.setData({ showServiceMenu: true })
    },
    onCloseServiceMenu() {
      this.setData({ showServiceMenu: false })
    },
    // 3. 监听组件选择事件
    onSelectService(e) {
      const serviceItem = e.detail
      console.log('父页面收到了选择:', serviceItem)

      // 示例：根据ID跳转不同页面
      if (serviceItem.id === 1) {
        wx.switchTab({ url: '/pages/carpooling/carpooling' })
      }
    },
  },
})
