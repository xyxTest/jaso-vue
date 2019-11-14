<template>
    <div>
         <el-dialog title="工作进度进度设置" :visible.sync="dialogProcessVisible" width="40%">
            <el-form :model="processform" status-icon ref="processform">
                <el-form-item label="进度" :label-width="formLabelWidth" prop="process">
                    <div class="block" style="width:83%">
                        <el-slider v-model="processform.process"></el-slider>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetProcessForm('processform')">取 消</el-button>
                <el-button type="primary" @click="submitProcessForm('processform')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="工作任务接受" :visible.sync="dialogAcceptVisible" width="40%">
            <el-form :model="acceptForm" status-icon ref="acceptForm">
                <el-form-item label="接受" :label-width="formLabelWidth" prop="state">
                     <el-switch
                        v-model="acceptForm.isAccept"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetAcceptForm('processForm')">取 消</el-button>
                <el-button type="primary" @click="submitAcceptForm('processForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="工作任务单验收" :visible.sync="dialogCheckVisible" width="40%">
            <el-form :model="checkform" status-icon ref="checkform">
                <el-form-item label="验收结果" :label-width="formLabelWidth" prop="state">
                     <el-switch
                        v-model="checkform.type"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="评分" :label-width="formLabelWidth" prop="score">
                    <div class="block" style="padding-top:10px;">
                        <el-rate v-model="checkform.score"></el-rate>
                    </div>
                </el-form-item>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetCheckForm('form')">取 消</el-button>
                <el-button type="primary" @click="submitCheckForm('form')">确 定</el-button>
            </div>
        </el-dialog>
         <el-dialog title="工作任务单新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="工作任务单名称" :label-width="formLabelWidth" prop="taskTopic">
                    <el-input v-model="form.taskTopic" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="工作任务单详情" :label-width="formLabelWidth" prop="taskDetail">
                    <el-input  type="textarea" :rows="2" placeholder="请输入详情" v-model="form.taskDetail" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="日期" :label-width="formLabelWidth" prop="taskTime">
                    <el-date-picker v-model="form.taskTime" type="date" placeholder="选择日期" autocomplete="off" style="width:83%" />
                </el-form-item>
               <el-form-item label="执行人" :label-width="formLabelWidth" prop="workTaskUsers">
                    <el-select v-model="form.workTaskUsers" multiple placeholder="请选择指定人" style="width:83%">
                        <el-option
                                v-for="item in informUserList"
                                :key="item.jasoUserId"
                                :label="item.userRealName"
                                :value="item.jasoUserId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="重要程度" :label-width="formLabelWidth" prop="state">
                    <el-select v-model="form.state" placeholder="请选择" style="width:83%">
                        <el-option
                                v-for="item in stateList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth" prop="imageFiles">
                    <el-upload
                            class="upload-demo"
                            action="http://jasobim.com:8085/api/files/uploadFiles"
                            :on-success="returnList"
                            name="file"
                            v-model="form.imageFiles"
                            auto-upload
                            list-type="picture"
                            :file-list="fileList"
                            multiple>
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-button type="primary" style="margin:10px 30px;float:right; " @click="openAddPage">新增</el-button>
        <!-- 新增弹出框底层 -->
        <el-button type="danger" @click="deleteSelect" style="margin:10px 5px; float:right;">删除选中</el-button>
        <el-table
                :data="tableData"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
             <el-table-column
                    prop="projectName"
                    label="所属项目">
            </el-table-column>
            <el-table-column
                    prop="taskTopic"
                    label="任务标题">
            </el-table-column>
            <el-table-column
                    prop="userRealName"
                    label="创建人">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态">
                <template slot-scope="scope">
                    <template>
                        {{statusList[scope.row.status-1].name}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    :formatter="formatDate">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="setAccept(scope.row)" v-if="scope.row.status==1">接受</el-button>
                    <el-button type="text" @click="setRectifyProcess(scope.row)" v-if="scope.row.status==2">整改</el-button>
                    <el-button type="text" @click="setCheck(scope.row)" v-if="scope.row.status==3">验收</el-button>
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
</template>

<script>
    import workTaskManager from '../../jaso_api/work_task.js';
    import measureManager from '../../jaso_api/measure_manager.js';
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    export default {
        data() {
            return {
                stateList:[{name:'一般',value:1},{name:'重要',value:2},{name:'紧急',value:3}],
                statusList:[{name:'待接受',value:1},{name:'进行中',value:2},{name:'待验收',value:3},{name:'已完成',value:4}],
                informUserList:[],
                fileList:[],
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                actionStatus: 'edit',
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogTypeFormVisible:false,
                dialogProcessVisible:false,//整改进度
                dialogAcceptVisible:false,//接受
                dialogCheckVisible:false,//验收
                typeFormList:{
                    name:''
                },
                checkform: {
                    workTaskId:'',
                    score:0,
                    type:true
                },
                acceptForm:{
                     workTaskId:'',
                     isAccept:true
                },
                processform:{
                    workTaskId:'',
                    process:''
                },
                form: {
                    startDate:'',
                    qualityCheckName:'',
                    workTaskUsers:[],
                    workTaskUserList:[],
                    state:'',
                    taskTopic:'',
                    taskDetail:'',
                    taskTime:'',
                    projectId:'',
                    imageFiles:''
                },
                informUserInfo:{jasoUserId:'',userRealName:''},
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: []
            }
        },
        methods: {
             returnList(response, file, fileList){
                this.form.imageFiles=response.data[0];
            },	
            //接受取消
            resetAcceptForm(){
                this.dialogAcceptVisible=false;
            },
            //接受提交
            submitAcceptForm(){
                debugger
                if(this.acceptForm.isAccept==true){
                    this.acceptForm.isAccept=1;
                }
                if(this.acceptForm.isAccept==false){
                    this.acceptForm.isAccept=2;
                }
                 workTaskManager.acceptWorkTask(this.acceptForm).then(res =>{
                    this.initDatas();
                     this.dialogAcceptVisible=false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //整改指派取消
            resetRectifyForm(rectifyform){
                this.dialogMeasureProblemVisible = false;
            },
            //验收取消
            resetCheckForm(){
                this.dialogCheckVisible=false;
            },
            //设置进度取消
            resetProcessForm(){
                this.dialogProcessVisible=false;
            },
            //整改进度提交
            submitProcessForm(){
                workTaskManager.setProcess(this.processform).then(res =>{
                    this.initDatas();
                    this.dialogProcessVisible=false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //验收结果提交
            submitCheckForm(form){
                debugger
                if(this.checkform.type==false){
                    this.checkform.type=2;
                }
                if(this.checkform.type==true){
                    this.checkform.type=1;
                }
                workTaskManager.checkWorkTask(this.checkform).then(res =>{
                    this.initDatas();
                    this.dialogCheckVisible=false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },          
            //整改按钮
            setRectifyProcess(row){
                this.processform.workTaskId=row.workTaskId;
                this.dialogProcessVisible=true;
            },
            //接受按钮
            setAccept(row){
                this.acceptForm.workTaskId=row.workTaskId;
                this.dialogAcceptVisible=true;
            },
            //验收接口
            setCheck(row){
                this.checkform.workTaskId=row.workTaskId;
                this.dialogCheckVisible=true;
            },
            formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                return this.api.formatDate(date);
            },
        
             handleTypeAdd() {
                // 验证表单
                this.checkTypeDetailList.push(this.typeFormList);
             },
            
            //搜索
           
            //新增页面
            openAddPage(){
                if(this.utils.checkProject(this)){
                    this.getSendUserList();
                    this.dialogFormVisible = true;
                }
            },
           
            //指定人列表获取
            getSendUserList(){
                var projectId = sessionStorage.getItem("projectId");
                var companyId=0;
                measureManager.getListByProjectId({"projectId":projectId,"companyId":companyId}).then(res =>{
                    this.informUserList=res.data;
                }).catch(res =>{

                });
            },
            resetFormType(form){
                this.dialogTypeFormVisible = false;
            },
            resetForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
            },
            
            //提交
            submit(form){
                debugger
                this.form.projectId=sessionStorage.getItem("projectId");
                for(var i=0;i<this.form.workTaskUsers.length;i++){
                    this.informUserInfo={};
                    this.informUserInfo.jasoUserId=this.form.workTaskUsers[i];
                    for(var j=0;j<this.informUserList.length;j++){
                        if(this.form.workTaskUsers[i]==this.informUserList[j].jasoUserId){
                            this.informUserInfo.userRealName=this.informUserList[j].userRealName;
                        }
                    }
                    this.form.workTaskUserList.push(this.informUserInfo);
                }
                debugger
                workTaskManager.addWorkTask(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                workTaskManager.deleteWorkTask(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                workTaskManager.deleteWorkTask([row]).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            initDatas(){
               workTaskManager.getWorkTaskList({
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    }
                }).then(res => {
                    debugger
                    this.tableData=res.data.data;
                    this.page.total=res.data.page.total;
                }).catch(res => {

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
        }
    }
</script>