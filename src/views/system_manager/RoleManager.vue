<template>
    <div>
        <el-dialog title="角色新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="角色类型名称" :label-width="formLabelWidth" prop="roleTypeName">
                    <el-input v-model="form.roleName" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                 <el-form-item label="等级" :label-width="formLabelWidth" prop="sort">
                    <el-input-number v-model="form.sort" :min="1" :max="10"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="权限分配" :visible.sync="dialogFormVisibleTree" width="40%" @opened="dialogOpen">
            <el-form :model="treeForm" status-icon >
                <el-select v-model="treeForm.menuId" multiple placeholder="请选择">
                    <el-option
                    v-for="item in menuList"
                    :key="item.menuId"
                    :label="item.menuName"
                    :value="item.menuId">
                    </el-option>
                </el-select>              
                <el-input v-model="treeForm.roleId" autocomplete="off" style="display:none;"></el-input>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetTreeForm('treeForm')">取 消</el-button>
                <el-button type="primary" @click="submitTree('treeForm')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-button type="primary" style="margin:10px 30px;float:right; " @click="openAddPage">新增</el-button>
        <el-table
                :data="tableData"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange">
            <el-table-column
            type="index"
            width="50">
            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="角色类型名称">
            </el-table-column>
            <el-table-column
                    prop="sort"
                    label="等级">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    :formatter="formatDate"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateRole(scope.row)">编辑</el-button>
                    <el-button type="text" style="color:red;" @click="deleteSelects(scope.row)">删除</el-button>
                    <el-button type="text" style="color:#7fff40;" @click="roleEdit(scope.row)">权限分配</el-button>
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
                dialogFormVisibleTree: false,
                tableData: [],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                form: {
                    roleName: '',
                    sort:1
                },
                tempRow:[],
                menuList:[],
                formLabelWidth: '120px',
                menuTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                treeForm: {
                    menuId: [],
                    roleId: ''
                }
            }
        },
        methods: {
             formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                return this.api.formatDate(date);
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
            updateRole(row){
                //编辑页面
                this.form = Object.assign({}, row);
                this.dialogFormVisible = true;
            },
             //删除选中
            deleteSelect(row){
                this.api.deleteRole(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteRole([row]).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //提交
            submit(form){
                this.api.addRole(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
           
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            resetTreeForm(form){
                this.dialogFormVisibleTree = false;
                this.treeForm={};
            },
            submitTree(form){
                debugger
                this.api.roleSetting(this.treeForm).then(res =>{
                    this.initDatas();
                    this.dialogFormVisibleTree = false;
                }).catch(res =>{

                });

            },
            dialogOpen() {
                this.treeForm.roleId=this.tempRow.roleId;
                this.getAllMenuByRole();
                this.api.selectAllMenuList(this.tempRow).then(res =>{
                    debugger
                    this.menuList=res.data;
                }).catch(res =>{
                });
            },
            getAllMenuByRole(){
                this.api.selectRoleMenuList({"roleId":this.treeForm.roleId}).then(res =>{
                    debugger
                    for(var i=0;i<res.data.length;i++){
                        this.treeForm.menuId.push(res.data[i].menuId);
                    }
                    debugger
                });
            },
            roleEdit(row){
                this.tempRow={};
                this.tempRow = row;
                this.treeForm.menuId=[];
                this.dialogFormVisibleTree = true;
            },
            initDatas(){
                this.api.getRoleList({
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