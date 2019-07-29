<template>
    <div>
        <div style="float: left; margin: 20px 0;">
            <el-input v-model="search.pcUserName" placeholder="请输入用户名" style="width: 180px; margin:10px 5px;  " ></el-input>
            <el-input v-model="search.userPcTel" placeholder="请输入手机号码" style="width: 180px; margin:10px 5px;  "></el-input>
            <el-input v-model="search.userPcRealName" placeholder="请输入真实姓名"style="width: 180px;margin:10px 5px; "></el-input>
            <el-select v-model="search.userPcType" placeholder="用户类型选择" style="width: 180px; margin:10px 5px;  ">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="search.departmentId" placeholder="部门选择" style="width: 180px; margin:10px 5px;  " >
                <el-option
                        v-for="item in departmentIds"
                        :key="item.departmentId"
                        :label="item.departmentName"
                        :value="item.departmentId">
                </el-option>
            </el-select>
            <el-button type="primary" style="margin:10px 5px; " @click="searchUser">搜索</el-button>
            <!-- 新增弹出框 -->
            <el-button type="primary" style="margin:10px 5px; " @click="openAddPage">新增</el-button>
            <el-dialog title="PC端用户新增" :visible.sync="dialogFormVisible" width="40%" id="pcAddPage">
                <el-form :model="form" status-icon :rules="rules" ref="form">
                    <el-form-item label="用户名" :label-width="formLabelWidth" prop="pcUserName">
                        <el-input v-model="form.pcUserName" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" prop="pcPassword">
                        <el-input v-model="form.pcPassword" type="password" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" :label-width="formLabelWidth" prop="againPassword">
                        <el-input v-model="form.againPassword" type="password" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="userPcRealName">
                        <el-input v-model="form.userPcRealName" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="职称" :label-width="formLabelWidth" >
                        <el-input v-model="form.userPcPost" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input v-model="form.userPcEmail" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" :label-width="formLabelWidth" prop="userPcTel">
                        <el-input v-model="form.userPcTel" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" :label-width="formLabelWidth" prop="userPcIdCard">
                        <el-input v-model="form.userPcIdCard" autocomplete="off" style="width:500px"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" :label-width="formLabelWidth" prop="userPcType">
                        <el-select v-model="form.userPcType" placeholder="请选择用户类型" style="width:300px">
                            <el-option
                                    v-for="item in userPcTypeList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色类型" :label-width="formLabelWidth">
                        <el-select v-model="form.roleId" multiple placeholder="请选择用户角色" style="width:300px">
                            <el-option
                                    v-for="(item, index) in roleList"
                                    :key="index"
                                    :label="item.roleName"
                                    :value="item.roleId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门" :label-width="formLabelWidth" prop="departmentId" >
                        <el-select v-model="form.departmentId" placeholder="请选择部门" style="width:300px">
                            <el-option
                                    v-for="item in departmentIds"
                                    :key="item.departmentId"
                                    :label="item.departmentName"
                                    :value="item.departmentId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生成APP账号" :label-width="formLabelWidth" prop="isApp">
                        <el-switch
                                v-model="form.isApp"
                                :active-value="1"
                                :inactive-value="0"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
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
                    prop="pcUserName"
                    label="用户名">
            </el-table-column>
            <el-table-column
                    prop="userPcRealName"
                    label="真实姓名">
            </el-table-column>
            <el-table-column
                    prop="userPcTel"
                    label="手机号码">
            </el-table-column>
            <el-table-column
                    prop="userPcAge"
                    label="年龄">
            </el-table-column>
            <el-table-column
                    prop="userPcSex"
                    label="性别">
                <template slot-scope="scope">
                   {{scope.row.userPcSex=== 1 ? '男' : '女'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="userPcPost"
                    label="职称">
            </el-table-column>
            <el-table-column
                    prop="departmentId"
                    label="部门">
            </el-table-column>
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
                } else if (value !== this.form.pcPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                rules: {
                    pcPassword: [{ validator: validatePass, trigger: 'blur' }],
                    againPassword: [{ validator: validatePass2, trigger: 'blur' }],
                    pcUserName:[{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                    userPcIdCard:[{required: true, trigger: 'blur', ...util.rules.idcard}],
                    userPcTel :[{required: true,  trigger: 'blur', ...util.rules.cellphone}],
                    //departmentId :[{ type: 'array', required: true, message: '部门不能为空', trigger: 'change' }],
                    //userPcType: [{required: true,type: 'array', message: '用户类型不能为空', trigger: 'change' }]
                },
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                form: {
                    pcUserName: '',
                    userPcTel: '',
                    userPcRealName: '',
                    userPcType: [],
                    pcPassword: '',
                    againPassword:'',
                    userPcEmail:'',
                    userPcPost: '',
                    userPcIcon: '',
                    userPcIdCard: '',
                    departmentId: [],
                    roleId: [],
                    isApp: 0
                },
                userPcTypeList:[
                    {name:'公司管理人员',value: 0},
                    {name:'项目人员',value: 1}
                ],
                formLabelWidth: '120px',
            //////////////////////////
                /*选中删除*/
                multipleSelection: [],
                search:{
                    pcUserName: null,
                    userPcTel:null,
                    userPcRealName:null,
                    userPcType:null,
                    departmentId:null
                },
                departmentIds: [],
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
                //获取用户详情
                this.getUserPcDetail(row);
                //加载用户角色列表
                this.roleListGet();
                console.log('aaa', this.form)
                this.dialogFormVisible = true;
            },
            //获取用户详情(获取当前用户角色)
            getUserPcDetail(row){
                this.api.getUserPcDetail(row).then(res => {
                    this.userRoles = res.data
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
                        this.dialogFormVisible = false;
                        this.form.roleId = this.form.roleId.map(e => {
                            let roles = this.userRoles.filter(e2 => {
                                return e2.roleId == e
                            })
                            if (roles.length > 0) {
                                return roles[0]
                            } else {
                                return {roleId: e}
                            }
                        })
                        console.log("form", this.form)
                        this.api.addUserPc(this.form).then(res =>{
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
                this.api.callApi('/UserPc/select',{
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
                this.api.callApi('/UserPc/select',{
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
            this.initDatas();
            this.infoGet();
        }
    }
</script>