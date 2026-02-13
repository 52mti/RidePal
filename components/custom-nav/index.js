Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    // 标题文字
    title: { type: String, value: '' },
    // 左侧图标控制
    showBack: { type: Boolean, value: false },
    showSearch: { type: Boolean, value: false },
    showAdd: { type: Boolean, value: false },
    // 颜色配置
    bgColor: { type: String, value: '#F6F7F9' },
    textColor: { type: String, value: '#333333' },
    // 插槽开关（设为 true 时使用 slot 替代默认内容）
    useSlotLeft: { type: Boolean, value: false },
    useSlotCenter: { type: Boolean, value: false },
  },

  data: {
    statusBarHeight: 0,
    navContentHeight: 44,
    totalNavHeight: 0,
    paddingLeft: 0,
  },

  lifetimes: {
    attached() {
      const sysInfo = wx.getSystemInfoSync()
      const menuBtn = wx.getMenuButtonBoundingClientRect()

      const statusBarHeight = sysInfo.statusBarHeight
      // 导航内容高度：让内容区相对胶囊垂直居中
      const navContentHeight =
        (menuBtn.top - statusBarHeight) * 2 + menuBtn.height
      // 左侧 padding = 胶囊右侧到屏幕边缘的距离（对称）
      const capsuleMarginRight = sysInfo.screenWidth - menuBtn.right

      this.setData({
        statusBarHeight,
        navContentHeight,
        totalNavHeight: statusBarHeight + navContentHeight,
        paddingLeft: capsuleMarginRight,
      })
    },
  },

  methods: {
    onBack() {
      this.triggerEvent('back')
      wx.navigateBack().catch(() => {})
    },

    onSearch() {
      this.triggerEvent('search')
    },

    onAdd() {
      this.triggerEvent('add')
    },
  },
})
