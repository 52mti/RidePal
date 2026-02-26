// utils/eventBus.js
class EventBus {
  constructor() {
    this.events = {}; // 存放所有的频道和听众
  }

  // 1. 订阅频道 (Page使用)
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 2. 广播消息 (WebSocket收到消息时调用)
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }

  // 3. 取消订阅 (离开页面时必须调用，防止内存泄漏！)
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }
  }
}

export default new EventBus();