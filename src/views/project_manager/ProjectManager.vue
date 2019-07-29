<template>
    <div>
        <div style="float: left; margin: 20px 0;">
            <el-input v-model="search.projectName" placeholder="请输入项目名称" style="width: 180px; margin:10px 5px;  " ></el-input>
            <el-input v-model="search.buildingUnit" placeholder="请输入建设单位" style="width: 180px; margin:10px 5px;  "></el-input>
            <el-input v-model="search.constructUnit" placeholder="请输入施工单位"style="width: 180px;margin:10px 5px; "></el-input>
            <el-input v-model="search.designUnit" placeholder="请输入施工单位"style="width: 180px;margin:10px 5px; "></el-input>
            <el-button type="primary" style="margin:10px 5px; " @click="searchProject">搜索</el-button>
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
                    label="创建时间">
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
                tableData: []
            }
        },
        methods: {
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
            }
        },
        mounted() {
            this.initDatas();
        }
    }
</script>