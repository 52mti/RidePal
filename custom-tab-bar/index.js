Component({
  data: {
    active: 0,
    list: [
      "/pages/message/message",
      "/pages/contacts/contacts",
      "SERVICE_Popup", // 特殊标记，不跳转
      "/pages/me/me"
    ]
  },

  methods: {
    onChange(event) {
      const index = event.detail;
      const url = this.data.list[index];

      // 核心拦截逻辑：如果是第2个按钮（服务），不跳转，而是通知当前页面弹窗
      if (index === 2) {
        // 获取当前显示的页面实例
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        
        // 调用当前页面里定义的打开弹窗的方法
        if (currentPage && currentPage.openServiceMenu) {
          currentPage.openServiceMenu();
        }
        
        // 保持 Tabbar 选中状态不改变（或者根据需求改变）
        // this.setData({ active: index }); 
        return;
      }

      // 正常的页面跳转
      wx.switchTab({
        url: url,
        success: () => {
          // 跳转成功后，更新 active 状态（避免闪烁）
          this.setData({ active: index });
        }
      });
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route : '';
      // 根据当前页面路径高亮对应的 Tab
      const activeIndex = this.data.list.findIndex(item => item.includes(route));
      if (activeIndex !== -1) {
        this.setData({ active: activeIndex });
      }
    }
  }
});