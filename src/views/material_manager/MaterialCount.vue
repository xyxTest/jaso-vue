<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="物资库存" name="first">
                <el-input v-model="search.materialName" placeholder="请输入物资名称" style="width: 180px; margin:10px 20px;  " ></el-input>
                <el-select v-model="search.materialTypeId" placeholder="物资类型选择" style="width: 180px; margin:10px 5px;  ">
                    <el-option
                            v-for="item in materialTypeList"
                            :key="item.materialTypeId"
                            :label="item.materialTypeName"
                            :value="item.materialTypeId">
                    </el-option>
                </el-select>
                <el-button type="primary" style="margin:10px 5px; " @click="searchMaterial">搜索</el-button>

                <el-button type="primary" style="margin:10px 30px;float:right; " @click="openImportPage">物资导入</el-button>
                <!-- 新增弹出框 -->
                <el-button type="primary" style="margin:10px 30px;float:right; " @click="openAddPage">新增</el-button>
                <!-- 新增弹出框底层 -->
                <el-button type="danger" @click="deleteSelect" style="margin:10px 5px; float:right;">删除选中</el-button>
                <!-- import material dialog -->
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
                <!-- /import material dialog -->
                <!--出库、入库新增-->
                <el-dialog :visible.sync="dialogLogVisible" width="40%">
                    <div slot="title" style="font-weight: bolder">
                        {{ `新增${logInfo.materialName}${logInfo.logType === 0 ? '入库' : '出库'}` }}
                    </div>
                    <el-form  ref="logForm" :model="logInfo" :disabled="disableEdit" label-position="top">

                        <el-form-item :label="`${logInfo.logType === 0 ? '入库' : '出库'}数量：`" prop="num">
                            <el-input-number v-model="logInfo.logNum" :min="1" label="请输入数量"></el-input-number>
                        </el-form-item>
                    </el-form>
                    <div slot="footer">
                        <el-button @click="dialogLogVisible = false">取消</el-button>
                        <el-button type="primary" :disabled="disableEdit" @click="handleSaveLog">提交</el-button>
                    </div>
                </el-dialog>
                <!---->
                <el-dialog title="物资新增" :visible.sync="dialogFormVisible" width="40%">
                    <el-form :model="form" status-icon ref="form">
                        <el-form-item label="物资名称" :label-width="formLabelWidth" prop="materialName">
                            <el-input v-model="form.materialName" autocomplete="off" style="width:83%"></el-input>
                        </el-form-item>
                        <el-form-item label="物资类型" :label-width="formLabelWidth" prop="materialTypeId">
                            <el-select v-model="form.materialTypeId" placeholder="物资类型" style="width:83%">
                                <el-option
                                        v-for="item in materialTypeList"
                                        :key="item.materialTypeId"
                                        :label="item.materialTypeName"
                                        :value="item.materialTypeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规格型号" :label-width="formLabelWidth" prop="materialSize">
                            <el-input v-model="form.materialSize" autocomplete="off" style="width:83%"></el-input>
                        </el-form-item>
                        <el-form-item label="单位" :label-width="formLabelWidth" prop="materialUnit">
                            <el-input v-model="form.materialUnit" autocomplete="off" style="width:83%"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
                            <el-input v-model="form.remark" autocomplete="off" style="width:83%"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('form')">取 消</el-button>
                        <el-button type="primary" @click="submit('form')">确 定</el-button>
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
                            prop="materialName"
                            label="物资名称">
                    </el-table-column>
                    <el-table-column
                            prop="materialTypeId"
                            label="物资分类">
                        <template slot-scope="scope">
                            <template  v-for="item in materialTypeList">
                                {{scope.row.materialTypeId=== item.materialTypeId ? item.materialTypeName : ''}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="materialSize"
                            label="物资型号">
                    </el-table-column>
                    <el-table-column
                            prop="materialUnit"
                            label="单位">
                    </el-table-column>
                    <el-table-column
                            prop="putNum"
                            label="入库数量">
                        <template slot-scope="scope">
                            <div class="cell-action-wrapper">
                                <div class="num">{{ scope.row.putNum }}</div>
                                <el-button type="text" @click="handleAddLog({materialId: scope.row.materialId, materialName:scope.row.materialName, projectId: scope.row.projectId, logType: 0})">新增入库</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="outNum"
                            label="出库数量">
                        <template slot-scope="scope">
                            <div class="cell-action-wrapper">
                                <div class="num">{{ scope.row.outNum }}</div>
                                <el-button type="text" @click="handleAddLog({materialId: scope.row.materialId, materialName:scope.row.materialName, projectId: scope.row.projectId, logType: 1})">新增出库</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="leaveNum"
                            label="库存数量">
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
                            prop="createTime"
                            label="创建时间"
                            show-overflow-tooltip
                            :formatter="formatDate">
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateTeams(scope.row)">编辑</el-button>
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
            </el-tab-pane>
            <el-tab-pane label="入库、出库记录" name="second">
                <el-select v-model="searchLog.logType" placeholder="类型" style="width: 180px; margin:10px 5px;  ">
                    <el-option
                            v-for="item in logTypeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" style="margin:10px 5px; " @click="searchMaterialLog">搜索</el-button>
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
                            prop="materialName"
                            label="物资名称">
                    </el-table-column>
                    <el-table-column
                            prop="materialSize"
                            label="物资型号">
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            label="物资单价">
                    </el-table-column>
                    <el-table-column
                            prop="materialUnit"
                            label="单位">
                    </el-table-column>
                    <el-table-column
                            prop="logNum"
                            label="数量">
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
                            prop="logType"
                            label="操作类型">
                        <template slot-scope="scope">
                                {{ {0: '入库', 1: '出库'}[scope.row.logType]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="userRealName"
                            label="操作人"
                            show-overflow-tooltip>
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
                            <el-button type="text" style="color:red;" @click="deleteLogSelects(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                            @size-change="handleLogSizeChange"
                            @current-change="handleLogCurrentChange"
                            :current-page="pageLog.currentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageLog.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageLog.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="物资分类" name="third">
                <!-- 新增弹出框 -->
                <el-button type="primary" style="margin:10px 30px;float:right; " @click="openAddTypePage">新增</el-button>
                <!-- 新增弹出框底层 -->
                <el-button type="danger" @click="deleteTypeSelect" style="margin:10px 5px; float:right;">删除选中</el-button>
                <el-dialog title="物资分类新增" :visible.sync="dialogTypeFormVisible" width="40%">
                    <el-form :model="typeForm" status-icon ref="typeForm">
                        <el-form-item label="物资分类名称" :label-width="formLabelWidth" prop="materialTypeName">
                            <el-input v-model="typeForm.materialTypeName" autocomplete="off" style="width:83%"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetTypeForm('form')">取 消</el-button>
                        <el-button type="primary" @click="submitType('form')">确 定</el-button>
                    </div>
                </el-dialog>
                <el-table
                        :data="tableTypeData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="materialTypeName"
                            label="物资分类名称">
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
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateMaterialType(scope.row)">编辑</el-button>
                            <el-button type="text" style="color:red;" @click="deleteTypeSelects(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                            @size-change="handleTypeSizeChange"
                            @current-change="handleTypeCurrentChange"
                            :current-page="pageType.currentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageType.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageType.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    var pageParamsLog = {page: {pageSize: 10, pageNo: 1}}
    var pageParamsType = {page: {pageSize: 10, pageNo: 1}}
    export default {
        data() {
            return {
                importProjectId:'',
                importFile:'',
                materialNameList:{},
                materialSizeList:{},
                materialUnitList:{},
                materialPriceList:{},
                materialOptions:{},
                search:{
                    materialName: null,
                    projectId:[],
                    materialTypeId:[]
                },
                searchLog:{
                    projectId:[],
                    logType:[]
                },
                logTypeList:[{value:0,name:'入库'},{value:1,name:'出库'}],
                activeName: 'first',
                disableEdit:false,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                pageLog: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                pageType: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                tableTypeData:[],
                totalNumber:0,
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogLogVisible: false,
                dialogTypeFormVisible:false,
                dialogImportMaterialVisible:false,
                projectList: [],
                materialTypeList:[],
                material:{
                    materialName:'',
                    materialSize:'',
                    remark:'',
                    projectId:'',
                    materialCode:'',
                    materialUnit:'',
                    materialTypeId:'',
                    putNum:0,
                    outNum:0,
                    leaveNum:0,
                    isCommon:0
                },
                form: {
                    materialName: '',
                    projectId:'',
                    materialTypeId:'',
                    materialSize:'',
                    materialUnit:'',
                    remark: ''
                },
                logForm: {

                },
                typeForm:{
                    materialTypeName:'',
                    projectId:''
                },
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                logInfo: {
                    materialId: '',
                    logType: 0,
                    projectId:'',
                    logNum: 0,
                    materialName:''
                },
                materialList:[],
                // download path
                downloadPath: 'fileUploads/model_file.xls'
            }
        },
        methods: {
            openImportPage(){
                if(this.utils.checkProject(this)){
                    this.dialogImportMaterialVisible = true;
                }
            },
            handleImportFile(e) {
                debugger
                let formData = new FormData();
                const files = e.target.files;
                const file = files[0];
                console.log("file",file);
                formData.append("projectId",sessionStorage.getItem("projectId"));
                formData.append("file",file);
                this.api.importMaterialList(formData).then(res =>{
                    this.initDatas();
                    this.dialogImportMaterialVisible = false;
                }).catch(res =>{
                    this.$message.error(res.message);
                })
            },
            handleSaveLog(){
                this.logInfo.projectId=sessionStorage.getItem("projectId");
                this.api.addMaterialLog(this.logInfo).then( res=>{
                      this.initDatas();
                      this.dialogLogVisible=false;
                  }).catch(res =>{
                      this.$message.error(res.message);
                });
            },
            handleAddLog(log) {
                this.logInfo = {
                    ...log
                };
                this.dialogLogVisible = true;
            },
            searchMaterialLog(){
                this.searchLog.projectId=sessionStorage.getItem("projectId");
                this.api.getMaterialLogList({
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    },
                    ...this.searchLog
                }).then(res => {
                    this.tableData=res.data.data;
                    this.page.total=res.data.page.total;
                }).catch(res => {
                    this.$message.error(res.message);
                });
            },
            getMaterialLogList(){
                this.api.getMaterialLogList({
                    'pageVo':{
                        "pageSize": pageParamsLog.page.pageSize,
                        "pageNo": pageParamsLog.page.pageNo
                    }
                }).then(res => {
                    this.tableData=res.data.data;
                    this.pageLog.total=res.data.page.total;
                }).catch(res => {

                });
            },
             formatDate(row, column) {
            let date = new Date(parseInt(row.createTime));
            return this.api.formatDate(date);
            },
            selectMaterialTypeList(){
                this.api.selectMaterialTypeList({
                    'pageVo':{
                        "pageSize": pageParamsType.page.pageSize,
                        "pageNo": pageParamsType.page.pageNo
                    }
                }).then(res => {
                    this.tableTypeData=res.data.data;
                    this.pageType.total=res.data.page.total;
                }).catch(res => {
                    this.$message.error(res.message);
                });
            },
            searchMaterial(){
                this.search.projectId=sessionStorage.getItem("projectId");
                this.api.getMaterialList({
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    },
                    ...this.search
                }).then(res => {
                    this.tableData=res.data.data;
                    this.page.total=res.data.page.total;
                }).catch(res => {
                    this.$message.error(res.message);
                });
            },
            handleClick(tab, event) {
                if(tab.name=='second'){
                    this.page= {
                        currentPage: 1,
                        pageSize: 10,
                        total: 0
                    };
                    this.tableData= [];
                    this.totalNumber=0;
                    this.getMaterialLogList();
                }
                if(tab.name=='first'){
                    this.page= {
                        currentPage: 1,
                        pageSize: 10,
                        total: 0
                    };
                    this.tableData= [];
                    this.totalNumber=0;
                    this.initDatas();
                }
               if(tab.name == 'third'){
                   this.page= {
                       currentPage: 1,
                       pageSize: 10,
                       total: 0
                   };
                   this.tableTypeData= [];
                   this.totalNumber=0;
                   this.selectMaterialTypeList();
               }
                console.log(tab, event);
            },
            //物资分类新增页面
            openAddTypePage(){
                if(this.utils.checkProject(this)){
                    this.dialogTypeFormVisible = true;
                }
            },
            //物资新增页面
            openAddPage(){
                if(this.utils.checkProject(this)){
                    this.dialogFormVisible = true;
                }
            },
            resetForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
            },
            resetTypeForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogTypeFormVisible = false;
            },
            updateTeams(row){
                //编辑页面
                this.form = Object.assign({}, row);
                this.dialogFormVisible = true;
            },
            updateMaterialType(row){
                //编辑页面
                this.typeForm = Object.assign({}, row);
                this.dialogTypeFormVisible = true;
            },
            //提交
            submit(form){
                this.form.projectId=sessionStorage.getItem("projectId");
                this.api.addMaterial(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            submitType(form){
                this.form.projectId=sessionStorage.getItem("projectId");
                this.api.addMaterialType(this.typeForm).then(res =>{
                    this.selectMaterialTypeList();
                    this.dialogTypeFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            deleteTypeSelect(row){
                this.api.deleteMaterialType(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.selectMaterialTypeList();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            deleteTypeSelects(row){
                this.api.deleteMaterialType([row]).then( res =>{
                    this.$message.success(res.message);
                    this.selectMaterialTypeList();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                this.api.deleteMaterial(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            deleteLogSelects(row){
                this.api.deleteMaterialLog([row]).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteMaterial([row]).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getMaterialTypeList(){
                let userInfo = JSON.parse(sessionStorage.getItem("user"));
                var projectId = JSON.parse(sessionStorage.getItem("projectId"));
                this.api.getMaterialTypeList({
                    "companyId":userInfo.companyId,
                    "projectId":projectId
                }).then(res => {
                    debugger
                    this.materialTypeList=res.data;

                }).catch(res => {

                });
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
                var projectId = JSON.parse(sessionStorage.getItem("projectId"));
                this.api.getMaterialList({
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    },
                    "projectId":projectId
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
            //物资列表获取
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
            //物资记录获取
            handleLogSizeChange(val) {
                pageParamsLog.page.pageSize = val
                this.getMaterialLogList();
                console.log(`每页 ${val} 条`);
            },
            handleLogCurrentChange(val) {
                pageParamsLog.page.pageNo = val
                this.getMaterialLogList()
                console.log(`当前页: ${val}`);
            },
            //类型获取
            handleTypeSizeChange(val) {
                pageParamsType.page.pageSize = val
                this.selectMaterialTypeList();
                console.log(`每页 ${val} 条`);
            },
            handleTypeCurrentChange(val) {
                pageParamsType.page.pageNo = val
                this.selectMaterialTypeList()
                console.log(`当前页: ${val}`);
            }
        },
        mounted() {
            this.initDatas();
            this.getProjectList();
            this.getMaterialTypeList();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .cell-action-wrapper {
        button {
            display: none;
        }

        &:hover {
            .num {
                display: none;
            }

            button {
                display: inline-block;
            }
        }
    }
</style>
