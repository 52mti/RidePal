// 引入腾讯地图 SDK 核心类（假设您放在了 libs 目录下）
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const config = require('../../config.js')
let qqmapsdk

Page({
  data: {
    currentCity: '定位中...',
    keyword: '',

    // locationType
    locationType: '',

    // list 为当前正在渲染的数组
    list: [],
    // 缓存区
    historyList: [],
    searchList: [],
  },

  onLoad(options) {
    this.setData({
      locationType: options.type,
    })
    // 1. 实例化腾讯地图 API 核心类 (替换为您自己申请的 key)
    qqmapsdk = new QQMapWX({ key: config.mapKey })

    // 2. 加载本地历史记录
    this.loadHistory()

    // 3. 首次进入，获取当前地理位置
    this.getUserLocation()
  },

  // === 初始化操作 ===

  // 加载本地历史缓存
  loadHistory() {
    const history = wx.getStorageSync('locationHistory') || [
      // 演示使用：为了直接展示高保真效果，我写死了一些测试数据
      {
        id: '1',
        title: '圆明园-长春园',
        address: '海淀区清华西路28号圆明园景区内',
        location: { lat: 40.0, lng: 116.3 },
      },
      {
        id: '2',
        title: '清华大学-西门',
        address: '海淀区中关村北大街',
        location: { lat: 40.0, lng: 116.3 },
      },
      {
        id: '3',
        title: '中关村软件园',
        address: '海淀区东北旺西路8号',
        location: { lat: 40.0, lng: 116.3 },
      },
    ]
    this.setData({
      historyList: history,
      list: history,
    })
  },

  // 获取用户当前位置 & 解析城市
  getUserLocation() {
    // 调起微信原生定位 API
    wx.getLocation({
      type: 'gcj02', // 国测局坐标系
      success: (res) => {
        // 【真实业务逻辑】：调用腾讯地图 reverseGeocoder 解析城市名称
        qqmapsdk.reverseGeocoder({
          location: { latitude: res.latitude, longitude: res.longitude },
          success: (geoRes) => {
            this.setData({ currentCity: geoRes.result.address_component.city })
          },
        })
        // 模拟请求成功，设定默认城市
        this.setData({ currentCity: '北京市' })
      },
      fail: () => {
        // 用户拒绝授权或定位失败时的兜底
        this.setData({ currentCity: '北京市' })
      },
    })
  },

  // === 输入与搜索逻辑 ===

  onInput(e) {
    const keyword = e.detail.value
    this.setData({ keyword })

    // 如果清空了输入框，恢复显示历史记录
    if (!keyword.trim()) {
      this.setData({ list: this.data.historyList })
      return
    }

    // 防抖机制：用户停止输入 500ms 后再发起网络请求，节省接口调用量
    if (this.searchTimer) clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.searchLocation(keyword)
    }, 500)
  },

  // 调用腾讯地图搜索接口
  searchLocation(keyword) {
    // 【真实业务逻辑】：调用地点搜索提示 API
    qqmapsdk.getSuggestion({
      keyword: keyword,
      region: this.data.currentCity, // 限定在当前选中的城市内搜索
      success: (res) => {
        this.setData({ list: res.data })
      },
    })

    // 模拟搜索结果返回 (根据关键词动态生成)
    const mockSearchList = [
      {
        id: 's1',
        title: `${keyword}大厦`,
        address: '北京市朝阳区某某路1号',
        location: { lat: 39.9, lng: 116.4 },
      },
      {
        id: 's2',
        title: `${keyword}购物中心`,
        address: '北京市海淀区某某路2号',
        location: { lat: 39.9, lng: 116.4 },
      },
    ]
    this.setData({ list: mockSearchList })
  },

  // === 交互操作 ===

  // 选中某一个地点
  onSelectLocation(e) {
    const item = e.currentTarget.dataset.item

    // 1. 将其保存到历史记录
    this.saveHistory(item)

    // 2. 设置全局状态并返回上一页
    const app = getApp()
    if (this.data.locationType === 'home') {
      app.globalData.homeData.address = item
    }
    if (this.data.locationType === 'home-waypoint') {
      app.globalData.homeData.waypoints.push(item)
    }
    if (this.data.locationType === 'company') {
      app.globalData.companyData.address = item
    }
    if (this.data.locationType === 'company-waypoint') {
      app.globalData.companyData.waypoints.push(item)
    }
    if (this.data.locationType === 'other-location') {
      app.globalData.otherLocations.push(item)
    }
    wx.navigateBack()

    wx.showToast({ title: `选中: ${item.title}`, icon: 'none' })
  },

  // 写入历史记录并去重
  saveHistory(item) {
    let history = wx.getStorageSync('locationHistory') || this.data.historyList

    // 去重：如果选中的地点已经在历史里，先把它删掉，然后再放到最前面
    history = history.filter((h) => h.title !== item.title)
    history.unshift(item)

    // 限制最多保存 10 条历史记录
    if (history.length > 10) history.pop()

    wx.setStorageSync('locationHistory', history)
    // 这里不再 setData，因为选中后通常会直接 navigateBack 离开当前页面
  },

  // 清除历史记录
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清除所有历史记录吗？',
      confirmColor: '#FF8C00',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('locationHistory')
          this.setData({ historyList: [], list: [] })
        }
      },
    })
  },

  // 取消按钮：返回上一页
  onCancel() {
    wx.navigateBack()
  },

  // 点击左侧城市
  onSelectCity() {
    wx.showToast({ title: '选择城市功能待开发', icon: 'none' })
  },
})
