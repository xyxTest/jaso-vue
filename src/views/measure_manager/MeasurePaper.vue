<template>
    <div>
        <el-dialog title="上传图纸" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="图纸名称" :label-width="formLabelWidth" prop="measurePaperName">
                    <el-input v-model="form.measurePaperName" autocomplete="off" style="width:83%"></el-input>
                </el-form-item>
                <el-form-item label="所属项目" :label-width="formLabelWidth" prop="projectId">
                    <el-select v-model="form.projectId" placeholder="请选择项目" style="width:83%">
                        <el-option
                                v-for="item in projectList"
                                :key="item.projectId"
                                :label="item.projectName"
                                :value="item.projectId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图纸上传" :label-width="formLabelWidth" prop="paperUrl">
                        <el-upload
                                class="upload-demo"
                                action="http://jasobim.com:8085/api/files/uploadFiles"
                                :on-success="returnList"
                                name="file"
                                v-model="form.paperUrl"
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
        <el-button type="primary" style="margin:10px 30px;float:right; " @click="openAddPage">上传图纸</el-button>
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
                    prop="measurePaperName"
                    label="图纸名称">
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
                    prop="type"
                    label="类型">
                    <template slot-scope="scope">
                        {{options[scope.row.type-1]}}
                    </template>
            </el-table-column>
            <el-table-column
                    prop="measureNum"
                    label="测量点数">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="上传时间"
                   :formatter="formatDate">
            </el-table-column>
            <el-table-column
                    prop="measurePaperStatus"
                    label="图纸状态">
                    <template slot-scope="scope">
                        {{statusList[scope.row.measurePaperStatus-1]}}
                    </template>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="setPoint(scope.row)">标注</el-button>
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
    import measureManager from '../../jaso_api/measure_manager.js';
    import Drawer from './components/Drawer';
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    export default {
        components:{
            Drawer
        },
        data() {
            return {
                options:["设备安装","土建"],
                statusList:["未标注","已标注"],
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                checkTypeTable:[],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogPointVisible: false,
                projectList: [],
                form: {
                    measurePaperName: '',
                    projectId: '',
                    paperUrl:''
                },
                fileList:[],
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: []
            }
        },
        methods: {
            event(params){
                console.log('event-params',params) 
            },
            setPoint(row){
                this.dialogPointVisible=true;
                let projectId = sessionStorage.getItem("projectId");
                measureManager.getProjectCheckTypeLists({"checkType":1}).then(res =>{
                    debugger
                    this.$router.push({path:'DrawerPage', query:{data: res.data,projectId:projectId,measurePaperId:row.measurePaperId}})
                    this.checkTypeTable=res.data;
                });
            },
            getProjectCheckTypeList(){

            },
           formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                return this.api.formatDate(date);
            },
            returnList(response, file, fileList){
                this.form.paperUrl=response.data[0];
                console.log('file',file)
                console.log('fileList',fileList)
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
            updateMachinery(row){
                //编辑页面
                this.form = Object.assign({}, row);
                this.dialogFormVisible = true;
            },
            //提交
            submit(form){
                measureManager.addMeasurePaper(this.form).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                measureManager.deleteMeasurePaper(this.multipleSelection).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                measureManager.deleteMeasurePaper([row]).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
                measureManager.getMeasurePaperList({
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
            this.getProjectList();
        }
    }
</script>