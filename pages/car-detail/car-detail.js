Page({
  data: {
    // 页面列表渲染数据 (高度贴合设计图)
    carList: [
      {
        id: 1,
        brand: '别克',
        model: '君越',
        color: '黑色',
        plate: '豫C 1GM68',
        seats: '4/5',
        statusCode: 'approved',
        statusText: '审核通过'
      },
      {
        id: 2,
        brand: '大众',
        model: '帕萨特',
        color: '银色',
        plate: '豫C 88888',
        seats: '4/5',
        statusCode: 'pending',
        statusText: '待审核'
      }
    ]
  },

  onLoad(options) {
    // 页面初始化逻辑
  },

  // =============== 交互方法 ===============

  // 点击编辑车辆
  handleEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ 
      title: `正在编辑车辆 ID: ${id}`, 
      icon: 'none' 
    });
    // 实际开发中应该跳转到编辑页面：
    // wx.navigateTo({ url: `/pages/car-edit/index?id=${id}` });
  },

  // 点击删除车辆
  handleDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该车辆信息吗？',
      confirmColor: '#ee0a24',
      success: (res) => {
        if (res.confirm) {
          // 模拟前端删除逻辑
          const newList = this.data.carList.filter(item => item.id !== id);
          this.setData({ carList: newList });
          
          wx.showToast({ 
            title: '删除成功', 
            icon: 'success' 
          });
        }
      }
    });
  },

  // 点击添加车辆
  handleAddCar() {
    wx.showToast({ 
      title: '跳转添加车辆页', 
      icon: 'none' 
    });
    // 实际开发中跳转：
    // wx.navigateTo({ url: '/pages/car-add/index' });
  }
});