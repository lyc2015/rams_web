// src/service/request.js
import axios from 'axios';
import config from './config';

const instance = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: config.headers,
  withCredentials: config.withCredentials,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 比如添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务器返回的错误
      switch (error.response.status) {
        case 401:
          // 未授权，重定向到登录页
          window.location.href = '/login';
          break;
        case 403:
          // 无权限
          // alert('您没有权限进行此操作');
          break;
        case 500:
          // 服务器错误
          // alert('服务器错误，请稍后再试');
          break;
        default:
          // alert(error.response.data.message || '请求失败');
      }
    } else {
      // 网络错误或请求超时
      // alert('网络错误或请求超时，请检查您的网络连接');
    }
    return Promise.reject(error);
  }
);

export default instance;
