Page({
  data: {
    statusBarHeight: 20, // 默认状态栏高度
    
    // 地图中心点坐标 (默认北京天安门附近)
    mapCenter: {
      lat: 39.9042,
      lng: 116.4074
    },
    markers: [], // 地图标记点

    // 上车点数据 (加入模拟经纬度用于地图联动)
    boardingPoints: [
      { name: '京华佳苑', lat: 39.915, lng: 116.404 },
      { name: '特校路口', lat: 39.920, lng: 116.410 },
      { name: '廊坊市中医医院', lat: 39.910, lng: 116.390 },
      { name: '摩托大楼', lat: 39.925, lng: 116.405 },
      { name: '银河大桥', lat: 39.930, lng: 116.415 },
      { name: '豪邸坊', lat: 39.905, lng: 116.420 },
      { name: '兴安市场', lat: 39.918, lng: 116.385 },
      { name: '富强小区', lat: 39.922, lng: 116.395 },
      { name: '钰海嘉苑', lat: 39.912, lng: 116.412 }
    ],
    activeBoardingIndex: 0, // 当前选中的上车点索引

    // 下车点数据
    alightingPoints: [
      { name: '西土城地铁站', lat: 39.976, lng: 116.353 },
      { name: '十里河地铁站', lat: 39.865, lng: 116.458 }
    ],
    activeAlightingIndex: -1 // 默认不选中
  },

  onLoad() {
    // 获取状态栏高度以适配刘海屏
    const windowInfo = wx.getWindowInfo();
    this.setData({
      statusBarHeight: windowInfo.statusBarHeight
    });

    // 初始化：将地图中心点设置为默认选中的第一个上车点，并添加 marker
    this.updateMapLocation('boarding', 0);
  },

  // === 互斥单选与地图联动逻辑 ===

  // 选择上车点
  onSelectBoarding(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ 
      activeBoardingIndex: index,
      // 保证上/下车组互不干扰，如果业务需要选择上车时取消下车选择，可在此解开下面注释
      // activeAlightingIndex: -1 
    });
    this.updateMapLocation('boarding', index);
  },

  // 选择下车点
  onSelectAlighting(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ 
      activeAlightingIndex: index,
      // activeBoardingIndex: -1 
    });
    this.updateMapLocation('alighting', index);
  },

  // 更新地图中心点和 Marker
  updateMapLocation(type, index) {
    let pointData;
    let labelText;
    let markerColor; // 气泡颜色

    if (type === 'boarding') {
      pointData = this.data.boardingPoints[index];
      labelText = '上 ' + pointData.name;
      markerColor = '#FF8C00'; // 橙色
    } else {
      pointData = this.data.alightingPoints[index];
      labelText = '下 ' + pointData.name;
      markerColor = '#4A5A6A'; // 深蓝灰
    }

    // 设置中心点和 Marker 气泡
    this.setData({
      mapCenter: {
        lat: pointData.lat,
        lng: pointData.lng
      },
      markers: [{
        id: 1,
        latitude: pointData.lat,
        longitude: pointData.lng,
        width: 30,
        height: 30,
        // 定制气泡标签 (模仿高保真图的白底彩字)
        callout: {
          content: labelText,
          color: markerColor,
          fontSize: 14,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 8,
          display: 'ALWAYS',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
      }]
    });

    // 创建平滑移动效果
    const mapCtx = wx.createMapContext('routeMap');
    mapCtx.moveToLocation({
      latitude: pointData.lat,
      longitude: pointData.lng
    });
  },

  // === 按钮原生交互逻辑 ===

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 拨打司机电话
  callDriver() {
    wx.makePhoneCall({
      phoneNumber: '13800138000', // 替换为真实的司机号码
      success() {
        console.log('拨打电话成功');
      },
      fail() {
        console.log('拨打电话取消/失败');
      }
    });
  },

  // 跳转到消息/聊天页面
  goToMessage() {
    wx.navigateTo({
      url: '/pages/chat/chat' // 替换为您实际的路由路径
    });
  },

  // 点击预定按钮
  onBookSeat() {
    wx.showToast({
      title: '正在为您预定...',
      icon: 'loading',
      duration: 1500
    });
    // TODO: 提交订单逻辑
  }
});