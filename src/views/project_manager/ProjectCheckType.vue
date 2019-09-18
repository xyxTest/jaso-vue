<template>
    <div>
        <el-input v-model="search.checkName" placeholder="请输入检查项名称" style="width: 180px; margin:10px 5px;  " ></el-input>
        <el-select v-model="search.checkType" placeholder="请选择类型" style="width: 180px; margin:10px 5px;  ">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-button type="primary" style="margin:10px 5px; " @click="searchProjectCheckType">搜索</el-button>
        <el-dialog title="检查项新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="检查项名称" :label-width="formLabelWidth" prop="checkName">
                    <el-input v-model="form.checkName" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth" prop="checkType">
                    <el-select v-model="form.checkType" placeholder="请选择类型" style="width:83%">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
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
                    prop="checkName"
                    label="检查项名称">
            </el-table-column>
            <el-table-column
                    prop="checkType"
                    label="检查项类型">
                <template slot-scope="scope">
                    <template>
                        {{optionsList[scope.row.checkType-1]}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateCheckType(scope.row)">编辑</el-button>
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
                options:[
                    {"value":1,"name":"实测实量"},
                    {"value":2,"name":"质量管理"},
                    {"value":3,"name":"安全管理"}],
                optionsList:[
                "实测实量",
                "质量管理",
                "安全管理"],
                form: {
                    checkName: '',
                    checkType: ''
                },
                search: {
                    checkName: '',
                    checkType: ''
                },
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: []
            }
        },
        methods: {
            //搜索
            searchProjectCheckType(){
                this.api.getProjectCheckTypeList({
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    },
                    ...this.search
                }).then(res => {
                    this.tableData=res.data.data;
                    this.page.total=res.data.page.total;
                }).catch(res => {

                });
            },
            //新增页面
            openAddPage(){
                this.dialogFormVisible = true;
            },
            resetForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
            },
            updateCheckType(row){
                //编辑页面
                this.form = Object.assign({}, row);
                this.dialogFormVisible = true;
            },
            //提交
            submit(form){
                this.api.addProjectCheckType(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                this.api.deleteProjectCheckTypeList(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteProjectCheckTypeList([row]).then( res =>{
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
                this.api.getProjectCheckTypeList({
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