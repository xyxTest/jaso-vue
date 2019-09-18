import axios from './config'
class ProjectManagerApi {
    callApi(url, params) {
        return callApi(url, params);
    }
    //PC端用户管理控制器

    /*列表获取*/
    getUserPcList(params) {
        return callApi('/UserPc/select', params);
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
const api = new ProjectManagerApi();
export default api;