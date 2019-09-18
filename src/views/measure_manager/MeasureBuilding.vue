<!--suppress ALL -->
<template>
  <div>
    <div>
         <!--楼层区域新增-->
         <el-dialog title="楼层区域添加" :visible.sync="dialogSiteVisible" width="40%">
            <el-form :model="siteForm" status-icon ref="buildingForm">
                <el-form-item label="楼层选择" :label-width="formLabelWidth">
                    <el-select v-model="siteForm.measureSiteId" placeholder="请选择楼层" style="width:83%">
                        <el-option
                                v-for="item in buildingLists"
                                :key="item.measureSiteId"
                                :label="item.measureSiteName"
                                :value="item.measureSiteId">
                        </el-option>
                    </el-select>
                 </el-form-item>
                <el-form-item label="房间区域" :label-width="formLabelWidth">
                   <el-table
                            :data="tableSiteData"
                            border
                            :show-header="false"
                            :row-class-name="tableRowClassName">                    
                        <el-table-column
                            v-for="(item, index) in columnNames"
                            :key="index"
                            :prop="'id_' + index" > 
                                <template slot-scope="scope" v-if="scope.row[`name_${index}`] || scope.row.header">
                                    <el-checkbox v-model="checkAll[index]" @change="dddd('id_' + index)" v-if="scope.row.header" >{{scope.row[`name_${index}`]}}</el-checkbox>
                                    <el-checkbox v-model="checkContent[scope.row.map['id_' + index].measureSiteId + '']"  v-else>{{scope.row[`name_${index}`]}}</el-checkbox>
                                </template>
                        </el-table-column>
                        
                    </el-table>
                </el-form-item>
                <el-form-item label="专业类型" :label-width="formLabelWidth">
                    <el-select v-model="siteForm.majorType" style="width:83%">
                        <el-option
                                v-for="item in siteTypeLists"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图纸选择" :label-width="formLabelWidth">
                    <el-select v-model="siteForm.measurePaperId" style="width:83%" >
                        <el-option
                                v-for="item in measurePaperLists"
                                :key="item.measurePaperId"
                                :label="item.measurePaperName"
                                :value="item.measurePaperId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetSiteForm('siteForm')">取 消</el-button>
                <el-button type="primary" @click="submitSite('siteForm')">确 定</el-button>
            </div>
        </el-dialog>
       <!--楼栋新增-->
         <el-dialog title="楼栋管理" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="buildingForm" status-icon ref="buildingForm">
                <el-form-item label="所属项目" :label-width="formLabelWidth" prop="projectId">
                    <el-select v-model="buildingForm.projectId" placeholder="请选择项目" style="width:83%" @change="getMeasureSiteAllList">
                        <el-option
                                v-for="item in projectList"
                                :key="item.projectId"
                                :label="item.projectName"
                                :value="item.projectId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼栋名称" :label-width="formLabelWidth" prop="measurePaperName" v-if="buildingList">
                    <el-select v-model="buildingForm.measureSiteId" placeholder="请选择楼栋" style="width:83%">
                        <el-option
                                v-for="item in buildingList"
                                :key="item.measureSiteId"
                                :label="item.measureSiteName"
                                :value="item.measureSiteId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('buildingForm')">取 消</el-button>
                <el-button type="primary" @click="submit('buildingForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹出框底层 -->
        <el-button type="danger" @click="deleteSelect" style="margin:10px 5px; float:right;">删除选中</el-button>
        <el-button type="primary" style="margin:10px 30px;float:right; " @click="openAddPage">楼栋管理</el-button>
        <el-button type="primary" style="margin:10px 30px;float:right; " @click="openAddSitePage" v-if="selected">添加区域</el-button>
    </div>
    <div style="float:left">
        <image-record-left :buildingDataList="buildingDataList" @nowItem='newItem' :nowSelectd="selectIndex" style="margin-top:60px;width: 20%;"/>
    </div>
    <div style="float:left;width: 80%;">
        <el-table
                :data="tableData"
                border
                :row-class-name="tableRowClassName">
            <el-table-column
                    prop="measureSiteName"
                    label="楼层区域">
            </el-table-column>
            <el-table-column
                    prop="majorType"
                    label="专业类型">
                    <template>
                        {{'设备安装'}}
                    </template>
            </el-table-column>
            <el-table-column
                    prop="measureNum"
                    label="测量点">
            </el-table-column>
            <el-table-column
                    prop="userRealName"
                    label="检查人">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    show-overflow-tooltip
                    :formatter="formatDate">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" style="color:red;" @click="deleteSelects(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total">
            </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
    import measureManager from '../../jaso_api/measure_manager.js';
    import ImageRecordLeft from './components/ImageRecordLeft';
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    export default {
        components:{
            ImageRecordLeft
        },
        data() {
            return {
                checkAll: {},
                checkContent: {},
                selectIndex: 0,
                floorListTabulatedData:[],
                tableSiteData:[],
                columnNames: [],
                floorListTitle:[],
                buildingList:[],
                siteInfoList:[],
                buildingDataList:[],
                showBuildingDataList:[],
                siteTypeLists:[{name:"设备安装",value:1}],
                siteTypeList:[{name:"楼栋",value:1},{name:"楼层",value:2},{name:"房间号",value:3}],
                options:["设备安装","土建"],
                statusList:["未标注","已标注"],
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogSiteVisible: false,
                projectList: [],
                buildingLists:[],
                siteInfoLosts:[],
                measurePaperLists:[],
                buildingForm: {
                    measureSiteId:'',
                    measureSiteName: '',
                    projectId: '',
                    majorType: 1,
                    siteType:1,
                    projectBuildingId:''
                },
                siteForm: {
                    measureSiteId:'',
                    measureSiteName: '',
                    pid:'',
                    projectId: '',
                    projectBuilding:[],
                    measurePaperId:'',
                    majorType:1
                },
                fileList:[],
                checkBoxMap:[],
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                selected:'',
                chooses: []
            }
        },
        methods: {
            formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                return this.api.formatDate(date);
            },
            dddd(key){  
                for (let i = 1; i < this.tableSiteData.length; i ++) {
                    if (this.tableSiteData[i].map[key]) {
                        this.checkContent[this.tableSiteData[i].map[key].measureSiteId + ''] = true
                    }
                } 
            },
            newItem(data) { 
                this.selected = data
                 /*楼层房间号获取*/
                 this.initDatas();
            },
            /*实测实量通过楼栋号获取下面的值*/
            /*楼栋栋号列表获取*/
            getMeasureSiteAllList(){
                measureManager.getMeasureSiteBuildingList({"siteType":1,"checkedStatus":0,"projectId":this.buildingForm.projectId}).then(res =>{
                    this.buildingList=res.data;
                }).catch(res =>{

                });
            },
            /*实测实量楼栋列表获取*/
            getMeasureSiteBuildingList(){
                var projectId= JSON.parse(window.sessionStorage.getItem('projectId'));
                measureManager.getMeasureBuildingList({"siteType":1,"projectId":projectId,"checkedStatus":1}).then(res =>{
                    debugger
                    this.buildingDataList=res.data;
                    if (this.buildingDataList.length){
                        this.selected = this.buildingDataList[0]
                    }
   
                }).catch();
            },
            addBuildingList(){

            },
            setPoint(){

            },
           formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                return this.api.formatDate(date);
            },
            returnList(response, file, fileList){
                this.form.paperUrl=response.data[0];
                console.log('file',file)
                console.log('fileList',fileList)
            },	
            //新增楼栋页面
            openAddPage(){
                this.dialogFormVisible = true;
            },
            
            //新增楼层区域页面
            openAddSitePage(){
                this.dialogSiteVisible = true;
                /*项目图纸列表获取*/
                measureManager.getMeasurePaperLists({"projectId":this.selected.projectId}).then(res =>{
                    this.measurePaperLists = res.data;
                }).catch(res =>{

                });
                /*楼层房间号获取*/
                measureManager.getMeasureSiteListByPids({"pid":this.selected.projectBuildingId,"checkedStatus":0}).then(res =>{
                        debugger
                        this.siteInfoList=res.data;
                        //楼层获取
                        this.siteInfoList.forEach(element => {
                            if(element.siteType==2){
                                this.buildingLists.push(element);
                            } 
                        });
                        let checkBoxMaps = [];
                        let checkContent = []
                        let max = 0
                        //房间号排序（根据楼层）
                        console.log('this.buildingLists',this.buildingLists)
                        for(var i=0;i<this.buildingLists.length;i++){ 
                            let map = {}, arr = {} ,index = 0; 

                            for(var j=0;j<this.siteInfoList.length;j++){
                                if(this.buildingLists[i].measureSiteId==this.siteInfoList[j].pid){
                                    checkContent[this.siteInfoList[j].measureSiteId + ''] = false
                                    arr[`id_${index}`]=this.siteInfoList[j].measureSiteId;  
                                    arr[`name_${index}`]=this.siteInfoList[j].measureSiteName;
                                    map[`id_${index ++}`] = this.siteInfoList[j] 
                                }
                            }
                            if (index > max) max = index
                            arr.map = map

                            checkBoxMaps.push(arr);
                        }
                        console.log("checkBoxMaps",checkBoxMaps,this.checkContent);
                        this.checkContent = checkContent
                        this.columnNames = new Array(max)
                        this.tableSiteData =  [{header: true, map: {chooseAll: true}}, ...checkBoxMaps]

                }).catch(res =>{

                });
            },
            resetForm(buildingForm) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
            },
            resetSiteForm(siteForm){
                this.dialogSiteVisible = false;
            },
            updateMachinery(row){
                //编辑页面
                this.form = Object.assign({}, row);
                this.dialogFormVisible = true;
            },
            submitSite(siteForm){
                //search list item
                let resultList = []
                for (let i = 1; i < this.tableSiteData.length; i ++) {
                    for (let key in this.tableSiteData[i].map) {
                        if (this.checkContent[this.tableSiteData[i].map[key].measureSiteId + '']) {
                            resultList.push(this.tableSiteData[i].map[key])
                        }
                    }
                }
                debugger
                for( let j=0;j<this.buildingLists.length;j++){
                    if(this.siteForm.measureSiteId==this.buildingLists[j].measureSiteId){
                        resultList.push(this.buildingLists[j]);
                    }
                }
                for(let k=0;k<resultList.length;k++){
                    resultList[k].measurePaperId=this.siteForm.measurePaperId;
                }
                measureManager.addMeasureSite(resultList).then(res =>{
                     this.dialogSiteVisible = false;
                     this.initDatas();
                     this.siteForm={};
                }).catch(res =>{

                });
            },
            //提交
            submit(buildingForm){
                debugger
                console.log("this.buildingList",this.buildingList)
                console.log("this.buildingForm",this.buildingForm)
                for(var i=0;i<this.buildingList.length;i++){
                    if(this.buildingList[i].measureSiteId===this.buildingForm.measureSiteId){
                        this.buildingForm.measureSiteName=this.buildingList[i].measureSiteName;
                        this.buildingForm.projectBuildingId=this.buildingList[i].projectBuildingId;
                    }
                }
                measureManager.addMeasureBuilding([this.buildingForm]).then(res =>{
                    this.getMeasureSiteBuildingList();
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                measureManager.deleteMeasureSite(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                measureManager.deleteMeasureSite([row]).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getProjectList(){
                let userInfo = JSON.parse(sessionStorage.getItem("user"));
                this.api.selectProjectLists({
                    "companyId":userInfo.companyId
                }).then(res => {
                    debugger
                    this.projectList=res.data;
                }).catch(res => {

                });
            },
            initDatas(){
                 /*楼层房间号获取*/
                measureManager.getMeasureSiteListByPid({"pid":this.selected.projectBuildingId,"checkedStatus":1}).then(res =>{
                        debugger
                        this.tableData=res.data;
                }).catch(res =>{

                });
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            },
            handleSizeChange(val) {
                pageParams.page.pageSize = val
                this.initDatas()
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                pageParams.page.pageNo = val
                this.initDatas()
                console.log(`当前页: ${val}`);
            }
        },
        mounted() {
            this.initDatas();
            this.getProjectList();
            this.getMeasureSiteBuildingList();
        }
    }

</script>

<style lang="scss" scoped>
  .topWork {
    div {
      padding-left: 10px;
    }
    span {
      color: #DCDFE6;
      padding-left: 10px;
    }
  }
  .leftBuildingManagementTitle{
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    height: 40px;
    line-height: 40px;
    margin-top: -10px;
    color: #909399;
    span {
      margin-left: 20px;
    }
  }
  .leftBuildingManagement {
    border-bottom: 1px solid #dcdfe6;
    height: 40px;
    line-height: 40px;
    color: #303133;
    cursor: pointer;
    &:hover {
      background-color: #F2F6FC;
    }
    span {
      margin-left: 20px;
    }
    i {
      /*padding-left: 30px;*/
      &:hover{
        cursor: pointer;
      }
    }
  }
</style>
