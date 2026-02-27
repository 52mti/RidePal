Component({
  data: {
    dateList: [], 
    driveList: [
      { id: 101, time: '今天 08:30', status: '待出发', statusClass: 'tag-blue', start: '万科云城', end: '科技园', driverName: '李先生', carInfo: '特斯拉 Model 3 · 粤B***88' },
    ]
  },

  lifetimes: {
    attached() {
      // 组件挂载时生成日期
      this.generateDates();
    }
  },

  methods: {
    generateDates() {
      const dateList = [];
      const today = new Date();
      const weekMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

      for (let i = 0; i < 4; i++) {
        const targetDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
        const day = targetDate.getDate().toString().padStart(2, '0');
        const weekIndex = targetDate.getDay();

        dateList.push({
          id: i + 1,
          week: i === 0 ? 'TODAY' : weekMap[weekIndex],
          day: i === 0 ? '今天' : `${month}-${day}`,
          active: i === 0
        });
      }
      this.setData({ dateList });
    },

    selectDate(e) {
      const id = e.currentTarget.dataset.id;
      const newList = this.data.dateList.map(item => ({
        ...item, active: item.id === id
      }));
      this.setData({ dateList: newList });
    },

    goToDriveDetail() {
      wx.navigateTo({ url: '/pages/drive-detail/drive-detail' });
    },

    cancelItinerary(e) {
      wx.showModal({
        title: '取消行程',
        content: '确定要取消您的发车计划吗？',
        confirmColor: '#FF8C00',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({ title: '行程已取消', icon: 'success' });
          }
        }
      });
    },

    handleCall() {
      wx.showToast({ title: '拨打电话...', icon: 'none' });
    },

    handleChat() {
      wx.showToast({ title: '打开聊天窗口...', icon: 'none' });
    }
  }
});