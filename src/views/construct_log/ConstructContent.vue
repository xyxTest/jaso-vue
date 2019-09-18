<template>
    <div style="float: left">
        <div class="block" style="width:30%;margin-top:50px;float: left">
            <el-tree
                    :data="treeData"
                    node-key="id"
                    :expand-on-click-node="false"
                    :default-expand-all="true"
                    :render-content="renderContent">
            </el-tree>
        </div>
        <div style="width:70%;float: left">
             <el-button type="primary" style="margin:10px 30px;float:right; " @click="openImportPage">物资导入</el-button>
             <el-dialog
                        :close-on-click-modal="false"
                        :visible.sync="dialogImportMaterialVisible"
                        width="480px">
                    <div slot="title" style="font-weight: bolder">
                        从Excel文件导入
                    </div>
                    <div class="import-info">
                        <section>提示：从Excel文件导入必须按照标准格式，点击<a :href="downloadPath" target="_blank">下载标准格式文档</a>下载。或者
                            <a class="file-wrapper">
                                <span>从本地导入</span>
                                <input type="file" accept=".xls,.xlsx,.csv" ref="importInput" @change="handleImportFile($event)" />
                            </a>
                        </section>
                    </div>
            </el-dialog>
            <el-dialog title="子级新增" :visible.sync="dialogTreeFormVisible">
                <el-form :model="form">
                    <el-form-item label="施工内容名称" :label-width="formLabelWidth" prop="constructContentName">
                        <el-input v-model="form.constructContentName" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <!--projectList-->
                    <el-form-item label="单位" :label-width="formLabelWidth" prop="constructContentUnit" >
                        <el-input v-model="form.constructContentUnit" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="父节点" :label-width="formLabelWidth" hidden>
                        <el-input v-model="form.pid" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('form')">取 消</el-button>
                    <el-button type="primary" @click="submitTree('form')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="施工内容新增" :visible.sync="dialogFormVisible" width="40%">
                <el-form :model="form" status-icon ref="form">
                    <el-form-item label="施工内容名称" :label-width="formLabelWidth" prop="constructContentName" >
                        <el-input v-model="form.constructContentName" autocomplete="off" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" :label-width="formLabelWidth" prop="constructContentUnit" >
                        <el-input v-model="form.constructContentUnit" autocomplete="off" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item label="工种名称" :label-width="formLabelWidth" prop="roleId" >
                        <el-select v-model="form.roleId" placeholder="请选择工种" style="width:300px" @change="setConstructContentType(form.projectId)">
                            <el-option
                                    v-for="item in roleList"
                                    :key="item.roleId"
                                    :label="item.roleName"
                                    :value="item.roleId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="父节点" :label-width="formLabelWidth" prop="pid" v-if="constructContentType == 1">
                        <el-select v-model="form.pid" placeholder="请选择父节点" style="width:300px">
                            <el-option
                                    v-for="item in pidList"
                                    :key="item.constructContentId"
                                    :label="item.constructContentName"
                                    :value="item.constructContentId">
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
                        prop="constructContentName"
                        label="施工内容名称">
                </el-table-column>
                <el-table-column
                        prop="constructContentUnit"
                        label="单位">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="工种">
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="updateConstructContent(scope.row)">编辑</el-button>
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
                constructContentType:0,
                tableData: [],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogTreeFormVisible: false,
                form: {
                    constructContentName: '',
                    constructContentUnit: '',
                    roleId:'',
                    pid: ''
                },
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                pidList: [{}],
                currentProjectId:'',
                roleList:[],
                dialogImportMaterialVisible:false
            }
        },
        methods: {
             openImportPage(){
                if(this.utils.checkProject(this)){
                    this.dialogImportMaterialVisible = true;
                }
            },
            //导入表格数据
             handleImportFile(e) {
                debugger
                let formData = new FormData();
                const files = e.target.files;
                const file = files[0];
                console.log("file",file);
                formData.append("file",file);
                this.api.importConstructContentList(formData).then(res =>{
                    this.initDatas();
                    this.dialogImportMaterialVisible = false;
                }).catch(res =>{
                    this.$message.error(res.message);
                })
            },
            //获取角色列表
            getRoleList(){
                this.api.getAllRoleList().then( res =>{
                    this.roleList=res.data;
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            updateConstructContent(row){
                //编辑页面
                this.form = Object.assign({}, row);
                this.dialogFormVisible = true;
            },
            setConstructContentType(params){
                this.constructContentType=1;
                let userInfo = JSON.parse(sessionStorage.getItem("user"));
                debugger
                this.api.getAllConstructContent({
                    "projectId":params,
                    "companyId":userInfo.companyId
                }).then(res => {
                    this.pidList=res.data;
                }).catch(res => {

                });
            },
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
                this.api.addConstructContent(this.form).then(res =>{
                    this.initDatas();
                    this.getConstructContentTreeList();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                this.api.deleteConstructContent(this.multipleSelection).then( res =>{
                    this.getConstructContentTreeList();
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteConstructContent([row]).then( res =>{
                    this.getConstructContentTreeList();
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getConstructContentList(){
                var userInfo = JSON.parse(sessionStorage.getItem("user"));
                debugger
                this.api.getAllConstructContent({
                    "projectId":this.form.projectId,
                    "companyId":userInfo.companyId
                }).then(res => {
                    this.pidList=res.data;
                }).catch(res => {

                });
            },
            initDatas(){
                this.constructContentType=0;
                this.api.getConstructContentList({
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
                this.api.addConstructContent(this.form).then(res =>{
                    if(res.data!=null){
                        let newChild={};
                        newChild = { id: res.data.constructContentId, label: this.form.constructContentName, children: [] };
                        if (!this.treeData.children) {
                            this.$set(this.treeData, 'children', []);
                        }
                        this.getConstructContentTreeList();
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
            getConstructContentTreeList(){
                this.api.getConstructContentTree().then(res =>{
                    debugger
                    this.treeData=res.data;
                })
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                this.api.deleteDepartment([{'constructContentId':data.id}]).then(res =>{
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
            this.getConstructContentTreeList();
            this.getConstructContentList();
            this.getRoleList();
        }
    }
</script>