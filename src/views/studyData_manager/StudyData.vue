<template>
    <div>
        <el-dialog title="学习试题新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="试题名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="试题选项" :label-width="formLabelWidth" prop="studyDataOptions">
                    <el-input v-model="form.studyDataOptions" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="正确答案" :label-width="formLabelWidth" prop="rightKey">
                    <el-input v-model="form.rightKey" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="答案解析" :label-width="formLabelWidth" prop="answerAnalysis">
                    <el-input v-model="form.answerAnalysis" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="工种类型" :label-width="formLabelWidth" prop="studyWorkerTypeId">
                    <el-select v-model="form.studyWorkerTypeId" placeholder="请选择工种类型" style="width:83%">
                        <el-option
                                v-for="item in studyWorkerTypeList"
                                :key="item.studyWorkerTypeId"
                                :label="item.name"
                                :value="item.studyWorkerTypeId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="学习试题导入" :visible.sync="dialogImportVisible" width="40%">
            <el-form :model="importForm" status-icon ref="importForm">
                <el-form-item label="工种类型" :label-width="formLabelWidth" prop="studyWorkerTypeId">
                    <el-select v-model="importForm.studyWorkerTypeId" placeholder="请选择工种类型" style="width:83%">
                        <el-option
                                v-for="item in studyWorkerTypeList"
                                :key="item.studyWorkerTypeId"
                                :label="item.name"
                                :value="item.studyWorkerTypeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文件上传" :label-width="formLabelWidth">
                    <el-input type="file" v-model="importForm.file" id="importFile" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetImportForm('importForm')">取 消</el-button>
                <el-button type="primary" @click="handleImportFile('importform')">确 定</el-button>
            </div>
        </el-dialog>
        
        <!-- 导入弹出框 -->
        <el-button type="primary" style="margin:10px 30px;float:right; " @click="importPage">导入</el-button>
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
                    prop="name"
                    label="试卷名称">
            </el-table-column>
            <el-table-column
                    prop="studyDataOptions"
                    label="选项">
            </el-table-column>
            <el-table-column
                    prop="rightKey"
                    label="正确答案">
            </el-table-column>
            <el-table-column
                    prop="answerAnalysis"
                    label="答案解析">
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
</template>

<script>
    import studyDataApi from '../../jaso_api/study_data.js';
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    export default {

        data() {
            return {
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                projectList: [],
                form: {
                    name: '',
                    studyWorkTypeId:'',
                    studyDataOptions:'',
                    rightKey:'',
                    answerAnalysis:''
                },
                fileList:[],
                importForm:{
                    studyWorkerTypeId:'',
                    fileUrl:'',
                    file:[]
                },
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                studyWorkerTypeList:[],
                dialogImportVisible:false
            }
        },
        methods: {
            returnList(response, file, fileList){
                debugger
                this.importForm.fileUrl=response.data[0];
                this.importForm.file=file;
                console.log('file',file)
                console.log('fileList',fileList)
            },	
            //导入页面
            importPage(){
                this.getAllStudyWorkerTypeList();
                this.dialogImportVisible=true;
                this.importForm={};
            },
            //新增页面
            openAddPage(){
                this.getAllStudyWorkerTypeList();
                this.dialogFormVisible = true;
                this.form={};
            },
            resetForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
            },
            resetImportForm(importform){
                this.dialogImportVisible = false;
            },
             //获取所有工种类型
            getAllStudyWorkerTypeList(){
                studyDataApi.getAllStudyWorkerTypeList().then(res =>{
                    this.studyWorkerTypeList = res.data; 
                }).catch(res =>{

                });
            },
            //提交
            submit(form){
               studyDataApi.addStudyData(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleImportFile(importForm){
                debugger
                let formData = new FormData();
                const files = document.getElementById("importFile").files;
                const file = files[0];
                console.log("file",file);
                formData.append("file",file);
                formData.append("studyWorkerTypeId",this.importForm.studyWorkerTypeId);
                studyDataApi.importStudyData(formData).then(res =>{
                   this.$message.success(res.message);
                    this.dialogImportVisible = false;
                });
            },
            //删除选中
            deleteSelect(row){
                studyDataApi.deleteStudyData(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                studyDataApi.deleteStudyData([row]).then( res =>{
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
                studyDataApi.getStudyDataList({
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    }
                }).then(res => {
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