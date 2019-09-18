import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    //质量检查单-编辑、新增
    addQualityCheck(params){
        return callApi('/QualityCheck/add',params);
    }
    //质量检查单删除
    deleteQualityCheckList(params){
        return callApi('/QualityCheck/delete',params);
    }
   
    //质量检查单-列表获取
    getQualityCheckList(params){
        return callApi('/QualityCheck/selectByPage',params);
    }
    //质量检查单接受、设置紧急程度接口
    updateQualityCheck(params){
        return callApi('/QualityCheck/update',params)
    }
    //质量检查单设置整改进度接口
    setQualityCheckProcess(params){
        return callApi('/QualityCheck/setProcess',params)
    }
    //质量检查单指派整改
    sendRectifyUserList(params){
        return callApi('/QualityCheck/send',params);
    }
    //质量检查单验收接口
    checkQuality(params){
        return callApi('/QualityCheck/check',params)
    }
    //检查性质列表获取
    getNatureList(params){
        return callApi('/Nature/selectList',params);
    }
    //质量管理-奖惩单添加
    addQualityFine(params){
        return callApi('/QualityFine/add',params);
    }
    //质量管理-相关人责任列表获取//检查指定人列表获取
    getAboutUserList(params){
        return callApi('/JasoUser/getUserListByProjectId',params);
    }
    //质量管理-相关单位列表获取
    getAboutDepartmentList(params){
        return callApi('/Department/selectDepartmentByProjectId',params);
    }
    //质量管理-奖惩单列表获取
    getQualityFine(params){
        return callApi('/QualityFine/select',params);
    }
    //质量管理-奖惩单删除
    deleteQualityFine(params){
        return callApi('/QualityFine/delete',params);
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