<template>
    <div>
        <el-dialog title="工种权限新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="工种类型" :label-width="formLabelWidth" prop="teamsName">
                    <el-select v-model="form.roleType" placeholder="请选择工种" style="width:83%">
                        <el-option
                                v-for="item in jobType"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工种类型" :label-width="formLabelWidth" prop="roleTypeId">
                    <el-select v-model="form.roleTypeId" placeholder="请选择类型" style="width:83%">
                        <el-option
                                v-for="item in roleTypeList"
                                :key="item.roleTypeId"
                                :label="item.roleTypeName"
                                :value="item.roleTypeId">
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
                    prop="roleType"
                    label="工种类型">
                <template slot-scope="scope">
                    <template>
                        {{jobType[scope.row.roleType-1].name}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                    prop="roleTypeName"
                    label="职称类型">
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
</template>

<script>
    let pageParams = {page: {pageSize: 10, pageNo: 1}}
    let userInfo = JSON.parse(sessionStorage.getItem("user"));
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
                departmentTree: [],
                form: {
                    roleType: [],
                    constructContentId:[],
                    companyId:'',
                    roleId:''
                },
                formLabelWidth: '120px',
                roleList:[],
                roleTypeList:[],
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                /*1、工人 2、施工员 3、班组长 4、其他*/
                jobType: [
                    {
                        value: '1',
                        name: '工人'
                    },
                    {
                        value: '2',
                        name: '施工员'
                    },
                    {
                        value: '3',
                        name: '班组长'
                    },
                    {
                        value: '4',
                        name: '其他'
                    }]
            }
        },
        methods: {
            formatDate(row, column) {
            let date = new Date(parseInt(row.createTime));
            return this.api.formatDate(date);
            },
            //部门（组织架构）Tree获取
            getDepartmentTree(){
                this.api.getUserPcDepartmentTreeList().then( res =>{
                    this.departmentTree=res.data;
                }).catch(res =>{
                    this.$message.error(res.message);
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
            //提交
            submit(form){
                this.form.companyId=userInfo.companyId;
                debugger
                this.api.addOrUpdateRoleConstruct(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
             //获取所有的用户角色类型
            getallRoleTypeList(){
                this.api.getAllRoleTypeList().then(res =>{
                    debugger;
                    this.roleTypeList = res.data;
                }).catch(res =>{

                });
            },
            //删除选中
            deleteSelect(row){
                this.api.deleteRoleConstructList(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteRoleConstructList([row]).then( res =>{
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
                this.api.getRoleConstructList({
                    "companyId":userInfo.companyId,
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
            },
            getConstructContentTreeList(){
                this.api.getConstructContentTree({ "companyId":userInfo.companyId}).then(res =>{
                    this.constructContentOptions=res.data;
                })
            }
        },
        mounted() {
            this.initDatas();
            this.getConstructContentTreeList();
            this.getallRoleTypeList();
            this.getDepartmentTree();
        }
    }
</script>