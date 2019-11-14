<template>
    <div>
        <el-dialog title="学习试卷新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="试卷名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="试卷题目数量" :label-width="formLabelWidth" prop="dataNum">
                    <el-input-number v-model="form.dataNum" @change="handleChange" :min="20" :max="50"></el-input-number>
                </el-form-item>
                <el-form-item label="试卷做题时间" :label-width="formLabelWidth" prop="timeNum">
                    <el-input-number v-model="form.timeNum" @change="handleChange" :min="20" :max="60"></el-input-number>
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
                    timeNum:'',
                    dataNum:''
                },
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                studyWorkerTypeList:[]
            }
        },
        methods: {
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
             //获取所有工种类型
            getAllStudyWorkerTypeList(){
                studyDataApi.getAllStudyWorkerTypeList().then(res =>{
                    this.studyWorkerTypeList = res.data; 
                }).catch(res =>{

                });
            },
            //提交
            submit(form){
               studyDataApi.addStudyPaper(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                studyDataApi.deleteStudyPaper(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                studyDataApi.deleteStudyPaper([row]).then( res =>{
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
                studyDataApi.getStudyPaperList({
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