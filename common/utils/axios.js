const BASE_URL = 'https://live.tellai.tech/api/news_assistant';  // 替换成你的基础 API 地址
// const BASE_URL = 'http://192.168.0.107:5008';  // 替换成你的基础 API 地址
// 统一请求的配置
const request = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + options.url,  // 请求地址
            method: options.method || 'GET', // 默认 GET 请求
            timeout: options.timeout || 60000,
            data: options.data || {}, // 请求数据
            header: options.header || {
                'Content-Type': 'application/json',
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

const get = (url, data = {}, timeout = 60000, header = {}) => {
    return request({
        url,
        method: 'GET',
        timeout,
        data,
        header
    });
};

const post = (url, data = {}, timeout = 60000, header = {}) => {
    return request({
        url,
        method: 'POST',
        timeout,
        data,
        header
    });
};

const del = (url, data = {}, timeout = 60000, header = {}) => {
    return request({
        url,
        method: 'DELETE',
        timeout,
        data,
        header
    });
};

const put = (url, data = {}, timeout = 60000, header = {}) => {
    return request({
        url,
        method: 'PUT',
        timeout,
        data,
        header
    });
};

export default {
    get,
    post,
    del,
    put
};
