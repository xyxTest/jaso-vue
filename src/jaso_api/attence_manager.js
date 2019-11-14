import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    /** 考勤地点管理*/
    //考勤地点添加、编辑
    addAttencePlace(params){
        return callApi('/AttencePlace/add',params);
    }
     //考勤地点删除
    deleteAttencePlace(params){
        return callApi('/AttencePlace/delete',params);
    }
     //考勤地点列表获取
     getAttencePlaceList(params){
        return callApi('/AttencePlace/select',params);
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