<template>
	<div class="body-div">
		<el-dialog size="small" :title="dialog.title" :visible.sync="dialog.show" >	
			<easy-form :columns='form.columns' :look-up='form.lookUp' v-model="form.data" @submit="submit" @cancel='cancel'></easy-form>
		</el-dialog>
		<div class="select-div">
            <el-row>
                <el-col :span="20"><select-bar :choose="selects" @search='search'></select-bar></el-col>
                <el-col :span="4" style="margin-top:20px;text-align:right;"><el-button @click="addition">添加</el-button></el-col>
            </el-row>
		</div>
		<div class="table-div">
			<easy-table @click="tableCilck" :table='table'></easy-table>
		</div>
	</div>
</template>
<script>
	//current access api parameters
	var pageParam = null;
	//NAME: access controller mapping,SUB:the sub attribute in parameters
	const NAME = 'MryContent',SUB = 'content';
	import selectBar from '../../components/selectBar1_0'
	import easyForm from '../../components/easyForm'
	import easyTable from '../../components/easyTable'
	var contentModuleTypeFilter = {'0':'精选文章','1':'CWS专家团','2':'会员活动'}
	export default {
		components:{ selectBar, easyForm, easyTable	},
		data(){
			return{
				//dialog attribute
				dialog: {
					title:'',
					show:false
				},
				//the component easy-form attribute
				form: {
					columns:[
						{prop:'contentModuleType',label:'内容模块',type:'select',rule:'notnull', filter:contentModuleTypeFilter,options:[{label:'精选文章',value:'0'},{label:'CWS专家团',value:'1'},{label:'会员活动',value:'2'}]},
						{prop:'title',type:'input',label:'内容标题',rule:'notnull'},
						{prop:'contentUrl',type:'input',label:'内容链接',rule:'notnull'},
						{prop:'sortIndex',type:'input',label:'排序规则',rule:['notnull','number']},
						{prop:'contentDate',type:'date',label:'内容时间',rule:'notnull',filter:'yyyy-MM-dd'},
						{prop:'coverImg',type:'upImage',label:'封面图片',rule:'notnull'}
					],
					data:{},
					lookUp:false
				},
				//the component select-bar attributes
				selects:[
						{prop:'contentModuleType',label:'内容模块',type:'select', options:[{label:'精选文章',value:'0'},{label:'CWS专家团',value:'1'},{label:'会员活动',value:'2'}]},
						{prop:'title',label:'内容标题',type:'input'},
						{prop:'contentUrl',label:'内容链接',type:'input'}
					],
				//the component page-table attributes
				table:{
					columns:[ 	{prop:'contentModuleType',label:'内容模块',filter:{'0':'精选文章','1':'CWS专家团','2':'会员活动'}},
								{ prop:'title', label:'内容标题' },{ prop:'contentUrl', label:'内容链接' },{ prop:'sortIndex', label:'排序规则',sortable:true},
								{ prop:'contentDate', label:'内容时间', filter:'yyyy-MM-dd'}
							],
					data:[],
					page:{ pageSize:10, pageNo:1, total:0 },
					menu:{label:'操作',columns:[{prop:'edit',label:'编辑'},{prop:'delete',label:'删除'},{prop:'detail',label:'详情'}]}
				},
				
			}
		},
		methods:{
			//on add button was clicked,init form data and show dialog
			addition () {
				this.form.data = this.util.emptyObj(this.form.data)
				this.openDialog('添加信息',false);
			},
			//on cancel button was clicked of form, let dialog dispear
			cancel () {
				this.dialog.show = false; 
			},
			//on submit button was clicked of form, if form columns has rule attribute, the parameters 'flag' return true or false
			submit (flag) {
				if (flag) {
					let param = this.createParam(this.form.data);
					if (this.dialog.title == '添加信息') {
						this.insert(param)
					} else {
						this.update(param);
					}
					this.dialog.show = false; 
				}
			},
			//on table was clicked
			tableCilck (params) {
				if ('$page' == params.prop) {
					pageParam.page = this.table.page;
					this.loadTable();
				} else if ('edit' == params.prop) {
					this.form.data =  params.row;
					this.openDialog('修改信息',false);
				} else if ('delete' == params.prop) {
					let param = this.createParam(params.row);
					this.util.tip('删除').then (res => { this.delete(param); });
				} else if ('detail' == params.prop) {
					this.form.data = params.row;
					this.openDialog('详细信息',true);
				}
			},
			//access api 'search' and reset table data
			loadTable () {
				this.api.search(NAME,pageParam).then(res => {
					this.table.data = res.data.data;
					this.table.page = res.data.page;
				});
			},
			//function,  set dialog attribute
			openDialog (title,look) {
				this.dialog.title = title;
				this.form.lookUp = look;
				this.dialog.show = true;
			},
			//functioni,  set tip message
			success(msg) {
				this.$message({
					type:'success',
					message:msg
				})
				this.loadTable();
			},
			createParam(params) {
				let param = {};
				param[SUB] = params;
				return param;
			},
			// access api 'insert' and reset table data when api was called success
			insert (param) {
				this.api.insert(NAME,param).then(res => {
					this.success('添加成功')
				})
			},
			// access api 'search' and reset table data when api was called success
			search (param) {
				pageParam[SUB] = param;
				this.loadTable();
			},
			// access api 'delete' and reset table data when api was called success
			delete(param) {
				this.api.delete(NAME,param).then(res => {
					this.success('删除成功')
				})
			},
			// access api 'update' and reset table data when api was called success
			update(param) {
				this.api.update(NAME,param).then(res => {
					this.success('更新成功')
				})
			},
			//init  some data and function about current page,
			init(){
				pageParam = {
					page:this.table.page
				} 
				pageParam[SUB] = {};
				this.loadTable();
			}
		},
		mounted() {
			this.init();
        }
	}
</script>
