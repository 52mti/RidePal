Page({
  data: {
    passengerList: [
      { id: 301, name: '王先生', paxCount: 2, phone: '138-2394-8800', start: '理想城八期西门', end: '德胜门', slideX: 0, isBoarded: false },
      { id: 302, name: '李小姐', paxCount: 1, phone: '159-0012-7742', start: '静安寺地铁站 2号口', end: '虹桥机场T2航站楼', slideX: 0, isBoarded: false }
    ]
  },

  onLoad() {
    // 页面加载时，动态计算滑块滑到最右边的准确阈值
    this.initSlideThreshold();
  },

  // === 核心逻辑：动态计算滑动阈值 ===
  initSlideThreshold() {
    // 稍微延迟一下，确保 DOM 已经完全渲染
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('.slide-area').boundingClientRect(); // 获取外层容器宽度
      query.select('.slide-btn').boundingClientRect();  // 获取内部滑块宽度
      query.exec((res) => {
        if (res[0] && res[1]) {
          // 理论最大滑动距离 = 容器宽度 - 滑块宽度
          // 减去 5 像素作为容错空间，避免用户差一丝丝没拉到底就不触发
          this.slideThreshold = res[0].width - res[1].width - 5;
        } else {
          // 兜底方案：如果获取 DOM 失败，按照屏幕 rpx 比例计算个大概值
          const windowWidth = wx.getWindowInfo().windowWidth;
          this.slideThreshold = (630 - 76 - 15) * (windowWidth / 750);
        }
      });
    }, 300);
  },

  handleCall() { 
    wx.showToast({ title: '拨打电话...', icon: 'none' }); 
  },
  
  handleChat() { 
    wx.showToast({ title: '打开聊天...', icon: 'none' }); 
  },

  // === 监听滑动中 ===
  onSlideChange(e) {
    if (e.detail.source !== 'touch') return;
    const { x } = e.detail;
    const index = e.currentTarget.dataset.index;
    const passenger = this.data.passengerList[index];
    
    // 如果已经确认过，直接 return，防止重复触发
    if (passenger.isBoarded) return;

    // 1. 记录松手时的真实坐标，用于后续完美回弹
    if (!this.tempDropX) this.tempDropX = {};
    this.tempDropX[index] = x;

    // 2. 【修复核心】只更新背景进度条的 slideWidth，绝对不要在这里更新 slideX！
    this.setData({
      [`passengerList[${index}].slideWidth`]: x
    });

    // 3. 校验是否达到最右侧确认阈值
    const threshold = this.slideThreshold || 220; 
    if (x >= threshold) {
      const key = `passengerList[${index}].isBoarded`;
      this.setData({ [key]: true });
      wx.vibrateShort(); 
      wx.showToast({ title: '已确认上车', icon: 'success' });
    }
  },

  // === 监听手指松开 ===
  onSlideEnd(e) {
    const index = e.currentTarget.dataset.index;
    
    // 如果还没确认上车，说明中途放弃了，需要把滑块弹回起点
    if (!this.data.passengerList[index].isBoarded) {
      
      // 【修复核心】两步回弹法：避免因为 slideX 已经是 0 导致的数据不同步死锁
      const currentX = (this.tempDropX && this.tempDropX[index]) ? this.tempDropX[index] : 0;

      // 第一步：先让逻辑层的 slideX 和视图层的真实停留位置同步
      this.setData({ [`passengerList[${index}].slideX`]: currentX }, () => {
        
        // 第二步：在回调中强制归零，触发完美的物理回弹
        this.setData({ 
          [`passengerList[${index}].slideX`]: 0,
          [`passengerList[${index}].slideWidth`]: 0 
        });
        
      });
    }
  },

  // === 确认发车 ===
  handleDepart() {
    const allConfirmed = this.data.passengerList.every(p => p.isBoarded);
    if (!allConfirmed) {
      wx.showToast({ title: '还有乘客未确认上车', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '提示', 
      content: '确认立即发车吗？',
      confirmColor: '#FF8C00',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '发车成功', icon: 'success' });
          setTimeout(() => { wx.navigateBack(); }, 1500); 
        }
      }
    });
  }
});