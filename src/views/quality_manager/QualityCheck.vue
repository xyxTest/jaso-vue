<template>
    <div>
        <el-select v-model="search.type" placeholder="检查单状态" style="width: 180px; margin:10px 5px;  ">
            <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="search.type" placeholder="检查单类型" style="width: 180px; margin:10px 5px;  ">
            <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="search.type" placeholder="检查单程度" style="width: 180px; margin:10px 5px;  ">
            <el-option
                    v-for="item in stateList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-button type="primary" style="margin:10px 5px; " @click="searchQualityCheck">搜索</el-button>
        <el-dialog title="质量检查单指派" :visible.sync="dialogMeasureProblemVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="整改人" :label-width="formLabelWidth" prop="rectifyUserIds">
                    <el-select v-model="rectifyform.rectifyUserIds" multiple placeholder="请选择" style="width:83%">
                        <el-option
                                v-for="item in rectifyUserList"
                                :key="item.jasoUserId"
                                :label="item.userRealName"
                                :value="item.jasoUserId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参与人" :label-width="formLabelWidth" prop="participantsIds">
                    <el-select v-model="rectifyform.participantsIds" multiple placeholder="请选择" style="width:83%">
                        <el-option
                                v-for="item in rectifyUserList"
                                :key="item.jasoUserId"
                                :label="item.userRealName"
                                :value="item.jasoUserId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="检查名称" :label-width="formLabelWidth" prop="checkName">
                    <span>{{rectifyform.qualityCheckName}}</span>
                </el-form-item>
                <el-form-item label="整改截止日期" :label-width="formLabelWidth" prop="finishedDate">
                     <div class="block">
                        <el-date-picker
                        v-model="rectifyform.finishedDate"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetRectifyForm('rectifyform')">取 消</el-button>
                <el-button type="primary" @click="submitRectify('rectifyform')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="质量整改进度设置" :visible.sync="dialogProcessVisible" width="40%">
            <el-form :model="processform" status-icon ref="processform">
                <el-form-item label="整改人" :label-width="formLabelWidth" prop="rectifyUserIds">
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
        <el-dialog title="质量检查单指派接受" :visible.sync="dialogAcceptVisible" width="40%">
            <el-form :model="acceptForm" status-icon ref="acceptForm">
                <el-form-item label="接受" :label-width="formLabelWidth" prop="state">
                     <el-switch
                        v-model="acceptForm.isAccept"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="重要程度" :label-width="formLabelWidth" prop="state">
                    <el-select v-model="acceptForm.state" placeholder="请选择" style="width:83%">
                        <el-option
                                v-for="item in stateList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetAcceptForm('processForm')">取 消</el-button>
                <el-button type="primary" @click="submitAcceptForm('processForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="质量验收" :visible.sync="dialogCheckVisible" width="40%">
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
        <el-dialog title="质量检查单检查项编辑" :visible.sync="dialogTypeFormVisible" width="30%">
            <el-form :model="checkTypeform" status-icon ref="checkTypeform">
                <el-form-item label="是否合格" :label-width="formLabelWidth" prop="natureName">
                    <el-switch
                        v-model="checkTypeform.state"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="任务描述" :label-width="formLabelWidth" prop="natureName">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="checkTypeform.describe">
                    </el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth" prop="projectIcon">
                    <el-upload
                            class="upload-demo"
                            action="http://jasobim.com:8085/api/files/uploadFiles"
                            :on-success="returnList"
                            name="file"
                            auto-upload
                            list-type="picture"
                            :file-list="fileList"
                            multiple>
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetFormType('checkTypeform')">取 消</el-button>
                <el-button type="primary" @click="submitType('checkTypeform')">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="质量检查单新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="质量检查单名称" :label-width="formLabelWidth" prop="qualityCheckName">
                    <el-input v-model="form.qualityCheckName" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="检查性质" :label-width="formLabelWidth" prop="natureId">
                    <el-select v-model="form.natureId" placeholder="请选择性质" style="width:83%">
                        <el-option
                                v-for="item in natureList"
                                :key="item.natureId"
                                :label="item.natureName"
                                :value="item.natureId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指定人" :label-width="formLabelWidth" prop="informUserList">
                    <el-select v-model="form.informUserIds" multiple placeholder="请选择指定人" style="width:83%">
                        <el-option
                                v-for="item in informUserList"
                                :key="item.jasoUserId"
                                :label="item.userRealName"
                                :value="item.jasoUserId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" :label-width="formLabelWidth" prop="natureName">
                    <el-date-picker
                        v-model="form.createTime"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否通过" :label-width="formLabelWidth" prop="type">
                    <el-switch
                        v-model="form.type"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="检查项" :label-width="formLabelWidth" prop="">
                    <div>
                        <el-table :data="checkTypeDetailList">
                            <el-table-column align="center"  label="序号" type="index" ></el-table-column>
                            <el-table-column align="center" label="检查项名称" prop="name" ></el-table-column>
                            <el-table-column align="center" >
                                <template slot-scope="scope">
                                    <div class="operation-btns">
                                        <el-button type="primary"  :disabled="actionStatus !== 'edit'" size="small" @click="handleLogDetailEdit(scope.row)">编辑</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="threeTableDiv_select" style="margin-bottom:15px">
                        <el-input v-model="typeFormList.name"  placeholder="检查项名称" class="selectWidth" ></el-input>
                    </div>
                    <div class="threeTableDiv_button">
                        <el-button type="primary" icon="el-icon-plus" @click="handleTypeAdd()">添加检查项</el-button>
                    </div>
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
                    prop="qualityCheckName"
                    label="检查单名称">
            </el-table-column>
            <el-table-column
                    prop="userRealName"
                    label="创建人">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="通过与否">
                <template slot-scope="scope">
                    <template>
                        {{typeList[scope.row.type-1].name}}
                    </template>
                </template>
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
                    <el-button type="text" @click="setRectifyUser(scope.row)" v-if="scope.row.status==1">指派</el-button>
                    <el-button type="text" @click="setAccept(scope.row)" v-if="scope.row.status==2">接受</el-button>
                    <el-button type="text" @click="setRectifyProcess(scope.row)" v-if="scope.row.status==3">整改</el-button>
                    <el-button type="text" @click="setCheck(scope.row)" v-if="scope.row.status==4">验收</el-button>
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
    import qualityManager from '../../jaso_api/quality_manager.js';
    import measureManager from '../../jaso_api/measure_manager.js';
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    export default {
        data() {
            return {
                stateList:[{name:'一般',value:1},{name:'重要',value:2},{name:'紧急',value:3}],
                typeList:[{name:'通过',value:1},{name:'不通过',value:2}],
                statusList:[{name:'待指派',value:1},{name:'待接受',value:2},{name:'进行中',value:3},{name:'待验收',value:4},{name:'已完成',value:5}],
                natureList:[],
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
                dialogMeasureProblemVisible:false,//整改指派
                options:[
                    {"value":1,"name":"质量管理"},
                    {"value":2,"name":"安全管理"}],
                optionsList:[ "质量管理","安全管理"],
                typeFormList:{
                    name:''
                },
                checkform: {
                    qualityCheckId:'',
                    score:0,
                    type:true
                },
                acceptForm:{
                     qualityCheckId:'',
                     state:'',
                     isAccept:true
                },
                processform:{
                    qualityCheckId:'',
                    process:''
                },
                rectifyform:{
                    rectifyUserList:[],//整改人
                    participantsList:[],//参与人
                    rectifyUserIds:[],
                    participantsIds:[],
                    qualityCheckName:'',
                    finishedDate:'',
                    qualityCheckId:'',
                    state:''
                },
                form: {
                    startDate:'',
                    qualityCheckName:'',
                    informUserIds:[],
                    informUserList:[],
                    checkTypeList:[],
                    type: '',
                    projectId:'',
                    createTime:'',
                    natureId:''
                },
                checkTypeform:{
                    name:'',
                    projectId:'',
                    type:1,
                    aboutId:'',
                    projectCheckTypeId:'',
                    state:'',
                    describe:'',
                    imageFiles:''
                },
                search: {
                    natureId:'',
                    type:'',
                    status:'',
                    state:''
                },
                informUserInfo:{jasoUserId:'',userRealName:''},
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                checkTypeDetailList:[],
                rectifyUserList:[]
          
            }
        },
        methods: {
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
                 qualityManager.updateQualityCheck(this.acceptForm).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
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
                qualityManager.setQualityCheckProcess(this.processform).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
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
                qualityManager.checkQuality(this.checkform).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //整改指派提交
            submitRectify(rectifyform){
                debugger
                for(var i=0;i<this.rectifyform.rectifyUserIds.length;i++){
                    this.informUserInfo={};
                    this.informUserInfo.jasoUserId=this.rectifyform.rectifyUserIds[i];
                    for(var j=0;j<this.rectifyUserList.length;j++){
                        if(this.rectifyform.rectifyUserIds[i]==this.rectifyUserList[j].jasoUserId){
                             this.informUserInfo.userRealName=this.rectifyUserList[j].userRealName;
                        }
                    }
                    this.rectifyform.rectifyUserList.push(this.informUserInfo);
                }
                for(var i=0;i<this.rectifyform.participantsIds.length;i++){
                    this.informUserInfo={};
                    this.informUserInfo.jasoUserId=this.rectifyform.participantsIds[i];
                    for(var j=0;j<this.rectifyUserList.length;j++){
                        if(this.rectifyform.participantsIds[i]==this.rectifyUserList[j].jasoUserId){
                             this.informUserInfo.userRealName=this.rectifyUserList[j].userRealName;
                        }
                    }
                    this.rectifyform.participantsList.push(this.informUserInfo);
                }
                debugger
                qualityManager.sendRectifyUserList(this.rectifyform).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
             //获取整改人列表
            getRectifyUserList(){
                var projectId = sessionStorage.getItem("projectId");
                var companyId=0;
                measureManager.getListByProjectId({"projectId":projectId,"companyId":companyId}).then(res =>{
                    this.rectifyUserList=res.data;
                }).catch(res =>{

                });
            },
            //指派按钮
            setRectifyUser(row){
                this.rectifyform.qualityCheckId=row.qualityCheckId;
                this.rectifyform.qualityCheckName = row.qualityCheckName;
                this.dialogMeasureProblemVisible=true;
                this.getRectifyUserList();
            },
            //整改按钮
            setRectifyProcess(row){
                this.processform.qualityCheckId=row.qualityCheckId;
                this.dialogProcessVisible=true;
            },
            //接受按钮
            setAccept(row){
                this.acceptForm.qualityCheckId=row.qualityCheckId;
                this.dialogAcceptVisible=true;
            },
            //验收接口
            setCheck(row){
                this.checkform.qualityCheckId=row.qualityCheckId;
                this.dialogCheckVisible=true;
            },
            formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                return this.api.formatDate(date);
            },
            searchQualityCheck(){
                
            },
             handleTypeAdd() {
                // 验证表单
                this.checkTypeDetailList.push(this.typeFormList);
             },
            handleLogDetailEdit(params){
                const detailList = [];
                this.checkTypeDetailList.forEach((item) => {
                    if (item.index !== params.index) {
                        item.index = detailList.length;
                        detailList.push(item);
                    }
                });
                this.checkTypeDetailList = detailList;
                this.checkTypeform.name=params.name
                this.dialogTypeFormVisible=true;
            },
             returnList(response, file, fileList){
                 debugger
                if(this.checkTypeform.imageFiles==null){
                    this.checkTypeform.imageFiles=response.data[0];
                }else{
                    this.checkTypeform.imageFiles=this.checkTypeform.imageFiles+","+response.data[0];
                }
            },	
            //搜索
           
            //新增页面
            openAddPage(){
                if(this.utils.checkProject(this)){
                    this.getNatureList();
                    this.getInformUserList();
                    this.dialogFormVisible = true;
                }
            },
            //获取性质列表
            getNatureList(){
                var projectId = sessionStorage.getItem("projectId");
                qualityManager.getNatureList({"projectId":projectId}).then(res =>{
                    debugger
                    this.natureList = res.data;
                }).catch(res =>{

                });
            },
            //指定人列表获取
            getInformUserList(){
                var projectId = sessionStorage.getItem("projectId");
                qualityManager.getAboutUserList({"projectId":projectId}).then(res =>{
                    debugger
                    this.informUserList = res.data;
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
            //检查项保存
            submitType(checkTypeform){
                this.checkTypeform.projectId=sessionStorage.getItem("projectId");
                this.form.checkTypeList.push(this.checkTypeform);
                this.dialogTypeFormVisible = false;
            },
            //提交
            submit(form){
                this.form.projectId=sessionStorage.getItem("projectId");
                if(this.form.type==true){
                    this.form.type=2;
                }else{
                    this.form.type=1;
                }
                for(var i=0;i<this.form.informUserIds.length;i++){
                    this.informUserInfo={};
                    this.informUserInfo.jasoUserId=this.form.informUserIds[i];
                    for(var j=0;j<this.informUserList.length;j++){
                        if(this.form.informUserIds[i]==this.informUserList[j].jasoUserId){
                            this.informUserInfo.userRealName=this.informUserList[j].userRealName;
                        }
                    }
                    this.form.informUserList.push(this.informUserInfo);
                }
                debugger
                qualityManager.addQualityCheck(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                qualityManager.deleteQualityCheckList(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                qualityManager.deleteQualityCheckList([row]).then( res =>{
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
               qualityManager.getQualityCheckList({
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