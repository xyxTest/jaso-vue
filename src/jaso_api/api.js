import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    //PC端用户管理控制器

    /*列表获取*/
    getUserPcList(params) {
        return callApi('/JasoUser/select', params);
    }
    /*新增*/
    addUserPc(params){
        return callApi('/JasoUser/add',params);
    }
    /*删除*/
    deleteUserPc(params){
        return callApi('/JasoUser/delete',params);
    }
    /*用户角色List加载*/
    getRoleList(params){
        return callApi('/Role/selectList',params);
    }
    /*获取all用户角色*/
    getAllRoleList(params){
        return callApi('/Role/selectList',params);
    }
    /*用户详情加载(用户角色)*/
    getUserPcDetail(params){
        return callApi('/JasoUser/selectDetail',params);
    }
    /*用户的组织架构id查询*/
    getUserDepartmentList(params){
        return callApi('/JasoUser/selectDepartmentDetail',params);
    }
    getUserPcDepartmentTreeList(params){
        return callApi('/JasoUser/selectDepartmentTree',params);
    }
    /*组织架构列表加载*/
    getDepartmentList(params){
        return callApi('/Department/select',params);
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
    //意见反馈管理
    /*新增*/
    addFeedback(params){
        return callApi('/Feedback/add',params);
    }
    /*删除*/
    deleteFeedbackList(params){
        return callApi('/Feedback/delete',params);
    }
    /** 列表获取*/
    getFeedbackList(params){
        return callApi('/Feedback/select',params)
    }
     //新闻资讯管理
    /*新增*/
    addNewsInfo(params){
        return callApi('/NewsInfo/add',params);
    }
    /*删除*/
    deleteNewsInfoList(params){
        return callApi('/NewsInfo/delete',params);
    }
    /** 列表获取*/
    getNewsInfoList(params){
        return callApi('/NewsInfo/select',params)
    }
    //部门管理控制器
    //公用tree方法
    selectDepartmentTree(params){
        return callApi('/Department/selectTree',params);
    }
    selectMenuTree(params){
        return callApi('/Menu/selectTree',params);
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
    roleSetting(params){
        return callApi('/Role/roleSet',params);
    }
    selectRoleMenuList(params){
        return callApi('/Role/selectRoleMenuList',params);
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
    /*所有城市编码获取*/
    getAllCityCode(params){
        return callApi('/Project/getCityCode',params);
    }
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
    //////////////*楼栋管理*/////////////////////////
    /*列表获取*/
    getProjectBuildingList(params){
        return callApi('/ProjectBuilding/select',params);
    }
    /*通过项目id获取所有*/
    getAllProjectBuildingLists(params){
        return callApi('/ProjectBuilding/selectByPid',params);
    }
    /*添加、编辑楼栋*/
    addProjectBuilding(params){
        return callApi('/ProjectBuilding/add',params);
    }

    /*楼栋删除*/
    deleteProjectBuilding(params){
        return callApi('/ProjectBuilding/delete',params);
    }

    /*楼栋tree获取*/
    getProjectBuildingListTree(params){
        return callApi('/ProjectBuilding/selectTree',params);
    }
    //////////////*班组管理*////////////////////////////
    /*列表获取*/
    getProjectTeamsList(params){
        return callApi('/ProjectTeams/select',params);
    }
    /*添加班组*/
    addProjectTeams(params){
        return callApi('/ProjectTeams/add',params);
    }

    /*班组删除*/
    deleteProjectTeams(params){
        return callApi('/ProjectTeams/delete',params);
    }

    /*班组编辑*/
    updateProjectTeams(params){
        return callApi('/ProjectTeams/update',params);
    }
    //////////////*项目标段管理*////////////////////////////
    /*列表获取*/
    getProjectTendersList(params){
        return callApi('/ProjectTenders/select',params);
    }
    /*通过项目id所有标段获取*/
    getProjectTendersListByProjectId(params){
        return callApi('/ProjectTenders/selectList',params);
    }
    /*添加标段*/
    addProjectTenders(params){
        return callApi('/ProjectTenders/add',params);
    }

    /*标段删除*/
    deleteProjectTenders(params){
        return callApi('/ProjectTenders/delete',params);
    }

    /*标段编辑*/
    updateProjectTenders(params){
        return callApi('/ProjectTenders/update',params);
    }
    ////////////*检查项管理*/////////////
    /*新增*/
    addProjectCheckType(params){
        return callApi('/ProjectCheckType/add',params);
    }
    /** 删除*/
    deleteProjectCheckTypeList(params){
        return callApi('/ProjectCheckType/delete',params);
    }
    /** 列表获取*/
    getProjectCheckTypeList(params){
        return callApi('/ProjectCheckType/select',params)
    }
    /////////////////*检查性质管理*/////////////////////
     /*新增*/
     addNature(params){
        return callApi('/Nature/add',params);
    }
    /** 删除*/
    deleteNatureList(params){
        return callApi('/Nature/delete',params);
    }
    /** 列表获取*/
    getNatureList(params){
        return callApi('/Nature/select',params)
    }
    //////////////*项目图纸管理*/////////////////////////
      /*新增*/
    addProjectPaper(params){
        return callApi('/ProjectPaper/add',params);
    }
    /** 删除*/
    deleteProjectPaperList(params){
        return callApi('/ProjectPaper/delete',params);
    }
    /** 列表获取*/
    getProjectPaperList(params){
        return callApi('/ProjectPaper/select',params)
    }
    //////////////*物资管理*//////////////////
    /*物资列表获取*/
    getMaterialList(params){
        return callApi('/Material/select',params);
    }
    selectMaterialList(params){
        return callApi('/Material/selectList',params);
    }
    /*物资表单导入*/
    importMaterialList(formdata){
        return axios({
            url:'/Material/web/importMaterial',
            method:'post',
            data: formdata,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }
    /*物资新增*//*物资修改*/
    addMaterial(params){
        return callApi('/Material/add',params);
    }
    /*物资删除*/
    deleteMaterial(params){
        return callApi('/Material/delete',params);
    }
    //////////*物资分类*////////////
    /*物资分类获取*/
    getMaterialTypeList(params){
        return callApi('/MaterialType/select',params);
    }
    /*物资分类新增、更新*/
    addMaterialType(params){
        return callApi('/MaterialType/add',params);
    }
    /*物资分类删除*/
    deleteMaterialType(params){
        return callApi('/MaterialType/delete',params);
    }
    /////////////////////*物资出库、入库管理*///////////////////
    /*列表获取*/
    getMaterialLogList(params){
        return callApi('/MaterialLog/select',params);
    }
    /*记录删除*/
    deleteMaterialLog(params){
        return callApi('/MaterialLog/delete',params);
    }
    /*记录添加*/
    addMaterialLog(params){
        return callApi('/MaterialLog/add',params);
    }
    /*获取当前用户的角色*/
    getCurrentUserRoleType(params){
        return callApi('/MaterialLog/getRoleType',params);
    }
    ///////////////*物资分类管理*/////////////////////
    selectMaterialTypeList(params){
        return callApi('/MaterialType/selectPage',params);
    }
    //////////////*施工日志管理*///////////////////////
    /////////*施工日志*/////////
    /*列表获取*/
    getConstructLogList(params){
        return callApi('/ConstructLog/select',params);
    }
    /*添加、更新*/
    addConstructLog(params){
        return callApi('/ConstructLog/add',params)
    }
    deleteConstructLog(params){
        return callApi('/ConstructLog/delete',params);
    }
    // 施工日志导出
    exportConstructionLog(params) {
        return callApi('api/constructionLog/web/exportConstructionLog', params);
    }
    /*施工内容表单导入*/
    importConstructContentList(formdata){
        return axios({
            url:'/ConstructContent/web/importConstructContent',
            method:'post',
            data: formdata,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

    /////////*存在问题*/////////
    /*获取列表*/
    getExistingProblemList(params){
        return callApi('/ExistingProblem/select',params);
    }
    /*新增或修改*/
    addExistingProblem(params){
        return callApi('/ExistingProblem/add',params);
    }
    /*删除*/
    deleteExistingProblemList(params){
        return callApi('/ExistingProblem/delete',params);
    }
    /////////*工作内容类型*/////////
    /*获取列表*/
    getConstructContentTypeList(params){
        return callApi('/ConstructContentType/select',params);
    }
    /*新增或修改*/
    addConstructContentType(params){
        return callApi('/ConstructContentType/add',params);
    }
    /*删除*/
    deleteConstructContentTypeList(params){
        return callApi('/ConstructContentType/delete',params);
    }
    /////////*机械管理*/////////
    /*获取列表*/
    getMachineryList(params){
        return callApi('/Machinery/select',params);
    }
    /*新增或修改*/
    addMachinery(params){
        return callApi('/Machinery/add',params);
    }
    /*删除*/
    deleteMachineryList(params){
        return callApi('/Machinery/delete',params);
    }
    /////////*主材料管理*/////////
    /*获取列表*/
    getSubjectMaterialList(params){
        return callApi('/SubjectMaterial/select',params);
    }
    /*新增或修改*/
    addSubjectMaterial(params){
        return callApi('/SubjectMaterial/add',params);
    }
    /*删除*/
    deleteSubjectMaterialList(params){
        return callApi('/SubjectMaterial/delete',params);
    }
    /////////*权限分配*/////////
    /*列表获取*/
    getRoleConstructList(params){
        return callApi('/DepartmentConstruct/select',params);
    }
    //获取所有组织架构
    getCDepartmentList(params){
        return callApi('/Department/select',params);
    }
    //新增或修改
    addOrUpdateRoleConstruct(params){
        return callApi('/DepartmentConstruct/add',params);
    }
    //删除、全选删除
    deleteRoleConstructList(params){
        return callApi('/DepartmentConstruct/delete',params);
    }
    selectDepartmentProjectTree(params){
        return callApi('/Department/selectProjectTree',params);
    }
    /////////*施工内容管理*/////////
    /*列表获取*/
    getConstructContentList(params){
        return callApi('/ConstructContent/select',params);
    }
    /*所有查询*/
    getAllConstructContent(params){
        return callApi('/ConstructContent/selectList',params);
    }
    /*添加、新增、更新*/
    addConstructContent(params){
        return callApi('/ConstructContent/add',params);
    }
    /*删除*/
    deleteConstructContent(params){
        return callApi('/ConstructContent/delete',params);
    }
    getConstructContentTree(params){
        return callApi('/ConstructContent/selectTree',params);
    }
    formatDate(date) {
         let Y = date.getFullYear() + '-';
         let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
         let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
         let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
         let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
         let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
         return Y + M + D + h + m + s;
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