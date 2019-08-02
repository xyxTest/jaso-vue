<template>
    <div style="float: left">
        <div class="block" style="width:20%;margin-top:50px;float: left">
            <el-tree
                    :data="treeData"
                    node-key="id"
                    :expand-on-click-node="false"
                    default-expand-all="true"
                    :render-content="renderContent">
            </el-tree>
        </div>
        <div style="width:80%;float: left">
            <el-dialog title="子级新增" :visible.sync="dialogTreeFormVisible">
                <el-form :model="form">
                    <el-form-item label="部门名称" :label-width="formLabelWidth" prop="departmentName">
                        <el-input v-model="form.departmentName" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <!--projectList-->
                    <el-form-item label="部门类型" :label-width="formLabelWidth" prop="departmentType" >
                        <el-select v-model="form.departmentType" placeholder="请选择部门类型" style="width:300px">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.departmentType == 1" label="项目名称" :label-width="formLabelWidth" prop="projectId" >
                        <el-select v-model="form.projectId" placeholder="请选择项目" style="width:300px">
                            <el-option
                                    v-for="item in projectList"
                                    :key="item.projectId"
                                    :label="item.projectName"
                                    :value="item.projectId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="父节点" :label-width="formLabelWidth" hidden>
                        <el-input v-model="form.pid" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('form')">取 消</el-button>
                    <el-button type="primary" @click="submitTree('form')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="部门新增" :visible.sync="dialogFormVisible" width="40%">
                <el-form :model="form" status-icon ref="form">
                    <el-form-item label="部门名称" :label-width="formLabelWidth" prop="departmentName">
                        <el-input v-model="form.departmentName" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <!--projectList-->
                    <el-form-item label="部门类型" :label-width="formLabelWidth" prop="departmentType" >
                        <el-select v-model="form.departmentType" placeholder="请选择部门类型" style="width:300px">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.departmentType == 1" label="项目名称" :label-width="formLabelWidth" prop="projectId" >
                        <el-select v-model="form.projectId" placeholder="请选择项目" style="width:300px">
                            <el-option
                                    v-for="item in projectList"
                                    :key="item.projectId"
                                    :label="item.projectName"
                                    :value="item.projectId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="父节点" :label-width="formLabelWidth" prop="pid" >
                        <el-select v-model="form.pid" placeholder="请选择父节点" style="width:300px">
                            <el-option
                                    v-for="item in pidList"
                                    :key="item.departmentId"
                                    :label="item.departmentName"
                                    :value="item.departmentId">
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
                        prop="departmentName"
                        label="部门名称">
                </el-table-column>
                <el-table-column
                        prop="departmentType"
                        label="部门类型">
                </el-table-column>
                <el-table-column
                        prop="projectId"
                        label="项目名称">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        show-overflow-tooltip>
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
    </div>
</template>

<script>
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    export default {
        data() {
            return {
                treeData:[],
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogTreeFormVisible: false,
                form: {
                    departmentName: '',
                    departmentType: '',
                    projectId: '',
                    pid: ''
                },
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                pidList: [{}],
                projectList: [{}],
                options: [{
                    value: 0,
                    label: '公司内部部门'
                }, {
                    value: 1,
                    label: '项目内部部门'
                }]
            }
        },
        methods: {
            //新增页面取消按钮
            //新增页面
            openAddPage(){
                this.dialogFormVisible = true;
            },
            resetForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
                this.dialogTreeFormVisible = false;
            },
            //提交
            submit(form){
                this.api.addDepartment(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                this.api.deleteDepartment(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteDepartment([row]).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getDepartmentList(){
                var userInfo = JSON.parse(sessionStorage.getItem("user"));
                this.api.getDepartmentList({
                    "companyId":userInfo.companyId
                }).then(res => {
                    this.pidList=res.data;
                }).catch(res => {

                });
            },
            /*getUserPcDepartmentTreeList(){
              this.api.getUserPcDepartmentTreeList().then(res =>{

              }).catch(res =>{

              });
            },*/
            getProjectList(){
                var userInfo = JSON.parse(sessionStorage.getItem("user"));
                this.api.selectProjectLists({
                    "companyId":userInfo.companyId
                }).then(res => {
                    debugger
                    this.projectList=res.data;
                }).catch(res => {

                });
            },
            initDatas(){
                this.api.selectDepartmentByPid({
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
            },
            append(data) {
                debugger
                this.dialogTreeFormVisible = true;
                this.form.pid=data.id;

            },
            //提交
            submitTree(form){
                this.api.addDepartments(this.form).then(res =>{
                    if(res.data!=null){
                       let newChild={};
                        newChild = { id: res.data.departmentId, label: this.form.departmentName, children: [] };
                        if (!this.treeData.children) {
                            this.$set(this.treeData, 'children', []);
                        }
                        this.getUserPcDepartmetTree();
                        this.initDatas();
                        this.dialogTreeFormVisible = false;
                        this.$message.success(res.message);
                    }else{
                        this.$message.error("添加失败");
                    }
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            getUserPcDepartmetTree(){
              this.api.getUserPcDepartmentTreeList().then(res =>{
                  debugger
                  this.treeData=res.data;
              })
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                this.api.deleteDepartment([{'departmentId':data.id}]).then(res =>{
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            renderContent(h, { node, data, store }) {
                return (
                    <span class="custom-tree-node">
                    <span>{node.label}</span>
                    <span>
                    <el-button class="el-icon-plus" size="mini" type="text" on-click={ () => this.append(data) }></el-button>
                    <el-button class="el-icon-delete" size="mini"  type="text" on-click={ () => this.remove(node, data) }></el-button>
                </span>
                </span>);
            }
        },
        mounted() {
            this.initDatas();
            this.getUserPcDepartmetTree();
            //this.getDepartmentList();
            this.getProjectList();
        }
    }
</script>