import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    //安全检查单-编辑、新增
    addSecurityCheck(params){
        return callApi('/SecurityCheck/add',params);
    }
   
    //安全检查单-列表获取
    getSecurityCheckList(params){
        return callApi('/SecurityCheck/selectByPage',params);
    }
      //质量检查单删除
    deleteSecurityCheckList(params){
        return callApi('/SecurityCheck/delete',params);
    }
    //质量检查单接受、设置紧急程度接口
    updateSecurityCheck(params){
        return callApi('/SecurityCheck/update',params)
    }
    //质量检查单设置整改进度接口
    setSecurityCheckProcess(params){
        return callApi('/SecurityCheck/setProcess',params)
    }
     //指派
    //(1)获取当前项目的所有用户id
    getListByProjectId(params){
        return callApi('/JasoUser/getListByProjectId',params);
    }
    //质量检查单指派整改
    sendRectifyUserList(params){
        return callApi('/SecurityCheck/send',params);
    }
    //质量检查单验收接口
    checkSecurity(params){
        return callApi('/SecurityCheck/check',params)
    }
    //检查性质列表获取
    getNatureList(params){
        return callApi('/Nature/selectList',params);
    }
    //安全管理-奖惩单添加
    addSecurityFine(params){
        return callApi('/SecurityFine/add',params);
    }
    //安全管理-相关人责任列表获取//检查指定人列表获取
    getAboutUserList(params){
        return callApi('/JasoUser/getUserListByProjectId',params);
    }
    //安全管理-相关单位列表获取
    getAboutDepartmentList(params){
        return callApi('/Department/selectDepartmentByProjectId',params);
    }
    //安全管理-奖惩单列表获取
    getSecurityFine(params){
        return callApi('/SecurityFine/select',params);
    }
    //安全管理-奖惩单删除
    deleteSecurityFine(params){
        return callApi('/SecurityFine/delete',params);
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