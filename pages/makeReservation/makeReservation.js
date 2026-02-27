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
    activeAlightingIndex: -1, // 默认不选中

    // ===== 确认订单弹窗相关状态 =====
    showConfirmPopup: false,
    passengerCount: 1,      // 乘车人数
    basePrice: 20,          // 单人座位费用
    serviceFee: 0.6,        // 平台服务费
    insuranceFee: 2.0,      // 保险费
    tipAmount: 0,           // 实际打赏金额
    activeTipIndex: -1,     // -1无，0:¥1, 1:¥2, 2:¥5, 3:其他
    customTip: '',          // 输入的其他金额
    tipInputFocus: false,   // 控制键盘弹起
    totalAmount: '0.00',    // 合计金额

    // ===== 选择地点弹窗(ActionSheet)相关状态 =====
    showActionSheet: false,
    actionSheetItems: [],
    pickingType: '', // 'boarding' 或 'alighting'
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

  // 1. 原有的预定按钮，改为弹出面板并计算初始金额
  onBookSeat() {
    if (this.data.activeBoardingIndex === -1 || this.data.activeAlightingIndex === -1) {
      wx.showToast({ title: '请先选择上下车点', icon: 'none' });
      return;
    }
    this.calculateTotal();
    this.setData({ showConfirmPopup: true });
  },

  // 关闭主面板
  onClosePopup() {
    this.setData({ showConfirmPopup: false });
  },

  // 2. 加减乘车人数
  onChangePassenger(e) {
    const step = parseInt(e.currentTarget.dataset.step);
    let newCount = this.data.passengerCount + step;
    if (newCount < 1) newCount = 1; 
    if (newCount > 4) newCount = 4; // 限制最多4人

    this.setData({ passengerCount: newCount }, () => {
      this.calculateTotal(); // 人数变了，重新算钱
    });
  },

  // 3. 互斥选择打赏金额
  onSelectTip(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const val = e.currentTarget.dataset.val;

    // 如果点击的是已经选中的项，则取消选中
    if (this.data.activeTipIndex === index && index !== 3) {
      this.setData({ activeTipIndex: -1, tipAmount: 0 }, this.calculateTotal);
      return;
    }

    let currentTip = 0;
    let focus = false;

    if (val === 'other') {
      currentTip = Number(this.data.customTip) || 0;
      focus = true; // 唤起键盘
    } else {
      currentTip = Number(val);
    }

    this.setData({
      activeTipIndex: index,
      tipAmount: currentTip,
      tipInputFocus: focus
    }, this.calculateTotal);
  },

  // 监听自定义金额输入
  onCustomTipInput(e) {
    // 过滤非数字
    let val = e.detail.value.replace(/[^0-9.]/g, ''); 
    this.setData({ 
      customTip: val,
      tipAmount: Number(val) || 0
    }, this.calculateTotal);
  },

  // 4. 核心算钱逻辑
  calculateTotal() {
    const { passengerCount, basePrice, serviceFee, insuranceFee, tipAmount } = this.data;
    // 小计 = (人数 * 座位费) + 服务费 + 保险费 + 打赏
    let total = (passengerCount * basePrice) + serviceFee + insuranceFee + tipAmount;
    
    // 保留两位小数，防止 JS 浮点数精度问题 (如 0.1+0.2=0.300000004)
    this.setData({
      totalAmount: total.toFixed(2)
    });
  },

  // 5. 弹窗内修改上下车点 (结合 ActionSheet)
  openLocationPicker(e) {
    const type = e.currentTarget.dataset.type;
    const points = type === 'boarding' ? this.data.boardingPoints : this.data.alightingPoints;
    
    // 组装 ActionSheet 需要的数据格式 { name: 'xxx', index: 0 }
    const actions = points.map((item, index) => ({
      name: item.name,
      index: index
    }));

    this.setData({
      pickingType: type,
      actionSheetItems: actions,
      showActionSheet: true
    });
  },

  onCloseActionSheet() {
    this.setData({ showActionSheet: false });
  },

  // 选中了新的地点
  onSelectActionSheetItem(e) {
    const selectedIndex = e.detail.index;
    const type = this.data.pickingType;

    if (type === 'boarding') {
      this.setData({ activeBoardingIndex: selectedIndex });
      this.updateMapLocation('boarding', selectedIndex); // 复用你之前的地图移动逻辑
    } else {
      this.setData({ activeAlightingIndex: selectedIndex });
      this.updateMapLocation('alighting', selectedIndex);
    }

    this.setData({ showActionSheet: false });
  },

  // 6. 唤起原生支付功能
  onPayNow() {
    wx.showLoading({ title: '拉起收银台', mask: true });

    // 模拟后端请求及唤起微信支付
    setTimeout(() => {
      wx.hideLoading();
      
      // 真实业务中，你需要用 wx.request 调用你的后端获取以下参数
      wx.requestPayment({
        timeStamp: '', // 必填
        nonceStr: '',  // 必填
        package: '',   // 必填 prepay_id
        signType: 'RSA', 
        paySign: '',   // 必填
        success: (res) => {
          wx.showToast({ title: '支付成功', icon: 'success' });
          this.setData({ showConfirmPopup: false });
        },
        fail: (err) => {
          // 这里是 Mock 演示，直接当作支付成功处理
          wx.showToast({ title: '模拟支付成功', icon: 'success' });
          this.setData({ showConfirmPopup: false });
          // wx.showToast({ title: '支付取消', icon: 'none' });
        }
      });
    }, 1000);
  }
});