import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    //施工任务单列表获取接口
    getConstrctionTaskList(params){
        return callApi('bim.jaso.com.cn/api/taskSheets/taskList',params);
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