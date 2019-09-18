import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: `http://localhost:8089/jaso`,
    //baseURL: `localhost:8089/jaso`,
    timeout: 30000
});
//request拦截器
axiosInstance.interceptors.request.use(function(config) {
    let url = config.url;
    /*console.log('access:' + url.substring(url.lastIndexOf('ejobapi/'), url.length) + "request data:")
    console.log(config.data)*/
    console.log(config.data);
    if (sessionStorage.getItem("token")) {
        config.headers.Authorization = "Bearer "+sessionStorage.getItem("token");
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});
//response拦截器
axiosInstance.interceptors.response.use(function(response) {
    if (response.status === 200) {
        let url = response.config.url;
        if (response.data.code !== 0) {
            /*if (response.data.code === 20009) {
                global.vue.$message({
                    type: 'error',
                    message: response.data.message
                });
                global.vue.$router.replace('/login');
            } else {
                global.vue.$message({
                    type: 'error',
                    message: response.data.message
                });
            }*/
        } else if (sessionStorage.getItem("token") != response.data.token) {
            if (response.data.token != null) {
                debugger
                sessionStorage.setItem("token", response.data.token);
                sessionStorage.setItem("user", response.data);
                if(response.data.companyId!==undefined){
                    sessionStorage.setItem("companyId",response.data.companyId)
                }
            }
        }
    } else {
       /* global.vue.$message({
            type: 'error',
            message: '异常访问！'
        });*/
    }
    return response.data;
}, function(error) {
    return Promise.reject(error);
});

export default axiosInstance;