import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    //PC端施工日志控制器
    //施工日志基本信息获取
    //(1)当前用户施工日志权限获取//1、工人 2、施工员 3、班组长 4、其他
    getConstructLogRole(params){
        return callApi('/ConstructLog/getRoleType',params);
    }
    //工人区域（生产情况）
        //（1）施工部位获取
        //（2）施工内容获取
    //施工员区域（施工内容+施工进度）
        /*施工内容*/
            //(1)内容分类获取
            getAllConstructContentType(params){
                return callApi('/ConstructContentType/selectList',params);
            }
        /*施工进度*/
            //班组获取
            getAllProjectTeam(params){
                return callApi('/ProjectTeams/selectList',params);
            }
    //班组长（生产情况+机械主材）
        /*机械主材*/
            //(1)all存在问题获取接口
            getAllExistingProblem(params){
                return callApi('/ExistingProblem/selectList',params);
            }
            //(2)all次日主材获取
            getAllSubjectMaterial(params){
                return callApi('/SubjectMaterial/selectList',params);
            }
            //(3)all机械获取
            getAllMachinery(params){
                return callApi('/Machinery/selectList',params);
            }
        /*生产情况*/
            /*施工部位结构树获取*/
            getProjectBuildingTree(params){
                return callApi('/ProjectBuilding/selectTree',params)
            }
            /*根据当前角色-施工内容获取*/
            getConstructContentByRole(params){
                return callApi('/DepartmentConstruct/selectList',params);
            }
    //其他（事务处理）
   
    //日志添加
    addConstructLog(params){
        return callApi('/ConstructLog/add',params);
    }
    //日志列表获取
    getConstructLogList(params){
        return callApi('/ConstructLog/select',params);
    }
    //日志删除
    deleteConstructLog(params){
        return callApi('/ConstructLog/delete',params);
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