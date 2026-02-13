// 引入腾讯地图SDK (请根据实际路径修改)
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
let qqmapsdk

let searchTimer
Page({
  data: {
    searchValue: '',
    searchInputFocus: false,
    suggestion: [], // 存放联想结果
    latitude: 39.908823, // 默认北京
    longitude: 116.39747,
    selectedPoints: [], // 已选中的位置列表
    markers: [], // 地图标记
  },

  onLoad() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'I73BZ-3MTLU-KS7VI-BZMVI-7NSX6-KJB5J', // 必填
    })
    this.initLocation()
  },

  // 初始化当前位置
  initLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
    })
  },

  // 点击地图选择位置
  onMapTap(e) {
    const { latitude, longitude } = e.detail

    // 逆地址解析：根据坐标获取具体名称
    qqmapsdk.reverseGeocoder({
      location: { latitude, longitude },
      success: (res) => {
        const point = {
          title: res.result.formatted_addresses.recommend || '未知位置',
          address: res.result.address,
          latitude,
          longitude,
        }
        this.addPointToList(point)
      },
    })
  },

  // 添加到列表并更新Marker
  addPointToList(point) {
    const points = this.data.selectedPoints
    const markers = this.data.markers

    points.push(point)
    markers.push({
      id: markers.length,
      latitude: point.latitude,
      longitude: point.longitude,
      title: point.title,
      iconPath: '/images/map-marker.png', // 需要准备一个图标
      width: 30,
      height: 30,
    })

    this.setData({
      selectedPoints: points,
      markers: markers,
    })

    wx.showToast({ title: '添加成功', icon: 'none' })
  },

  // 删除选定点
  removePoint(e) {
    const index = e.currentTarget.dataset.index
    let points = this.data.selectedPoints
    let markers = this.data.markers
    points.splice(index, 1)
    markers.splice(index, 1)
    this.setData({ selectedPoints: points, markers: markers })
  },

  // 搜索框输入处理
  onSearch(e) {
    const val = this.data.searchValue
    if (!val) return

    // 地理位置搜索
    qqmapsdk.getSuggestion({
      keyword: val,
      success: (res) => {
        // 这里可以弹窗让用户选搜索结果，或者取第一个
        if (res.data.length > 0) {
          const first = res.data[0]
          this.setData({
            latitude: first.location.lat,
            longitude: first.location.lng,
          })
        }
      },
    })
  },

  onSearchChange(e) {
    const value = e.detail
    this.setData({ searchValue: value })

    // 清除之前的计时器
    clearTimeout(searchTimer)

    if (!value.trim()) {
      this.setData({ suggestion: [] })
      return
    }

    // 设置防抖，300ms 后执行搜索
    searchTimer = setTimeout(() => {
      this.getTips(value)
    }, 300)
  },

  // 调用腾讯地图接口获取建议
  getTips(keyword) {
    qqmapsdk.getSuggestion({
      keyword: keyword,
      region: '北京', // 可限制城市，不填则全国搜索
      success: (res) => {
        this.setData({
          suggestion: res.data,
        })
      },
      fail: (err) => {
        console.error(err)
      },
    })
  },

  // 点击建议列表中的某一项
  selectSuggestion(e) {
    const item = e.currentTarget.dataset.item

    // 1. 将选中的点添加到你的列表中
    const point = {
      title: item.title,
      address: item.address,
      latitude: item.location.lat,
      longitude: item.location.lng,
    }
    this.addPointToList(point)

    // 2. 清空建议列表并移动地图中心
    this.setData({
      suggestion: [],
      searchValue: '',
      latitude: item.location.lat,
      longitude: item.location.lng,
    })
  },
})
