<template>
    <div>
        <el-dialog title="角色新增" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
                    <el-input v-model="form.roleName" autocomplete="off" style="width:500px"></el-input>
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
        <el-dialog title="权限分配" :visible.sync="dialogFormVisibleTree" width="40%">
            <el-form :model="treeform" status-icon ref="form">
                <el-tree
                        :data="menuTree"
                        show-checkbox
                        node-key="menuId"
                        :props="defaultProps"
                        node-click="test()">
                </el-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetTreeForm('form')">取 消</el-button>
                <el-button type="primary" @click="submitTree('form')">保存</el-button>
            </div>

        </el-dialog>
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
                    prop="roleName"
                    label="角色名称">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
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
                menuTree: [{
                    menuId: 1,
                    menuPcName: '一级 1',
                    children: [{
                        menuId: 4,
                        menuPcName: '二级 1-1',
                        children: [{
                            menuId: 9,
                            menuPcName: '三级 1-1-1'
                        }, {
                            menuId: 10,
                            menuPcName: '三级 1-1-2'
                        }]
                    }]
                }, {
                    menuId: 2,
                    menuPcName: '一级 2',
                    children: [{
                        menuId: 5,
                        menuPcName: '二级 2-1'
                    }, {
                        menuId: 6,
                        menuPcName: '二级 2-2'
                    }]
                }, {
                    menuId: 3,
                    menuPcName: '一级 3',
                    children: [{
                        menuId: 7,
                        menuPcName: '二级 3-1'
                    }, {
                        menuId: 8,
                        menuPcName: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'menuPcName'
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogFormVisibleTree: false,
                form: {
                    roleName: '',
                    companyId:''
                },
                treeform: {},
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: []
            }
        },
        methods: {
            //权限分配页面
            test(){
              alert('test');
            },
            resetTreeForm(form){
                this.dialogFormVisibleTree = false;
            },
            submitTree(form){
                this.dialogFormVisibleTree = false;
            },
            roleEdit(){
                this.dialogFormVisibleTree = true;
            },
            //新增页面取消按钮
            //新增页面
            openAddPage(){
                this.dialogFormVisible = true;
            },
            updateRole(row){
                this.form = Object.assign({}, row);
                this.dialogFormVisible = true;
            },
            resetForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
            },
            //提交
            submit(form){
                var userInfo = JSON.parse(sessionStorage.getItem("user"))
                this.form.companyId=userInfo.companyId;
                this.api.addRole(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            initDatas(){
                this.api.getRolePageList({
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