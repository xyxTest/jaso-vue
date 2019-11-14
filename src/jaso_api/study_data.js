import axios from './config'
class Api {
    callApi(url, params) {
        return callApi(url, params);
    }
    /** 工种类型管理*/
    //工种类型添加、编辑
    addStudyWorkerType(params){
        return callApi('/StudyWorkerType/add',params);
    }
    //工种类型删除
    deleteStudyWorkerType(params){
        return callApi('/StudyWorkerType/delete',params);
    }
     //工种类型列表获取
    getStudyWorkerTypeList(params){
        return callApi('/StudyWorkerType/select',params);
    }
    //所有工种类型获取
    getAllStudyWorkerTypeList(params){
        return callApi('/StudyWorkerType/selectList',params);
    }
    /**学习资料管理 */
    //学习资料新增
    addStudyFile(params){
        return callApi('/StudyFile/add',params);
    }
     //学习资料删除
     deleteStudyFile(params){
        return callApi('/StudyFile/delete',params);
    }
     //学习资料列表获取
    getStudyFileList(params){
        return callApi('/StudyFile/select',params);
    }

    /**学习题目管理 */
      //学习题目新增
      addStudyData(params){
        return callApi('/StudyData/add',params);
    }
     //学习题目删除
     deleteStudyData(params){
        return callApi('/StudyData/delete',params);
    }
     //学习题目列表获取
    getStudyDataList(params){
        return callApi('/StudyData/select',params);
    }
    /*学习模块的轮播图片*/
    //学习的轮播图片新增
    addStudyImage(params){
        return callApi('/StudyImage/add',params);
    }
   
    //学习的轮播图片删除
    deleteStudyImage(params){
        return callApi('/StudyImage/delete',params);
    }
    //学习的轮播图片查找
    getStudyImageList(params){
        return callApi('/StudyImage/select',params)
    }
    /**学习试卷管理*/
    //试卷新增
    addStudyPaper(params){
        return callApi('/StudyPaper/add',params);
    }
    //试卷删除
    deleteStudyPaper(params){
        return callApi('/StudyPaper/delete',params);
    }
    //列表获取
    getStudyPaperList(params){
        return callApi('/StudyPaper/select',params);
    }
    //试题导入
    importStudyData(params){
        return callApi('/StudyData/import',params);
    }
    ////学习事件管理
    //学习事件新增
    addStudyEvent(params){
        return callApi('/StudyEvent/add',params);
    }
    //学习事件删除
    deleteStudyEvent(params){
        return callApi('/StudyEvent/delete',params);
    }
    //学习事件列表获取
    getStudyEventList(params){
        return callApi('/StudyEvent/select',params);
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