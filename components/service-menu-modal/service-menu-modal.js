Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 控制弹窗显示
    show: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    // 服务频道配置 (预留配置入口，支持Scroll)
    services: [
      { id: 1, name: '拼车', icon: 'logistics' }, // 使用vant内置图标模拟
      { id: 2, name: '同城货运', icon: 'shop-collect-o' },
      { id: 3, name: '顺风车', icon: 'guide-o' },
      { id: 4, name: '代驾', icon: 'manager-o' },
      { id: 5, name: '租车', icon: 'logistics' },
      { id: 6, name: '二手车', icon: 'cart-o' },
      { id: 7, name: '车辆保养', icon: 'setting-o' },
      { id: 8, name: '违章查询', icon: 'warn-o' },
      // 测试滚动功能：第9个之后的项目需要滚动才能看到
      { id: 9, name: '加油优惠', icon: 'fire-o' },
      { id: 10, name: 'ETC办理', icon: 'card-o' },
    ],
  },
  methods: {
    // 关闭服务菜单
    onClose() {
      this.triggerEvent('close')
    },

    // 点击具体服务
    onSelect(e) {
      const item = e.currentTarget.dataset.item
      // 1. 关闭弹窗
      this.onClose()
      // 2. 将选中的项抛出给父页面，父页面决定怎么跳转
      this.triggerEvent('select', item)

      // 或者直接在这里处理通用跳转逻辑
      console.log('点击了服务：', item.name)
    },
  },
})
