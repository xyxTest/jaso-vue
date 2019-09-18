import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    //实测实量-编辑、新增
    addMeasurePaper(params){
        return callApi('/MeasurePaper/add',params);
    }
   
    //实测实量-删除
    deleteMeasurePaper(params){
        return callApi('/MeasurePaper/delete',params);
    }
    //实测实量-列表获取
    getMeasurePaperList(params){
        return callApi('/MeasurePaper/select',params);
    }
    //实测实量-图纸测点标注
    //////////*楼栋管理*/////////////
    /** 栋号列表获取*/
    getMeasureSiteBuildingList(params){
        return callApi('/MeasureSite/selectList',params);
    }
    /*根据楼栋号id获取下面的所有子节点*/
    getMeasureSiteListByPid(params){
        return callApi('/MeasureSite/selectListByPid',params);
    }
     /*根据楼栋号id获取下面的所有子节点*/
     getMeasureSiteListByPids(params){
        return callApi('/MeasureSite/selectListByPids',params);
    }
    /*楼栋添加*/
    addMeasureBuilding(params){
        return callApi('/MeasureSite/add',params);
    }
    /*实测实量楼栋信息列表获取*/
    getMeasureBuildingList(params){
        return callApi('/MeasureSite/selectList',params);
    }
    /*项目图纸列表信息获取*/
    getMeasurePaperLists(params){
        return callApi('/MeasurePaper/selectList',params);
    }
    /*实测实量楼栋添加*/
    addMeasureSite(params){
        return callApi('/MeasureSite/add',params)
    }
    /*实测实量楼栋删除*/
    deleteMeasureSite(params){
        return callApi('/MeasureSite/delete',params)
    }
    /*检查项列表获取*/
    getProjectCheckTypeLists(params){
        return callApi('/ProjectCheckType/selectList',params);
    }
    /*测点添加*/
    addMeasurePoint(params){
        return callApi('/MeasurePoint/add',params);
    }
    /*实测实量爆点清单*/
    //指派
    //(1)获取当前项目的所有用户id
    getListByProjectId(params){
        return callApi('/JasoUser/getListByProjectId',params);
    }
    //(2)指派接口
    updateMeasureProblem(params){
        return callApi('/MeasureProblem/add',params);
    }
    //(3)整改接口
    rectifyMeasureProblem(params){
        return callApi('/MeasureProblem/setProcess',params);
    }
    //(4)验收接口
    checkMeasureProblem(params){
        return callApi('/MeasureProblem/check',params);
    }
    //列表获取接口
    getMeasureProblemList(params){
        return callApi('/MeasureProblem/select',params);
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