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
    /*用户的组织架构id查询*/
    getUserDepartmentList(params){
        return callApi('/UserPc/selectDepartmentDetail',params);
    }
    getUserPcDepartmentTreeList(params){
        return callApi('/UserPc/selectDepartmentTree',params);
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
    addUserApp(params){
        return callApi('/UserApp/add',params);
    }
    deleteUserApp(params){
        return callApi('/UserApp/delete',params);
    }

    getUserAppDetail(params){
        return callApi('/UserApp/selectDetail',params);
    }
    getUserAppDepartmentDetail(params){
        return callApi('/UserApp/selectDepartmentDetail',params);
    }
    //图片轮播管理
    /*列表获取*/
    getImageRotationList(params){
        return callApi("/ImageRotation/select",params);
    }
    addImageRotation(params){
        return callApi('/ImageRotation/add',params);
    }
    deleteImageRotation(params){
        return callApi('/ImageRotation/delete',params);
    }
    //部门管理控制器
    //公用tree方法
    selectDepartmentTree(params){
        return callApi('/Department/selectTree',params);
    }
    /*列表获取*/
    selectDepartmentByPid(params){
        return callApi('/Department/selectByPid',params);
    }
    addDepartment(params){
        return callApi('/Department/add',params);
    }
    addDepartments(params){
        return callApi('/Department/adds',params);
    }
    deleteDepartment(params){
        return callApi('/Department/delete',params);
    }
    updateDepartment(params){
        return callApi('/Department/update',params);
    }
    selectProjectLists(params){
        return callApi('/Project/selectList',params);
    }
    //角色管理控制器
    /*列表获取*/
    getRolePageList(params){
        return callApi( '/Role/select', params);
    }
    addRole(params){
        return callApi('/Role/add',params);
    }
    deleteRole(params){
        return callApi('/Role/delete',params);
    }
    updateRole(params){
        return callApi('/Role/update',params);
    }
    //菜单管理制器
    /*列表获取*/
    getMenuList(params){
        return callApi('/Menu/select',params);
    }
    addMenu(params){
        return callApi('/Menu/add',params);
    }
    deleteMenu(params){
        return callApi('/Menu/delete',params);
    }
    //项目管理控制器
    /*列表获取*/
    getProjectList(params){
        return callApi('/Project/select',params);
    }
    deleteProject(params){
        return callApi('/Project/delete',params);
    }
    addProject(params){
        return callApi('/Project/add',params);
    }
    updateProject(params){
        return callApi('/Project/update',params);
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