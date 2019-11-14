import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    /** 工作任务单管理*/
    //工作任务添加
    addWorkTask(params){
        return callApi('/WorkTask/add',params);
    }
    //接受
    acceptWorkTask(params){
        return callApi('/WorkTask/accept',params);
    }
    //设置进度
    setProcess(params){
        return callApi('/WorkTask/setProcess',params);
    }
    //验收
    checkWorkTask(params){
        return callApi('/WorkTask/check',params);
    }
    //删除
    deleteWorkTask(params){
        return callApi('/WorkTask/delete',params)
    }
    //获取列表
    getWorkTaskList(params){
        return callApi('/WorkTask/select',params);
    }
}


function callApi(url, param) {
    if (typeof(param) == 'undefined' || param == null) {
        param = {};
    }
    return axios.post(url, param).catch(response => {
        globalException(response);
        return Promise.reject(response);
    })
}

function globalException(response) {

}
const api = new Api();
export default api;