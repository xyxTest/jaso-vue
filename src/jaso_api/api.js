import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    //PC端用户管理控制器

    /*列表获取*/
    getUserPcList(params) {
        return callApi('/UserPc/select', params);
    }
    /*新增*/
    addUserPc(params){
        return callApi('/UserPc/add',params);
    }
    /*删除*/
    deleteUserPc(params){
        return callApi('/UserPc/delete',params);
    }
    /*用户角色List加载*/
    getRoleList(params){
        return callApi('/Role/selectList',params);
    }
    /*用户详情加载(用户角色)*/
    getUserPcDetail(params){
        return callApi('/UserPc/selectDetail',params);
    }
    /*组织架构列表加载*/
    getDepartmentList(params){
        return callApi('/Department/select',params);
    }
    //APP端用户管理控制器
    /*列表获取*/
    getUserAppList(params){
        return callApi('/UserApp/select', params);
    }
    //图片轮播管理
    /*列表获取*/
    getImageRotationList(params){
        return callApi("/ImageRotation/select",params);
    }
    //部门管理控制器
    /*列表获取*/

    //角色管理控制器
    /*列表获取*/
    getRolePageList(params){
        return callApi( '/Role/select', params);
    }

    //菜单管理制器
    /*列表获取*/
    getMenuList(params){
        return callApi('/Menu/select',params);
    }
    //项目管理控制器
    /*列表获取*/
    getProjectList(params){
        return callApi('/Project/select',params);
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