import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8080',  // APIアドレス
    timeout: 10000,  // 请求超时时间
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        // リクエストを送信する前に何をすべきか
        config.data = JSON.stringify(config.data);
        config.headers = {
            "Content-Type": "application/json",
        };
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        const res = response;

        console.log(res);

        // 根据你的业务处理回调
        if (res.status !== 200) {
            // 处理错误
            // ...
            console.log("error", res);
            return Promise.reject(new Error(res || 'Error'));
        } else {
            return res.data;
        }

    },
    error => {
        // 对响应错误做点什么
        console.log('err' + error);  // for debug
        return Promise.reject(error);
    }
);

export default http;
