// src/service/config.js
const config = {
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false, // 是否携带跨域请求的 cookie
    // 其他需要的配置
  };
  
  export default config;
  