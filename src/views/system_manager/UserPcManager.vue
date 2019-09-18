<template>
    <div>
        <div style="float: left; margin: 20px 0;">
            <el-input v-model="search.userName" placeholder="请输入用户名" style="width: 180px; margin:10px 5px;  " ></el-input>
            <el-input v-model="search.userTel" placeholder="请输入手机号码" style="width: 180px; margin:10px 5px;  "></el-input>
            <el-input v-model="search.userRealName" placeholder="请输入真实姓名"style="width: 180px;margin:10px 5px; "></el-input>
            <el-select v-model="search.userType" placeholder="用户类型选择" style="width: 180px; margin:10px 5px;  ">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-cascader
                    v-model="search.departmentTree"
                    :options="departmentOptions"
                    :props="{ multiple: true, checkStrictly: true }"
                    @change="handleChange" placeholder="请选择部门"></el-cascader>
            <el-button type="primary" style="margin:10px 5px; " @click="searchUser">搜索</el-button>
            <!-- 新增弹出框 -->
            <el-button type="primary" style="margin:10px 5px; " @click="openAddPage">新增</el-button>
            <el-dialog title="PC端用户新增" :visible.sync="dialogFormVisible" width="40%" id="pcAddPage">
                <el-form :model="form" status-icon :rules="rules" ref="form">
                    <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
                        <el-input v-model="form.userName" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                        <el-input v-model="form.password" type="password" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" :label-width="formLabelWidth" prop="againPassword">
                        <el-input v-model="form.againPassword" type="password" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="userRealName">
                        <el-input v-model="form.userRealName" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="职称" :label-width="formLabelWidth" >
                        <el-input v-model="form.userPost" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input v-model="form.userEmail" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" :label-width="formLabelWidth" prop="userTel">
                        <el-input v-model="form.userTel" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" :label-width="formLabelWidth" prop="userIdCard">
                        <el-input v-model="form.userIdCard" autocomplete="off" style="width:83%"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" :label-width="formLabelWidth" prop="userType">
                        <el-select v-model="form.userType" placeholder="请选择用户类型" style="width:83%">
                            <el-option
                                    v-for="item in userPcTypeList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色类型" :label-width="formLabelWidth">
                        <el-select v-model="form.roleId" multiple placeholder="请选择用户角色" style="width:83%">
                            <el-option
                                    v-for="(item,index) in roleList"
                                    :key="index"
                                    :label="item.roleName"
                                    :value="item.roleId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门" :label-width="formLabelWidth" >
                        <el-cascader
                                v-model="form.departmentTree"
                                :options="departmentOptions"
                                :show-all-levels="false"
                                :change-on-select="true"
                                :props="{ multiple: true, checkStrictly: true }"
                                @change="handleChange"></el-cascader>
                    </el-form-item>
                    <el-form-item label="头像" :label-width="formLabelWidth" prop="projectIcon">
                        <el-upload
                                class="upload-demo"
                                action="http://jasobim.com:8085/api/files/uploadFiles"
                                :on-success="returnList"
                                name="file"
                                v-model="form.userIcon"
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
            <!-- 新增弹出框底层 -->
            <el-button type="danger" @click="deleteSelect" style="margin:10px 5px; ">删除选中</el-button>
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
                    prop="userName"
                    label="用户名">
            </el-table-column>
            <el-table-column
                    prop="userRealName"
                    label="真实姓名">
            </el-table-column>
            <el-table-column
                    prop="userTel"
                    label="手机号码">
            </el-table-column>
            <el-table-column
                    prop="userAge"
                    label="年龄">
            </el-table-column>
            <el-table-column
                    prop="userSex"
                    label="性别">
                <template slot-scope="scope">
                   {{scope.row.userPcSex=== 1 ? '男' : '女'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="userPost"
                    label="职称">
            </el-table-column>
      <!--      <el-table-column
                    prop="departmentId"
                    label="部门">
            </el-table-column>-->
            <el-table-column
                    prop="userPcType"
                    label="用户类型">
                <template slot-scope="scope">
                    {{scope.row.userPcType=== 0 ? '公司管理人员' : '项目人员'}}
                </template>
            </el-table-column>
           <!-- <el-table-column
                    prop="createTime"
                    label="创建时间">
            </el-table-column>-->
            <el-table-column
                    label="操作"
                    width="180px">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateUserPc(scope.row)">编辑</el-button>
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
<style scoped>
/*
    .el-input__inner{width:10px;}
*/
</style>
<script >
    import util from  '../../common/js/util';
    var pageParams = {page: {pageSize: 10, pageNo: 1}}
    var filePath="http://jasobim.com:8085/";
    export default {

        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.form.checkPass !== '') {
                        this.$refs.form.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                console.log(value, this.form.againPassword)
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                rules: {
                    password: [{ validator: validatePass, trigger: 'blur' }],
                    againPassword: [{ validator: validatePass2, trigger: 'blur' }],
                    userName:[{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                    userIdCard:[{required: true, trigger: 'blur', ...util.rules.idcard}],
                    userTel :[{required: true,  trigger: 'blur', ...util.rules.cellphone}],
                    //departmentId :[{ type: 'array', required: true, message: '部门不能为空', trigger: 'change' }],
                    //userPcType: [{required: true,type: 'array', message: '用户类型不能为空', trigger: 'change' }]
                },
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                departmentOptions:[],
                form: {
                    userName: '',
                    userTel: '',
                    userRealName: '',
                    userType: [],
                    password: '',
                    againPassword:'',
                    userEmail:'',
                    userPost: '',
                    userIcon: '',
                    userIdCard: '',
                    departmentTree: [],
                    roleId: [],
                    isApp:''
                },
                fileList:[],
                userRoles:[{}],
                userPcTypeList:[
                    {name:'公司管理人员',value: 1},
                    {name:'项目管理人员',value: 2},
                    {name:'项目工人',value: 3}
                ],
               
                formLabelWidth: '120px',
            //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                search:{
                    userName: null,
                    userTel:null,
                    userRealName:null,
                    userType:null
                },
                roleList: [],
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                options: [{
                    value: 0,
                    label: '公司管理人员'
                }, {
                    value: 1,
                    label: '项目人员'
                }]
            }
        },
        methods: {
             returnList(response, file, fileList){
                this.form.userIcon=response.data[0];
            },	
            handleChange(value) {
                console.log(value);
            },
            //获取部门树
            getDepartmentTree(){
                this.api.selectDepartmentTree().then( res =>{
                    this.departmentOptions=res.data;
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //用户获取其的部门idList
            getUserDepartmentList(row){
                this.api.getUserDepartmentList(row).then( res =>{
                    let getList = res.data;
                    let arraList=[];
                    console.log('getlist:',getList);
                    if(getList.length>0){
                        for(let i=0;i<getList.length;i++){
                            debugger
                            arraList.push(getTreeDeepArr(getList[i].departmentId,this.departmentOptions));
                        }
                        //this.form.departmentTree=arraList;
                        this.$set(this.form, 'departmentTree', arraList);
                    }
                })
            },
            //删除选中
            deleteSelect(row){
                this.api.deleteUserPc(this.multipleSelection).then( res =>{
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteUserPc([row]).then( res =>{
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //编辑页面
            updateUserPc(row){
                this.form = Object.assign({}, row);
                this.form.againPassword=this.form.pcPassword;
                this.fileList.push({url:filePath+this.form.userIcon});
                //获取用户详情
                this.getUserPcDetail(row);
                //获取用户的组织架构
                this.getUserDepartmentList(row);
                //加载用户角色列表
                this.roleListGet();
                this.dialogFormVisible = true;
            },
            //获取用户详情(获取当前用户角色)
            getUserPcDetail(row){
                this.api.getUserPcDetail(row).then(res => {
                    debugger
                    this.userRoles = res.data
                    console.log('roleList',this.roleList);
                    this.form.roleId=res.data.map(e => {
                        return e.roleId
                    });
                }).catch(res => {
                    this.$message.error(res.message);
                });
            },
            //新增页面
            openAddPage(){
                this.roleListGet();
                this.dialogFormVisible = true;
            },
            //新增页面取消按钮
            resetForm(form) {
                /*debugger
                this.$refs[form].resetFields();*/
                this.dialogFormVisible = false;
            },
            //提交
            submit(form){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        debugger
                        console.log('this.form',this.form);
                        if(this.form.roleId.length>0){

                        }
                        this.api.addUserPc(this.form).then(res =>{
                            this.initDatas();
                            this.dialogFormVisible = false;
                        }).catch(res =>{
                            this.$message.error(res.message);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //密码验证



            //加载角色列表
            roleListGet(){
                var userInfo = JSON.parse(sessionStorage.getItem("user"))
                this.api.getRoleList({
                    "companyId":userInfo.companyId
                }).then(res =>{
                    this.roleList = res.data;
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },

            ///初始化
            initDatas(){
                this.api.callApi('/JasoUser/select',{
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    }
                }).then(res => {
                    this.tableData=res.data.data;
                    this.page.total=res.data.page.total;
                }).catch(res => {
                    this.$message.error(res.message);
                });
            },
            searchUser(){
                debugger
                this.api.callApi('/JasoUser/select',{
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
                    this.$message.error(res.message);
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
            this.getDepartmentTree();
            this.initDatas();
        }
    }
    ///element级联选择器的方法
    function getTreeDeepArr(key, treeData) {

        let arr = []; // 在递归时操作的数组
        let returnArr = []; // 存放结果的数组
        let depth = 0; // 定义全局层级
        // 定义递归函数
        function childrenEach(childrenData, depthN) {

            for (var j = 0; j < childrenData.length; j++) {

                depth = depthN; // 将执行的层级赋值 到 全局层级

                arr[depthN] = (childrenData[j].value);

                if (childrenData[j].value == key) {

                    // returnArr = arr; // 原写法不行, 因 此赋值存在指针关系
                    returnArr = arr.slice(0, depthN+1); //将目前匹配的数组，截断并保存到结果数组，
                    break

                } else {

                    if (childrenData[j].children) {

                        depth ++;
                        childrenEach(childrenData[j].children, depth);

                    }
                }

            }
            return returnArr;
        }
        return childrenEach(treeData, depth);
    }
</script>