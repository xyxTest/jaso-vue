<template>
    <div>
        <div style="float: left; margin: 20px 0;">
            <el-input v-model="search.projectName" placeholder="请输入项目名称" style="width: 180px; margin:10px 5px;  " ></el-input>
            <el-input v-model="search.buildingUnit" placeholder="请输入建设单位" style="width: 180px; margin:10px 5px;  "></el-input>
            <el-input v-model="search.constructUnit" placeholder="请输入施工单位"style="width: 180px;margin:10px 5px; "></el-input>
            <el-input v-model="search.designUnit" placeholder="请输入设计单位"style="width: 180px;margin:10px 5px; "></el-input>
            <el-button type="primary" style="margin:10px 5px; " @click="searchProject">搜索</el-button>
            <el-button type="primary" style="margin:10px 5px; " @click="openAddPage">新增</el-button>
            <el-button type="danger" style="margin:10px 5px; " @click="deleteSelect">删除选中</el-button>
            <el-dialog title="项目新增" :visible.sync="dialogFormVisible" width="40%" id="pcAddPage">
                <el-form :model="form" status-icon ref="form">
                    <el-form-item label="项目名称" :label-width="formLabelWidth" prop="projectName">
                        <el-input v-model="form.projectName" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="项目简介" :label-width="formLabelWidth" prop="projectDescribe">
                        <el-input type='textarea' v-model="form.projectDescribe" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="建设单位" :label-width="formLabelWidth" prop="buildingUnit">
                        <el-input v-model="form.buildingUnit" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="设计单位" :label-width="formLabelWidth" prop="designUnit">
                        <el-input v-model="form.designUnit" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="施工单位" :label-width="formLabelWidth" prop="constructUnit">
                        <el-input v-model="form.constructUnit" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="项目地址" :label-width="formLabelWidth" >
                        <el-input v-model="form.projectAddress" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="项目周期" :label-width="formLabelWidth">
                        <el-input v-model="form.projectCycle" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="项目编号" :label-width="formLabelWidth" prop="projectCode">
                        <el-input v-model="form.projectCode" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="项目负责人" :label-width="formLabelWidth" prop="projectLeader">
                        <el-input v-model="form.projectLeader" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="城市编码选择" :label-width="formLabelWidth" filterable prop="cityCode">
                        <el-select v-model="form.cityCode" filterable placeholder="请选择城市" style="width:83%">
                            <el-option
                                    v-for="item in cityCodeList"
                                    :key="item.adcode"
                                    :label="item.cityName"
                                    :value="item.adcode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目图片" :label-width="formLabelWidth" prop="projectIcon">
                        <el-upload
                                class="upload-demo"
                                action="http://jasobim.com:8085/api/files/uploadFiles"
                                :on-success="returnList"
                                name="file"
                                v-model="form.projectIcon"
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
        </div>
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
                    prop="projectName"
                    label="项目名称">
            </el-table-column>
            <el-table-column
                    prop="buildingUnit"
                    label="建设单位">
            </el-table-column>
            <el-table-column
                    prop="constructUnit"
                    label="施工单位">
            </el-table-column>
            <el-table-column
                    prop="designUnit"
                    label="设计单位">
            </el-table-column>
            <el-table-column
                    prop="projectAddress"
                    label="项目地址">
            </el-table-column>
            <el-table-column
                    prop="projectCycle"
                    label="项目周期">
            </el-table-column>
            <el-table-column
                    prop="projectCode"
                    label="项目编码">
            </el-table-column>
            <el-table-column
                    prop="projectLeader"
                    label="项目负责人">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    :formatter="formatDate">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="180px">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateProject(scope.row)">编辑</el-button>
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
    var filePath="http://jasobim.com:8085/";
    export default {

        data() {
            return {
                fileList:[],
                search:{
                    projectName: '',
                    designUnit:'',
                    constructUnit:'',
                    buildingUnit:'',
                    designUnit:'',
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                formLabelWidth: '120px',
                tableData: [],
                cityCodeList:[],
                dialogTableVisible: false,
                dialogFormVisible: false,
                form: {
                    cityCode:'',
                    projectName: '',
                    buildingUnit: '',
                    projectIcon:'',
                    constructUnit: '',
                    projectDescribe:'',
                    designUnit: '',
                    projectAddress: '',
                    projectCycle:'',
                    projectCode:'',
                    projectLeader:''
                },
                multipleSelection: []
            }
        },
        methods: {
             formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                return this.api.formatDate(date);
            },
            returnList(response, file, fileList){
                this.form.projectIcon=response.data[0];
                console.log('file',file)
                console.log('fileList',fileList)
            },	
            //删除选中
            deleteSelect(row){
                this.api.deleteProject(this.multipleSelection).then( res =>{
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteProject([row]).then( res =>{
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //编辑页面
            updateProject(row){
                debugger
                this.form = Object.assign({}, row);
               this.fileList.push({url:filePath+this.form.projectIcon});
                this.dialogFormVisible = true;
            },
            //新增页面
            openAddPage(){
                this.dialogFormVisible = true;
            },
            //新增页面取消按钮
            resetForm(form) {
                this.dialogFormVisible = false;
            },
            //提交
            submit(form){
                this.$refs['form'].validate((valid) => {
                    this.api.addProject(this.form).then(res =>{
                        this.initDatas();
                        this.dialogFormVisible = false;
                        this.form=[];
                    }).catch(res =>{
                        this.$message.error(res.message);
                    })
                });
            },
            initDatas(){
                this.api.getProjectList({
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
            searchProject(){
                this.api.getProjectList({
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    },
                    ...this.search
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
            getAllCityCode(){
                this.api.getAllCityCode().then(res =>{
                    this.cityCodeList = res.data;
                }).catch(res =>{

                });
            }
        },
        mounted() {
            this.initDatas();
            this.getAllCityCode();
        }
    }
</script>