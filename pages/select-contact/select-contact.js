const serviceBehavior = require('../../behaviors/service-popup')
const { filterList } = require('../../utils/util.js')
Page({
  behaviors: [serviceBehavior],
  data: {
    keyword: '',
    // 模拟通讯录数据
    originalList: [
      {
        id: '1',
        name: '阿猫',
        note: '拼车友',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      },
      {
        id: '2',
        name: '阿狗',
        note: '同事',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      },
      {
        id: '3',
        name: '产品经理',
        note: '项目负责人',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      },
      {
        id: '4',
        name: '测试小妹',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      },
    ],
    showList: [],
    selected: [],
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 1 })
    }
    this.onSearch({ detail: this.data.keyword })
  },

  fetchContacts(refresh = false) {},

  /**
   * 搜索框确认搜索
   */
  onSearch: function (e) {
    const keyword = e.detail
    const result = filterList(this.data.originalList, keyword, [
      'name',
      'phone',
    ])
    this.setData({
      showList: result,
    })
    this.fetchContacts(true)
  },

  /**
   * 搜索框输入时触发（带 500ms 防抖）
   */
  onSearchChange: function (e) {
    const keyword = e.detail
    this.setData({ keyword })

    if (this._searchTimer) clearTimeout(this._searchTimer)

    this._searchTimer = setTimeout(() => {
      this.onSearch(e)
    }, 500)
  },

  // 切换复选框状态
  onChange(event) {
    this.setData({
      selected: event.detail,
    })
  },

  // 点击单元格触发复选框
  toggle(event) {
    const { index } = event.currentTarget.dataset
    const checkbox = this.selectComponent(`.checkboxes-${index}`)
    checkbox.toggle()
  },

  // 点击取消
  onCancel() {
    wx.navigateBack()
  },

  // 点击确认 (新建群聊)
  onConfirm() {
    if (this.data.selected.length === 0) {
      wx.showToast({ title: '请至少选择一人', icon: 'none' })
      return
    }

    wx.showLoading({ title: '创建中...' })

    // 模拟网络请求
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '群聊创建成功', icon: 'success' })

      // 延迟后返回或跳转到新群聊
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 1000)
  },
})
