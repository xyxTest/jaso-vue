<template>
    <div>
        <div style="float: left; margin: 20px 0;">
            <el-input v-model="search.appUserName" placeholder="请输入用户名" style="width: 180px; margin:10px 5px;  " ></el-input>
            <el-input v-model="search.userAppTel" placeholder="请输入手机号码" style="width: 180px; margin:10px 5px;  "></el-input>
            <el-input v-model="search.userAppRealName" placeholder="请输入真实姓名"style="width: 180px;margin:10px 5px; "></el-input>
            <el-select v-model="search.userAppType" placeholder="用户类型选择" style="width: 180px; margin:10px 5px;  ">
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
            <el-dialog title="APP端用户新增" :visible.sync="dialogFormVisible" width="40%">
                <el-form :model="form" status-icon :rules="rules" ref="form">
                    <el-form-item label="用户名" :label-width="formLabelWidth" prop="appUserName">
                        <el-input v-model="form.appUserName" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" prop="appPassword">
                        <el-input v-model="form.appPassword" type="password" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" :label-width="formLabelWidth" prop="againPassword">
                        <el-input v-model="form.againPassword" type="password" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="userAppRealName">
                        <el-input v-model="form.userAppRealName" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="职称" :label-width="formLabelWidth" >
                        <el-input v-model="form.userAppPost" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input v-model="form.userAppEmail" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" :label-width="formLabelWidth" prop="userAppTel">
                        <el-input v-model="form.userAppTel" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" :label-width="formLabelWidth" prop="userAppIdCard">
                        <el-input v-model="form.userAppIdCard" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" :label-width="formLabelWidth" prop="userAppType">
                        <el-select v-model="form.userAppType" placeholder="请选择用户类型" style="width:300px">
                            <el-option
                                    v-for="item in userAppTypeList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色类型" :label-width="formLabelWidth">
                        <el-select v-model="form.roleId" multiple placeholder="请选择用户角色" style="width:300px">
                            <el-option
                                    v-for="(item,index) in roleList"
                                    :key="index"
                                    :label="item.roleName"
                                    :value="item.roleId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="block">
                        <el-form-item label="部门" :label-width="formLabelWidth" prop="departmentTree" >
                        <el-cascader
                                v-model="form.departmentTree"
                                :options="departmentOptions"
                                :show-all-levels="false"
                                :change-on-select="true"
                                :props="{ multiple: true, checkStrictly: true }"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('form')">取 消</el-button>
                    <el-button type="primary" :disabled="!!form.isPc" @click="submit('form')">确 定</el-button>
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
                    prop="appUserName"
                    label="用户名">
            </el-table-column>
            <el-table-column
                    prop="userAppRealName"
                    label="真实姓名">
            </el-table-column>
            <el-table-column
                    prop="userAppTel"
                    label="手机号码">
            </el-table-column>
            <el-table-column
                    prop="userAppAge"
                    label="年龄">
            </el-table-column>
            <el-table-column
                    prop="userAppSex"
                    label="性别">
                <template slot-scope="scope">
                    {{scope.row.userAppSex=== 1 ? '男' : '女'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="userAppPost"
                    label="职称">
            </el-table-column>
<!--            <el-table-column
                    prop="departmentId"
                    label="部门">
            </el-table-column>-->
            <el-table-column
                    prop="userAppType"
                    label="用户类型">
                <template slot-scope="scope">
                    {{scope.row.userAppType=== 0 ? '公司管理人员' : '项目人员'}}
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
                    <el-button type="text" @click="updateUserApp(scope.row)">编辑</el-button>
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
    let arr = []; // 在递归时操作的数组
    let returnArr = []; // 存放结果的数组
    let depth = 0; // 定义全局层级
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
                } else if (value !== this.form.appPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                departmentValue: [],
                departmentOptions: [],
                departmentArrays:[],
                rules: {
                    appPassword: [{ validator: validatePass, trigger: 'blur' }],
                    againPassword: [{ validator: validatePass2, trigger: 'blur' }],
                    appUserName:[{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                    userAppIdCard:[{required: true, trigger: 'blur', ...util.rules.idcard}],
                    userAppTel :[{required: true,  trigger: 'blur', ...util.rules.cellphone}]
                },
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                departmentTreeList:[{
                  value:'',
                  label:'',
                  pid:''
                }],
                form: {
                    appUserName: '',
                    userAppTel: '',
                    userAppRealName: '',
                    userAppType: [],
                    appPassword: '',
                    againPassword:'',
                    userAppEmail:'',
                    userAppPost: '',
                    userAppIcon: '',
                    userAppIdCard: '',
                    departmentTree: [],
                    roleId: [],
                    isPc: 0
                },
                formPlace: {
                    appUserName: '',
                    userAppTel: '',
                    userAppRealName: '',
                    userAppType: [],
                    appPassword: '',
                    againPassword:'',
                    userAppEmail:'',
                    userAppPost: '',
                    userAppIcon: '',
                    userAppIdCard: '',
                    departmentTree: [],
                    roleId: [],
                    isPc: 0
                },
                userAppTypeList:[
                    {name:'公司管理人员',value: 0},
                    {name:'项目人员',value: 1}
                ],
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                search:{
                    appUserName: null,
                    userAppTel:null,
                    userAppRealName:null,
                    userAppType:null,
                    departmentTree:[]
                },
                userRoles: [],
                chapterArr:[],
                userDepartments: [],
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
            //获取部门树
            getDepartmentTree(){
                this.api.selectDepartmentTree().then( res =>{
                    this.departmentOptions=res.data;
                    console.log( 'departmentOptions:'+this.departmentOptions);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleChange(value) {
                console.log(value);
            },
            //删除选中
            deleteSelect(row){
                this.api.deleteUserApp(this.multipleSelection).then( res =>{
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                this.api.deleteUserApp([row]).then( res =>{
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //编辑页面
            updateUserApp(row){
                console.log(this.departmentOptions)
                this.form = Object.assign({}, row);
                this.form.againPassword=this.form.appPassword;
                //加载用户角色列表
                this.getUserAppDetail(row);
                //console.log('array',this.)
                console.log('roleList',this.roleList);
                this.form.roleId=[{'roleId':5}];
                console.log('this.form.roleId',this.form.roleId);

                this.dialogFormVisible = true;
            },
            //获取用户详情(获取当前用户角色)
            getUserAppDetail(row){
                this.api.getUserAppDetail(row).then(res => {
                    this.userRoles = res.data
                    this.form.roleId=res.data.map(e => {
                        return e.roleId
                    });
                    this.getUserAppDepartmentDetail(row);
                }).catch(res => {
                    this.$message.error(res.message);
                });
            },
            //获取用户详情（获取用户组织架构）
            getUserAppDepartmentDetail(row){
                this.api.getUserAppDepartmentDetail(row).then(res =>{
                    this.userDepartments = res.data
                    this.getDepartmentIdLists(this.userDepartments);
                }).catch(res =>{

                })
            },
            //新增页面
            openAddPage(){
                this.form={
                    appUserName: '',
                        userAppTel: '',
                        userAppRealName: '',
                        userAppType: [],
                        appPassword: '',
                        againPassword:'',
                        userAppEmail:'',
                        userAppPost: '',
                        userAppIcon: '',
                        userAppIdCard: '',
                        departmentTree: [{}],
                        roleId: [],
                        isPc: 0
                };
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
                        if(this.userDepartments.length>0){
                            //////////////
                            this.formPlace.isPc=this.form.isPc;
                            this.formPlace.againPassword=this.form.againPassword;
                            this.formPlace.appPassword=this.form.appPassword;
                            this.formPlace.appUserName=this.form.appUserName;
                            this.formPlace.userAppEmail=this.form.userAppEmail;
                            this.formPlace.userAppIcon=this.form.userAppIcon;
                            this.formPlace.userAppIdCard=this.form.userAppIdCard;
                            this.formPlace.userAppPost=this.form.userAppPost;
                            this.formPlace.userAppRealName=this.form.userAppRealName;
                            this.formPlace.userAppTel=this.form.userAppTel;
                            this.formPlace.userAppType=this.form.userAppType;
                            //////////////////////////
                            for(let i=0;i<this.form.departmentTree.length;i++){
                                let test={value:''};
                                test.value=this.form.departmentTree[i][this.form.departmentTree.length-1];
                                this.formPlace.departmentTree.push(test);
                            }
                        }
                        if(this.userRoles.length>0){
                            this.form.roleId = this.form.roleId.map(e => {
                                let roles = this.userRoles.filter(e2 => {
                                    return e2.roleId == e
                                });
                                if (roles.length > 0) {
                                    return roles[0]
                                } else {
                                    return {roleId: e}
                                }
                            })
                        }
                       /* let departmentTree = this.form.departmentTree.map(el => {
                            return {value: el[el.length - 1]}
                        })*/
                        let roleId = this.form.roleId.map(el => {
                            return {roleId: el}
                        })
                        this.api.addUserApp({...this.formPlace,roleId:roleId}).then(res =>{
                            this.initDatas();
                            this.dialogFormVisible = false;
                        }).catch(res =>{
                            this.$message.error(res.message);
                        })
                    } else {
                        return false;
                    }
                });
            },
            //密码验证
            infoGet(){
                ///加载部门信息
                var userInfo = JSON.parse(sessionStorage.getItem("user"))
                this.api.getDepartmentList({
                    "companyId":userInfo.companyId
                }).then(res =>{
                    this.departmentIds = res.data;
                }).catch(res =>{
                    this.$message.error(res.message);
                });
                //加载
            },

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
                this.api.callApi('/UserApp/select',{
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
                let departmentTree = this.search.departmentTree.map(el => {
                    return {value: el[el.length - 1]}
                })
                this.api.callApi('/UserApp/select',{
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    },
                    ...this.search,
                    departmentTree: departmentTree
                }).then(res => {
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
            },
            getDepartmentIdLists(list){
                let idTrees=[];
                debugger
                list.forEach(e => {
                    idTrees.push(getTreeDeepArr(e.departmentId,this.departmentOptions));
                });
                console.log('idTrees',idTrees);
                this.form.departmentTree=idTrees;
                this.departmentTreeList=idTrees;
                //this.$set(this.form, 'departmentTree', idTrees);
                console.log("arr:",this.form.departmentTree);
            }
        },
        mounted() {
            this.roleListGet();
            this.getDepartmentTree();
            this.infoGet();
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