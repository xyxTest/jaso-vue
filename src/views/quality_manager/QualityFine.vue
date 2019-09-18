<template>
    <div>
        <el-dialog title="质量奖惩单新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="奖惩事由" :label-width="formLabelWidth" prop="qualityCheckId">
                    <el-select v-model="form.qualityCheckId" placeholder="请选择事由" style="width: 180px; margin:10px 5px;  ">
                        <el-option
                                v-for="item in qualityCheckList"
                                :key="item.qualityCheckId"
                                :label="item.qualityCheckName"
                                :value="item.qualityCheckId">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="奖惩类型" :label-width="formLabelWidth" prop="type">
                    <el-select v-model="form.type" placeholder="请选择类型" style="width: 180px; margin:10px 5px;  ">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" :label-width="formLabelWidth" prop="createTime">
                    <div class="block">
                        <el-date-picker
                        v-model="form.createTime"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="责任人" :label-width="formLabelWidth" prop="aboutUserIds">
                    <el-select v-model="form.aboutUserIds" multiple placeholder="请选择相关人员" style="width: 180px; margin:10px 5px;  ">
                        <el-option
                                v-for="item in aboutUserList"
                                :key="item.jasoUserId"
                                :label="item.userRealName"
                                :value="item.jasoUserId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="责任单位" :label-width="formLabelWidth" prop="aboutDepartmentIds">
                    <el-select v-model="form.aboutDepartmentIds" multiple placeholder="请选择相关单位" style="width: 180px; margin:10px 5px;  ">
                        <el-option
                                v-for="item in aboutDepartmentList"
                                :key="item.departmentId"
                                :label="item.departmentName"
                                :value="item.departmentId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处罚金额" :label-width="formLabelWidth" prop="natureName">
                    <el-input v-model="form.money" placeholder="请输入金额（单位元）"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="natureName">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="form.remark">
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
                    label="项目名称">
            </el-table-column>
             <el-table-column
                    prop="money"
                    label="金额">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注">
            </el-table-column>
             <el-table-column
                    prop="userRealName"
                    label="签发人">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateQualityFine(scope.row)">编辑</el-button>
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
    var pageParams = {page: {pageSize: 10, pageNo: 1}}

    export default {

        data() {
            return {
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                fileList:[],
                tableData: [],
                options:[{"name":"奖励单","value":1},{"name":"惩罚单","value":2}],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                form: {
                    natureName: '',
                    type: '',
                    projectId:'',
                    remark:'',
                    qualityCheckId:'',
                    imageFiles:null,
                    money:'' ,
                    aboutIds:[],
                    state:'',
                    aboutUserIds:[],
                    aboutDepartmentIds:[],
                    createTime:''
                },
                test:{
                    projectId:'',
                    aboutId:'',
                    state:''
                },
                aboutUserList:[],
                aboutDepartmentList:[],
                qualityCheckList:[],
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: []
            }
        },
        methods: {
             returnList(response, file, fileList){
                 debugger
                if(this.form.imageFiles==null){
                    this.form.imageFiles=response.data[0];
                }else{
                    this.form.imageFiles=this.form.imageFiles+","+response.data[0];
                }
            },	
            //新增页面
            openAddPage(){
                if(this.utils.checkProject(this)){
                    this.getAllQualityCheck();
                    this.getAboutUserList();
                    this.getAboutDepartmentList();
                    this.dialogFormVisible = true;
                }
            },
            //获取奖惩事由
            getAllQualityCheck(){
                let projectId = sessionStorage.getItem("projectId");
                qualityManager.getQualityCheckList({"projectId":projectId,"pageVo":pageParams}).then(res =>{
                    debugger
                    this.qualityCheckList = res.data;
                }).catch(res =>{

                });
            },
            //获取责任人列表
            getAboutUserList(){
                let projectId = sessionStorage.getItem("projectId");
                qualityManager.getAboutUserList({"projectId":projectId}).then(res =>{
                    debugger
                    this.aboutUserList = res.data;
                }).catch(res =>{

                });
            },
            //获取责任单位列表
            getAboutDepartmentList(){
                 let projectId = sessionStorage.getItem("projectId");
                qualityManager.getAboutDepartmentList({"projectId":projectId}).then(res =>{
                    debugger
                    this.aboutDepartmentList = res.data;
                }).catch(res =>{

                });
            },
            resetForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
            },
            updateQualityFine(row){
                //编辑页面
                this.form = Object.assign({}, row);
                this.dialogFormVisible = true;
            },
            //提交
            submit(form){
                debugger
                this.form.projectId=sessionStorage.getItem("projectId");
                if(this.form.aboutUserIds.length>0){
                    for(var i=0;i<this.form.aboutUserIds.length;i++){
                       this.test={};
                       this.test.projectId=sessionStorage.getItem("projectId");
                       this.test.aboutId=this.form.aboutUserIds[i];
                       this.test.state=1
                       this.form.aboutIds.push(this.test);
                    }
                }
                if(this.form.aboutDepartmentIds.length>0){
                    for(var i=0;i<this.form.aboutDepartmentIds.length;i++){
                        this.test={};
                        this.test.projectId=sessionStorage.getItem("projectId");
                        this.test.aboutId=this.form.aboutDepartmentIds[i];
                         this.test.state=2;
                         this.form.aboutIds.push(this.test);
                    }
                }
                qualityManager.addQualityFine(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                qualityManager.deleteQualityFine(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                qualityManager.deleteQualityFine([row]).then( res =>{
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
               qualityManager.getQualityFine({
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