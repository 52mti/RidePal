Page({
  data: {
    mapInfo: {
      longitude: 116.335384, // 模拟中心点经度
      latitude: 39.773539,   // 模拟中心点纬度 (西红门附近)
      markers: [
        {
          id: 1,
          longitude: 116.332000,
          latitude: 39.778000,
          iconPath: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', // 请替换为您项目中实际的车辆图标路径
          width: 40,
          height: 40,
          // 司机标记的汽泡 (橙色)
          callout: {
            content: '司驾中',
            color: '#ffffff',
            bgColor: '#FF8C00',
            padding: 6,
            borderRadius: 12,
            display: 'ALWAYS',
            textAlign: 'center'
          }
        },
        {
          id: 2,
          longitude: 116.335384,
          latitude: 39.773539,
          iconPath: '', // 请替换为您项目中实际的蓝色圆点图标路径
          width: 20,
          height: 20,
          // 乘客上车点标记的汽泡 (白色底色)
          callout: {
            content: ' 您的上车点：西红门医院 ',
            color: '#333333',
            bgColor: '#ffffff',
            padding: 10,
            borderRadius: 8,
            display: 'ALWAYS',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        }
      ]
    }
  },

  onLoad() {
    // 页面加载逻辑
  },

  handleCall() {
    wx.showToast({ 
      title: '拨打司机电话...', 
      icon: 'none' 
    });
  },

  handleChat() {
    wx.showToast({ 
      title: '打开聊天窗口...', 
      icon: 'none' 
    });
  }
});