// src/service/config.js
const config = {
    baseURL: 'https://api.example.com', // 替换为实际的 API 地址
    timeout: 10000, // 设置超时时间
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false, // 是否携带跨域请求的 cookie
    // 其他需要的配置
  };
  
  export default config;
  