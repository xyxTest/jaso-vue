<template>
	<el-table
			:data="tableData"
			border
			style="width: 100%">
		<el-table-column
				fixed
				prop="date"
				label="日期"
				width="150">
		</el-table-column>
		<el-table-column
				prop="name"
				label="姓名"
				width="120">
		</el-table-column>
		<el-table-column
				prop="province"
				label="省份"
				width="120">
		</el-table-column>
		<el-table-column
				prop="city"
				label="市区"
				width="120">
		</el-table-column>
		<el-table-column
				prop="address"
				label="地址"
				width="300">
		</el-table-column>
		<el-table-column
				prop="sex"
				label="性别"
				width="100">
		</el-table-column>
		<el-table-column
				prop="tel"
				label="手机号码"
				width="300">
		</el-table-column>
		<el-table-column
				prop="card"
				label="身份证号码"
				width="300">
		</el-table-column>
		<el-table-column
				prop="zip"
				label="邮编"
				width="120">
		</el-table-column>
		<el-table-column
				fixed="right"
				label="操作"
				width="100">
			<template slot-scope="scope">
				<el-button @click="open3" type="text" size="small">查看</el-button>
				<el-button type="text" size="small">编辑</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>



<script>
    export default {
        methods: {
            open3() {
                this.$prompt('请输入邮箱', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                    inputErrorMessage: '邮箱格式不正确'
                }).then(({ value }) => {
                    this.$message({
                        type: 'success',
                        message: '你的邮箱是: ' + value
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            }
        },

        data() {
            return {
                tableData: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
					sex: '男',
					tel: '17612167237',
					card: '342423199303042070',
                    zip: 200333
                }, {
                    name: '王小虎',
                    date: '2016-05-02',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    sex: '男',
                    tel: '17612167237',
                    card: '342423199303042070',
                    zip: 200333
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    sex: '男',
                    tel: '17612167237',
                    card: '342423199303042070',
                    zip: 200333
                }]
            }
        }
    }
</script>