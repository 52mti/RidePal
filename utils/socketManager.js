import eventBus from './eventBus'; // 引入我们上一轮写的全局分发器

class SocketManager {
  constructor() {
    this.socketTask = null;      // 微信 socket 实例
    this.isConnected = false;    // 当前连接状态
    this.url = 'ws://localhost:8080'; // 替换为你的服务器真实地址

    // 心跳与重连相关的定时器和配置
    this.heartbeatTimer = null;  
    this.reconnectTimer = null;  
    this.reconnectCount = 0;     // 当前已重连次数
    this.maxReconnect = 5;       // 最大重连次数
    this.lockReconnect = false;  // 重连锁，防止并发触发多次重连
  }

  // 1. 发起连接
  connect(token) {
    if (this.isConnected) return; // 如果已经连上了，直接 return

    // 注意：实际项目中，身份凭证 token 通常放在 url 参数或 header 里传给后端
    this.socketTask = wx.connectSocket({
      url: `${this.url}?token=${token}`,
      success: () => {
        console.log('🚀 发起 WebSocket 连接请求...');
      }
    });

    this.initEventHandle(); // 绑定监听事件
  }

  // 2. 绑定微信小程序的 Socket 事件
  initEventHandle() {
    // 连接成功
    this.socketTask.onOpen(() => {
      console.log('✅ WebSocket 连接已建立');
      this.isConnected = true;
      this.reconnectCount = 0;     // 重置重连次数
      this.lockReconnect = false;  // 解开重连锁
      
      this.startHeartbeat();       // 开启心跳
      
      // 告诉全量页面：网络通了！（可以用来拉取离线消息）
      eventBus.emit('SOCKET_OPEN'); 
    });

    // 收到消息
    this.socketTask.onMessage((res) => {
      const data = JSON.parse(res.data);
      
      // 如果后端回的是心跳包(pong)，直接忽略即可，证明活着
      if (data.type === 'pong') return; 
      
      // 其他业务消息，用大喇叭广播给 25 个页面！
      eventBus.emit('NEW_MESSAGE', data);
    });

    // 连接断开 (被微信杀后台、网络差等都会触发)
    this.socketTask.onClose(() => {
      console.log('❌ WebSocket 已断开');
      this.isConnected = false;
      this.reconnect(); // 触发重连机制
    });

    // 连接报错
    this.socketTask.onError((err) => {
      console.error('💥 WebSocket 发生错误', err);
      this.isConnected = false;
      this.reconnect();
    });
  }

  // 3. 心跳机制 (每 30 秒给后端发个 ping，证明自己还活着)
  startHeartbeat() {
    this.stopHeartbeat(); // 开启前先清空旧的，防止定时器内存泄漏
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'ping' });
      }
    }, 30 * 1000); // 30秒一次
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
  }

  // 4. 断网重连机制 (面试高光时刻：指数退避算法)
  reconnect() {
    // 如果已经被锁住，或者超过最大重连次数，就不连了
    if (this.lockReconnect || this.reconnectCount >= this.maxReconnect) {
      console.log('🛑 已达到最大重连次数，或正在重连中...');
      return;
    }
    
    this.lockReconnect = true; // 上锁，防止短时间内多次调用
    this.stopHeartbeat();      // 停掉心跳

    // 核心算法：1s, 2s, 4s, 8s, 16s 延迟重连，防止雪崩效应拖垮服务器
    const delay = Math.pow(2, this.reconnectCount) * 1000;
    this.reconnectCount++;

    console.log(`⏳ 准备第 ${this.reconnectCount} 次重连，延迟 ${delay} 毫秒...`);

    this.reconnectTimer = setTimeout(() => {
      this.lockReconnect = false; // 解锁
      const token = wx.getStorageSync('token'); // 拿出本地 token 重新连
      this.connect(token);
    }, delay);
  }

  // 5. 封装发送消息的方法 (给页面调用)
  send(data) {
    if (this.isConnected && this.socketTask) {
      this.socketTask.send({ data: JSON.stringify(data) });
    } else {
      console.error('⚠️ 当前处于断网状态，消息发送失败');
      // 进阶玩法：这里可以把发送失败的消息存进本地 Array（消息队列），等连上了再重发
    }
  }

  // 6. 主动断开连接 (退出登录时调用)
  close() {
    this.reconnectCount = this.maxReconnect; // 把次数打满，防止 onClose 触发自动重连
    this.stopHeartbeat();
    if (this.socketTask) {
      this.socketTask.close();
    }
  }
}

// 导出一个单例模式，保证全局只有一根管子
export default new SocketManager();