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
            <el-select v-model="search.departmentId" placeholder="部门选择" style="width: 180px; margin:10px 5px;  " >
                <el-option
                        v-for="item in departmentIds"
                        :key="item.value1"
                        :label="item.departmentName"
                        :value="item.departmentId">
                </el-option>
            </el-select>
            <el-button type="primary" style="margin:10px 5px; " @click="searchUser">搜索</el-button>
            <el-button type="primary" style="margin:10px 5px; ">新增</el-button>
            <el-button type="danger" style="margin:10px 5px; ">删除选中</el-button>
        </div>
        <el-table
                :data="tableData"
                style="width: 100%"
                :row-class-name="tableRowClassName">
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
                    {{scope.row.userPcSex=== 1 ? '男' : '女'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="userAppPost"
                    label="职称">
            </el-table-column>
            <el-table-column
                    prop="departmentId"
                    label="部门">
            </el-table-column>
            <el-table-column
                    prop="userAppType"
                    label="用户类型">
                <template slot-scope="scope">
                    {{scope.row.userPcType=== 0 ? '公司管理人员' : '项目人员'}}
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="180px">
                <el-button type="text">编辑</el-button>
                <el-button type="text" style="color:red;">删除</el-button>
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
                search:{
                    appUserName: '',
                    userAppTel:'',
                    userAppRealName:'',
                    userAppType:'',
                    departmentId:'',
                    startTime:'',
                    endTime:''
                },
                departmentIds:{},
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                options: [{
                    value: '0',
                    label: '公司管理人员'
                }, {
                    value: '1',
                    label: '项目人员'
                }],
                value1:''
            }
        },
        methods: {
            infoGet(){
                ///加载部门信息
                var userInfo = JSON.parse(sessionStorage.getItem("user"));
                this.api.getDepartmentList({
                    //var userInfo = sessionStorage.getItem("user");
                    "companyId":userInfo.companyId
                }).then(res =>{
                    this.departmentIds=res.data.data;
                }).catch(res =>{

                });
                //加载
            },
            initDatas(){
                this.api.getUserAppList({
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
            searchUser(){
                this.api.getUserAppList({
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
            }
        },
        mounted() {
            this.initDatas();
            this.infoGet();
        }
    }
</script>