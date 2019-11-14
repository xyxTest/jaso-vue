<template>
    <div>
        <el-dialog title="爆点指派" :visible.sync="dialogMeasureProblemVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="整改人" :label-width="formLabelWidth" prop="rectifyUserIds">
                    <el-select v-model="form.rectifyUserIds" multiple placeholder="请选择项目" style="width:83%">
                        <el-option
                                v-for="item in rectifyUserList"
                                :key="item.jasoUserId"
                                :label="item.userRealName"
                                :value="item.jasoUserId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="爆点" :label-width="formLabelWidth" prop="checkName">
                    <span>{{form.checkSite}}</span><span>实测实量-设备安装-</span><span>{{form.checkName}}</span>
                </el-form-item>
                <el-form-item label="整改截止日期" :label-width="formLabelWidth" prop="finishedDate">
                     <div class="block">
                        <el-date-picker
                        v-model="form.finishedDate"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="爆点整改" :visible.sync="dialogRectifyVisible" width="40%">
            <el-form :model="rectifyform" status-icon ref="rectifyform">
                <el-form-item label="整改人" :label-width="formLabelWidth" prop="rectifyUserIds">
                    <div class="block" style="width:83%">
                        <el-slider v-model="rectifyform.process"></el-slider>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rectifyresetForm('form')">取 消</el-button>
                <el-button type="primary" @click="rectifysubmit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="爆点验收" :visible.sync="dialogCheckVisible" width="40%">
            <el-form :model="checkform" status-icon ref="checkform">
                <el-form-item label="验收结果" :label-width="formLabelWidth" prop="state">
                     <el-switch
                        v-model="checkform.state"
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
                <el-button @click="checkresetForm('form')">取 消</el-button>
                <el-button type="primary" @click="checksubmit('form')">确 定</el-button>
            </div>
        </el-dialog>
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
                    prop="checkSite"
                    label="区域位置">
            </el-table-column>
            <el-table-column
                    prop="checkName"
                    label="区域位置">
            </el-table-column>
            <el-table-column
                    prop="projectId"
                    label="项目名称">
                <template slot-scope="scope">
                    <template  v-for="item in projectList">
                        {{scope.row.projectId=== item.projectId ? item.projectName : ''}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="scope">
                        {{options[scope.row.status-1]}}
                    </template>
            </el-table-column>
            <el-table-column
                    prop="userRealName"
                    label="检查人">
            </el-table-column>
            <el-table-column
                    prop="checkDate"
                    label="检查日期"
                   :formatter="formatDate">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="setRectifyUser(scope.row)" v-if="scope.row.status==1">指派</el-button>
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
    import measureManager from '../../jaso_api/measure_manager.js';
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    export default {
        data() {
            return {
                options:["待指派","进行中","待验收", "已完成"],
                statusList:["未标注","已标注"],
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                checkTypeTable:[],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogRectifyVisible:false,
                dialogCheckVisible:false,
                dialogMeasureProblemVisible: false,
                projectList: [],
                form: {
                    rectifyUserIds: [],
                    projectId: '',
                    projectCheckTypeId:'',
                    checkSite:'',
                    checkName:'',
                    finishedDate:''
                },
                 rectifyform: {
                    process:''
                },
                checkform: {
                    score:0,
                    state:''
                },
                rectifyUserList:[],
                fileList:[],
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: []
            }
        },
        methods: {
            event(params){
                console.log('event-params',params) 
            },
            setRectifyUser(row){
               if(this.utils.checkProject(this)){
                    this.form = Object.assign({}, row);
                    this.dialogMeasureProblemVisible=true;
                    this.getRectifyUserList();
                }
            },
            setRectifyProcess(row){
               if(this.utils.checkProject(this)){
                    this.rectifyform = Object.assign({}, row);
                    this.dialogRectifyVisible=true;
                }
            },
            setCheck(row){
                 if(this.utils.checkProject(this)){
                    this.checkform = Object.assign({}, row);
                    this.dialogCheckVisible=true;
                }
            },
           formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                return this.api.formatDate(date);
            },
            //新增页面
            openAddPage(){
                this.getRectifyUserList();
                this.dialogFormVisible = true;
            },
            resetForm(form) {
                this.dialogFormVisible = false;
            },
            rectifyresetForm(form) {
                this.dialogRectifyVisible = false;
            },
            checkresetForm(form){
                this.dialogCheckVisible = false;
            },
            //提交指派
            submit(form){
                measureManager.updateMeasureProblem([this.form]).then(res =>{
                    this.initDatas();
                    this.dialogMeasureProblemVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
             //提交整改
            rectifysubmit(rectifyform){
                measureManager.rectifyMeasureProblem(this.rectifyform).then(res =>{
                    this.initDatas();
                    this.dialogRectifyVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
             //验收
            checksubmit(form){
                debugger
                if(this.checkform.state){
                    this.checkform.state=1;
                }
                if(!this.checkform.state){
                    this.checkform.state=2;
                }
                measureManager.checkMeasureProblem(this.checkform).then(res =>{
                    this.initDatas();
                    this.dialogCheckVisible = false;
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
            //删除选中
            deleteSelect(row){
                measureManager.deleteMeasurePaper(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                measureManager.deleteMeasurePaper([row]).then( res =>{
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
                var projectId = sessionStorage.getItem("projectId");
                measureManager.getMeasureProblemList({
                    'projectId':projectId,
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
            this.getProjectList();
        }
    }
</script>