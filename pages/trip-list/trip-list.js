Page({
  data: {
    currentTab: 1 // 默认选中"拼车记录"
  },

  onTabChange(event) {
    this.setData({ 
      currentTab: event.detail.index 
    });
  }
});