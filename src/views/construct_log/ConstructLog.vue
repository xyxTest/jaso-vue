<template>
    <div>
        <el-dialog title="施工日志新增" :visible.sync="dialogFormVisible" width="50%">
            <el-form :model="form" status-icon ref="form" :inline="true">
                <el-form-item label="日期" :label-width="formLabelWidth" prop="teamsName">
                    <div class="block">
                        <el-date-picker
                                v-model="form.constructDate"
                                style="width:85%"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="天气" :label-width="formLabelWidth" prop="weather">
                    <el-input v-model="form.weather" autocomplete="off" style="width:92%" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属标段" :label-width="formLabelWidth" prop="projectId">
                    <el-select v-model="form.projectTendersId" placeholder="请选择标段" style="width:92%">
                        <el-option
                                v-for="item in projectTendersList"
                                :key="item.projectTendersId"
                                :label="item.tendersName"
                                :value="item.projectTendersId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div v-if="roleType.includes(3)">
                    <el-form-item label="存在问题" :label-width="formLabelWidth" prop="existingProblemName">
                        <el-select v-model="form.existingProblemName" placeholder="请选择问题" style="width:92%">
                            <el-option
                                    v-for="item in existingProblemList"
                                    :key="item.existingProblemId"
                                    :label="item.existingProblemName"
                                    :value="item.existingProblemId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="次日主材申请" :label-width="formLabelWidth" prop="subjectMaterialName">
                        <el-select v-model="form.subjectMaterialName" placeholder="请选择主材" style="width:92%">
                            <el-option
                                    v-for="item in subjectMaterialList"
                                    :key="item.subjectMaterialId"
                                    :label="item.subjectMaterialName"
                                    :value="item.subjectMaterialId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="次日机械申请" :label-width="formLabelWidth" prop="machineryName">
                        <el-select v-model="form.machineryName" placeholder="请选择机械" style="width:92%">
                            <el-option
                                    v-for="item in machineryList"
                                    :key="item.machineryId"
                                    :label="item.machineryName"
                                    :value="item.machineryId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="自检报告" :label-width="formLabelWidth" prop="selfCheckReport">
                        <el-select v-model="form.selfCheckReport" placeholder="请选择类型" style="width:92%">
                            <el-option
                                    v-for="item in selfReportList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="图片" :label-width="formLabelWidth" prop="selfCheckReport">
                        <el-upload
                                class="upload-demo"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                multiple>
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                </div>
            </el-form>
            <div v-if="roleType.includes(1) || roleType.includes(3)">
                <div class="dialogMid">
                    <i class="el-icon-info"></i>
                    <span>生产情况记录</span>
                </div>
                <div class="secondTableDiv">
                    <el-table :data="logDetailListProduction">
                        <el-table-column align="center"  label="序号" type="index" ></el-table-column>
                        <el-table-column align="center" label="开始时间" prop="productionStartTime" ></el-table-column>
                        <el-table-column align="center" label="结束时间" prop="productionEndTime" ></el-table-column>
                        <el-table-column align="center" label="施工部位" prop="productionConstructPart" ></el-table-column>
                        <el-table-column align="center" label="施工内容" prop="productionConstructContent" ></el-table-column>
                        <el-table-column align="center" label="完成工作量" prop="productionWorkLoad" ></el-table-column>
                        <el-table-column align="center" >
                            <template slot-scope="scope">
                                <div class="operation-btns">
                                    <el-button type="primary"  :disabled="actionStatus !== 'add'" size="small" @click="handleLogDetailDelete(scope.row,1)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="threeTableDiv">
                    <el-form ref="dialogProductionForm" :model="productionFormList">
                        <div>
                            <div class="block threeTableDiv_select" style="margin-left:50px;">
                                <el-time-select
                                v-model="productionFormList.productionStartTime"
                                 class="selectWidth3"
                                placeholder="开始时间">
                                </el-time-select>
                            </div>
                            <div class="block threeTableDiv_select">
                                <el-time-select
                                v-model="productionFormList.productionEndTime"
                                class="selectWidth3"
                                placeholder="结束时间">
                                </el-time-select>
                            </div>
                            <div class="threeTableDiv_select">
                                <el-form-item prop="productionConstructParts">
                                     <el-cascader
                                            expand-trigger="hover"
                                            placeholder="施工部位"
                                            class="selectWidth"
                                            :options="projectBuidlingTree"
                                            :props="optionProps"
                                            filterable
                                            v-model="productionFormList.productionConstructPart"
                                            @change="handleConstructProgressConstructPartChange">
                                    </el-cascader>
                                </el-form-item>
                            </div>                          
                            <div class="threeTableDiv_select">
                                <el-form-item prop="constructContentTemp">
                                    <el-select v-model="productionFormList.productionConstructContent" @change="setUnit" filterable placeholder="施工內容" class="selectWidth2">
                                        <el-option
                                                v-for="item in constructContentList"
                                                :key="item.constructContentId"
                                                :label="item.constructContentName"
                                                :value="item.constructContentId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="threeTableDiv_select">
                                <el-input v-model="productionFormList.productionWorkLoad"  placeholder="完成工作量" class="selectWidth" ></el-input>
                            </div>
                        </div>
                        <div class="threeTableDiv_button">
                            <el-button type="primary" icon="el-icon-plus" @click="handleTypeAdd(1)">添加生产情况</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
            <div v-if="roleType.includes(2)">
                <div class="dialogMid">
                    <i class="el-icon-info"></i>
                    <span>工作内容记录</span>
                </div>
                <div class="secondTableDiv">
                    <el-table :data="logDetailListJobContent">
                        <el-table-column align="center"  label="序号" type="index" ></el-table-column>
                        <el-table-column align="center" label="内容分类" prop="jobContentContentType" ></el-table-column>
                        <el-table-column align="center" label="内容描述" prop="jobConentContentDescribe" ></el-table-column>
                        <el-table-column align="center" label="备注" prop="jobContentRemark" ></el-table-column>
                        <el-table-column align="center" >
                            <template slot-scope="scope">
                                <div class="operation-btns">
                                    <el-button type="primary"  :disabled="actionStatus !== 'add'" size="small" @click="handleLogDetailDelete(scope.row,2)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="threeTableDiv">
                    <el-form ref="dialogJobContentForm" :model="jobContentFormList">
                        <div class="threeTableDiv_select">
                            <el-form-item prop="constructPartId">
                                <el-select
                                        placeholder="内容分类"
                                        class="selectWidth"
                                        style="margin-left: 38px"
                                        filterable
                                        v-model="jobContentFormList.jobContentContentType"
                                        :disabled="actionStatus !== 'add'"
                                        @change="handleConstructPartChange" >
                                    <el-option
                                            v-for="item in constructContentTypeList"
                                            :key="item.constructContentTypeId"
                                            :label="item.constructContentTypeName"
                                            :value="item.constructContentTypeName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="threeTableDiv_select">
                            <el-input v-model="jobContentFormList.jobConentContentDescribe"  placeholder="内容描述" class="selectWidth" ></el-input>
                        </div>
                        <div class="threeTableDiv_select">
                            <el-input v-model="jobContentFormList.jobContentRemark"  placeholder="备注" class="selectWidth" ></el-input>
                        </div>
                        <div class="threeTableDiv_button" style="padding-top: 5px;">
                            <el-button type="primary" icon="el-icon-plus" @click="handleTypeAdd(2)">添加工作内容</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
            <div v-if="roleType.includes(2)">
                <div class="dialogMid">
                    <i class="el-icon-info"></i>
                    <span>施工进度记录</span>
                </div>
                <div class="secondTableDiv">
                    <el-table :data="logDetailListProgress">
                        <el-table-column align="center"  label="序号" type="index" ></el-table-column>
                        <el-table-column align="center" label="开始时间" prop="constructProgressStartTime" ></el-table-column>
                        <el-table-column align="center" label="结束时间" prop="constructProgressEndTime" ></el-table-column>
                        <el-table-column align="center" label="施工部位" prop="constructProgressConstructPart" ></el-table-column>
                        <el-table-column align="center" label="施工内容" prop="constructProgressConstructContent" ></el-table-column>
                        <el-table-column align="center" label="班组" prop="constructProgressTeams" ></el-table-column>
                        <el-table-column align="center" label="工作进度" prop="constructProgressNums" ></el-table-column>
                        <el-table-column align="center" >
                            <template slot-scope="scope">
                                <div class="operation-btns">
                                    <el-button type="primary"  :disabled="actionStatus !== 'add'" size="small" @click="handleLogDetailDelete(scope.row,3)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="threeTableDiv">
                    <el-form ref="dialogConstructProgressForm" :model="constructProgressFormList">
                        <div class="threeTableDiv_select">
                            <div class="block threeTableDiv_select" style="margin-left:50px;">
                                 <el-time-select
                                v-model="constructProgressFormList.constructProgressStartTime"
                                class="selectWidth3"
                                placeholder="开始时间">
                                </el-time-select>
                            </div>
                            <div class="block threeTableDiv_select">
                                 <el-time-select
                                v-model="constructProgressFormList.constructProgressEndTime"
                                class="selectWidth3"
                                placeholder="结束时间">
                                </el-time-select>
                            </div>
                            <div class="threeTableDiv_select">
                                <el-form-item prop="projectBuildingId">
                                    <el-cascader
                                            expand-trigger="hover"
                                            placeholder="施工部位"
                                            class="selectWidth3"
                                            filterable
                                            :options="projectBuidlingTree"
                                            :props="optionProps"
                                            v-model="constructProgressFormList.constructProgressConstructPart"
                                            @change="handleConstructProgressConstructPartChange">
                                    </el-cascader>
                                </el-form-item>
                            </div>
                            <div class="threeTableDiv_select">
                                <el-form-item prop="constructContentTemp">
                                    <el-select v-model="constructProgressFormList.constructProgressConstructContent" filterable placeholder="施工內容" style="margin-left:42px" class="selectWidth3">
                                        <el-option
                                                v-for="item in constructContentList"
                                                :key="item.constructContentId"
                                                :label="item.constructContentName"
                                                :value="item.constructContentName+'('+item.constructContentUnit+')'">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="threeTableDiv_select">
                                <el-form-item prop="projectTeamId">
                                    <el-select v-model="constructProgressFormList.constructProgressTeams" placeholder="班組" class="selectWidth3">
                                        <el-option
                                                v-for="item in projectTeamList"
                                                :key="item.projectTeamsId"
                                                :label="item.teamsName"
                                                :value="item.teamsName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="threeTableDiv_select">
                                <el-input placeholder="工作进度" v-model="constructProgressFormList.constructProgressNums" class="selectWidth3">
                                     <template slot="append">%</template>
                                </el-input>
                            </div>
                        </div>
                        <div class="threeTableDiv_button" style="padding-top: 5px;">
                            <el-button type="primary" icon="el-icon-plus" @click="handleTypeAdd(3)">添加施工进度</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
            <div v-if="roleType.includes(4)">
                <div class="dialogMid">
                    <i class="el-icon-info"></i>
                    <span>工作事务记录</span>
                </div>
                <div class="secondTableDiv">
                    <el-table :data="logDetailListWorkThings">
                        <el-table-column align="center"  label="序号" type="index" ></el-table-column>
                        <el-table-column align="center" label="内容分类" prop="workThingsContentType" ></el-table-column>
                        <el-table-column align="center" label="内容描述" prop="workThingsContentDescribe" ></el-table-column>
                        <el-table-column align="center" label="备注" prop="workThingsRemark" ></el-table-column>
                        <el-table-column align="center" >
                            <template slot-scope="scope">
                                <div class="operation-btns">
                                    <el-button type="primary"  :disabled="actionStatus !== 'add'" size="small" @click="handleLogDetailDelete(scope.row,4)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="threeTableDiv">
                    <el-form ref="dialogWorkThingsForm" :model="workThingsFormList">
                        <div class="threeTableDiv_select">
                            <el-form-item prop="constructPartId">
                                <el-select
                                        placeholder="内容分类"
                                        class="selectWidth"
                                        style="margin-left: 38px"
                                        filterable
                                        v-model="workThingsFormList.workThingsContentType"
                                        :disabled="actionStatus !== 'add'"
                                        @change="handleConstructPartChange" >
                                    <el-option
                                            v-for="item in constructContentTypeList"
                                            :key="item.constructContentTypeId"
                                            :label="item.constructContentTypeName"
                                            :value="item.constructContentTypeName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="threeTableDiv_select">
                            <el-input v-model="workThingsFormList.workThingsContentDescribe"  placeholder="内容描述" class="selectWidth" ></el-input>
                        </div>
                        <div class="threeTableDiv_select">
                            <el-input v-model="workThingsFormList.workThingsRemark"  placeholder="备注" class="selectWidth" ></el-input>
                        </div>
                        <div class="threeTableDiv_button" style="padding-top: 5px;">
                            <el-button type="primary" icon="el-icon-plus" @click="handleTypeAdd(4)">添加工作事物</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-button type="primary" style="margin:10px 30px;float:right; " @click="openAddPage">新增</el-button>
        <!-- 新增弹出框底层 -->
        <el-button type="danger" @click="deleteSelect" style="margin:10px 5px; float:right;">删除选中</el-button>
       <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <template  v-for="(item, index) in props.row.contentList">
                        <el-form inline :key="index" class="demo-table-expand">
                            <el-form-item label="存在问题:" v-if="item.existingProblems">
                                <span>{{ item.existingProblems }}</span>
                            </el-form-item>
                            <el-form-item label="次日主材申请:" v-if="item.subjectMaterialApplication">
                                <span>{{ item.subjectMaterialApplication }}</span>
                            </el-form-item>
                            <el-form-item label="次日机械申请:" v-if="item.machineryApplication">
                                <span>{{ item.machineryApplication }}</span>
                            </el-form-item>
                            <el-form-item label="自检报告:" v-if="item.selfCheckReport">
                                <span>{{ item.selfCheckReport }}</span>
                            </el-form-item>
                            <el-form-item label="图片:" v-if="item.pics">
                                <span>{{ item.pics }}</span>
                            </el-form-item>
                            <el-form-item label="生产情况-开始时间:" v-if="item.productionStartTime">
                                <span>{{ item.productionStartTime }}</span>
                            </el-form-item>
                            <el-form-item label="生产情况-结束时间:" v-if="item.productionEndTime">
                                <span>{{ item.productionEndTime }}</span>
                            </el-form-item>
                            <el-form-item label="生产情况-施工部位:" v-if="item.productionConstructPart">
                                <span>{{ item.productionConstructPart }}</span>
                            </el-form-item>
                            <el-form-item label="生产情况-施工内容:" v-if="item.productionConstructContent">
                                <span>{{ item.productionConstructContent }}</span>
                            </el-form-item>
                            <el-form-item label="生产情况-完成工作量:" v-if="item.productionWorkLoad">
                                <span>{{ item.productionWorkLoad }}</span>
                            </el-form-item>
                            <el-form-item label="工作内容-内容分类:" v-if="item.jobContentContentType">
                                <span>{{ item.jobContentContentType }}</span>
                            </el-form-item>
                            <el-form-item label="工作内容-内容描述:" v-if="item.jobConentContentDescribe">
                                <span>{{ item.jobConentContentDescribe }}</span>
                            </el-form-item>
                            <el-form-item label="工作内容-备注:" v-if="item.jobContentRemark">
                                <span>{{ item.jobContentRemark }}</span>
                            </el-form-item>
                            <el-form-item label="施工进度-开始时间:" v-if="item.constructProgressStartTime">
                                <span>{{ item.constructProgressStartTime }}</span>
                            </el-form-item>
                            <el-form-item label="施工进度-结束时间:" v-if="item.constructProgressEndTime">
                                <span>{{ item.constructProgressEndTime }}</span>
                            </el-form-item>
                            <el-form-item label="施工进度-施工部位:" v-if="item.constructProgressConstructPart">
                                <span>{{ item.constructProgressConstructPart }}</span>
                            </el-form-item>
                            <el-form-item label="施工进度-施工内容:" v-if="item.constructProgressConstructContent">
                                <span>{{ item.constructProgressConstructContent }}</span>
                            </el-form-item>
                            <el-form-item label="施工进度-班组:" v-if="item.constructProgressTeams">
                                <span>{{ item.constructProgressTeams }}</span>
                            </el-form-item>
                            <el-form-item label="施工进度-施工进度:" v-if="item.constructProgressNums">
                                <span>{{ item.constructProgressNums }}</span>
                            </el-form-item>
                            <el-form-item label="工作事务-内容类型:" v-if="item.workThingsContentType">
                                <span>{{ item.workThingsContentType }}</span>
                            </el-form-item>
                            <el-form-item label="工作内容-内容描述:" v-if="item.workThingsContentDescribe">
                                <span>{{ item.workThingsContentDescribe }}</span>
                            </el-form-item>
                            <el-form-item label="工作内容-备注:" v-if="item.workThingsRemark">
                                <span>{{ item.workThingsRemark }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
            label="项目名称"
            prop="constructLog.projectName">
            </el-table-column>
            <el-table-column
            label="标段"
            prop="constructLog.tendersName">
            </el-table-column>
            <el-table-column
            label="日期"
            prop="constructLog.constructDate">
            </el-table-column>
             <el-table-column
            label="姓名"
            prop="constructLog.userRealName">
            </el-table-column>
            <el-table-column
            label="天气"
            prop="constructLog.weather">
            </el-table-column>
             <el-table-column
                        label="操作">
                    <template slot-scope="scope">
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
    import {amapKey } from '@/filters';
    import axios from 'axios';
    import constructLogApi from '../../jaso_api/constructLogApi.js';
    var pageParams = {page: {pageSize: 10, pageNo: 1}};
    var currentUserTypeList=[];
    export default {
        data() {
            return {
                optionProps: {
                    value: 'label',
                    label: 'label',
                    children: 'children'
                },
               
                optionPropsb: {
                    value: 'label',
                    label: 'label',
                    children: 'children'
                },
                value1:'',
                roleType:[],
                num:"",
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                contentPage: {
                    pageNo: 1,
                    pageSize: 1000,
                    total: 0
                },
                selfReportList: [{//自检报告（1、合格 2、不合格 3、施工中）
                    value: 1,
                    label: '合格'
                }, {
                    value: 2,
                    label: '不合格'
                },{
                    value: 3,
                    label: '施工中'
                }],
                constructContentOptions:[],
                actionStatus: 'add',
                projectBuidlingTree:[],//施工部位结构树
                constructContentList:[],//施工内容列表
                constructContentTypeList:[],//内容分类
                existingProblemList:[],//存在问题
                subjectMaterialList:[],//主材获取
                machineryList:[],//机械获取
                projectTeamList:[],//班组列表
                productionList:[],//生产情况
                workContentList:[],//工作内容
                progressList:[],//施工进度
                workThingsList:[],//工作事务
                tableData: [],
                /*新增弹出框操作*/
                dialogTableVisible: false,
                dialogFormVisible: false,
                projectTendersList:[],
                projectList: [],
                form: {
                    constructDate:'',
                    projectId: '',
                    projectTendersId:'',
                    weather:'',
                    existingProblems:'',
                    subjectMaterialApplication:'',
                    machineryApplication:'',
                    selfCheckReport:'',
                    pics:'',
                    peopleNum:''
                },
                productionFormList:{
                    productionStartTime:"",
                    productionEndTime:"",
                    productionConstructPart:"",
                    productionConstructContent:"",
                    productionConstructUnit:'',
                    productionWorkLoad:""
                },
                jobContentFormList:{
                    jobContentContentType:"",
                    jobConentContentDescribe:"",
                    jobContentRemark:""
                },
                constructProgressFormList:{
                    constructProgressStartTime:"",
                    constructProgressEndTime:"",
                    constructProgressConstructPart:"",
                    constructProgressConstructContent:"",
                    constructProgressTeams:"",
                    constructProgressNums:""
                },
                workThingsFormList:{
                    workThingsContentType:"",
                    workThingsContentDescribe:"",
                    workThingsRemark:""
                },
                logDetailListProduction:[],
                logDetailListJobContent:[],
                logDetailListProgress:[],
                logDetailListWorkThings:[],
                logDetailAllList:[],
                formLabelWidth: '120px',
                //////////////////////////
                /*选中删除*/
                multipleSelection: []
            }
        },
        methods: {
            //当施工内容改变时，随之改变绑定完成工作量的单位
            setUnit(params){
                this.constructContentList.forEach(el =>{
                    if(el.constructContentId==params){
                        this.productionFormList.productionConstructUnit=el.constructContentUnit
                        this.productionFormList.productionConstructContent=el.constructContentName;
                    }
                })
            },
            handleConstructProgressConstructPartChange(){
            },
            handleTypeAdd(params) {
                if(params==1){      
                    // 验证表单
                    this.$refs.dialogProductionForm.validate((valid) => {
                        if (valid) {
                            this.productionFormList.productionWorkLoad=this.productionFormList.productionWorkLoad+this.productionFormList.productionConstructUnit;
                            let str='';
                            for(var i=0;i<this.productionFormList.productionConstructPart.length;i++){
                                str=str+this.productionFormList.productionConstructPart[i];
                            }
                            this.productionFormList.productionConstructPart=str;
                            const detail = JSON.parse(JSON.stringify(this.productionFormList));
                            detail.index = this.logDetailListProduction.length;
                            this.logDetailListProduction.push(detail);
                            this.$refs.dialogProductionForm.resetFields();
                            // 信息添加
                            //this.$refs.dialogLogDetailForm.$el.reset();
                        }
                    });
                }
                if(params==2){
                    this.$refs.dialogJobContentForm.validate((valid) => {
                        if (valid) {
                            // 信息添加
                            const detail = JSON.parse(JSON.stringify(this.jobContentFormList));
                            detail.index = this.logDetailListJobContent.length;
                            this.logDetailListJobContent.push(detail);
                            this.$refs.dialogJobContentForm.resetFields();
                            //this.$refs.dialogLogDetailForm.$el.reset();
                        }
                    });
                }
                if(params==3){
                    this.$refs.dialogConstructProgressForm.validate((valid) => {
                        if (valid) {
                            // 信息添加
                            //进度手动设置%
                            debugger
                            this.constructProgressFormList.constructProgressNums=this.constructProgressFormList.constructProgressNums+"%";
                            //施工部位各级整合
                             let str='';
                            for(var i=0;i<this.constructProgressFormList.constructProgressConstructPart.length;i++){
                                str=str+this.constructProgressFormList.constructProgressConstructPart[i];
                            }
                            this.constructProgressFormList.constructProgressConstructPart=str;
                            const detail = JSON.parse(JSON.stringify(this.constructProgressFormList));
                            detail.index = this.logDetailListProgress.length;
                            this.logDetailListProgress.push(detail);
                            this.$refs.dialogConstructProgressForm.resetFields();
                            //this.$refs.dialogLogDetailForm.$el.reset();
                        }
                    });
                }
                if(params==4){
                    this.$refs.dialogWorkThingsForm.validate((valid) => {
                        if (valid) {
                            // 信息添加
                            const detail = JSON.parse(JSON.stringify(this.workThingsFormList));
                            detail.index = this.logDetailListWorkThings.length;
                            this.logDetailListWorkThings.push(detail);
                            this.$refs.dialogWorkThingsForm.resetFields();
                            //this.$refs.dialogLogDetailForm.$el.reset();
                        }
                    });
                }
            },
            //施工内容绑定事件
            handleConstructContentChange(){

            },
            //施工部位绑定事件
            handleConstructPartChange(){

            },
            handleUserIdListChange(){

            },
            //新增页面
            openAddPage(){
                var _this = this;
                if(this.utils.checkProject(_this)){
                    //获取当前项目的cityCode,通过cityCode获取天气
                    var cityCode = JSON.parse(window.sessionStorage.getItem('cityCode'));
                    console.log('city',cityCode);
                    axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
                        params:{
                        "city":cityCode,
                        "key":"8fd4655c8ad5b554912b1aa8c6ab1e89",
                        "extensions": 'all'}
                    }).then( (response) => {
                        debugger
                        this.form.weather=response.data.forecasts[0].casts[0].dayweather+";"+response.data.forecasts[0].casts[0].daytemp+";"+response.data.forecasts[0].casts[0].daypower+";"
                        +response.data.forecasts[0].casts[0].nightweather+";"+response.data.forecasts[0].casts[0].nighttemp+";"+response.data.forecasts[0].casts[0].nightpower;
                    }).catch(function (error) {
                        console.log(error);
                    });
                    //获取当前用户的角色
                    var projectId= JSON.parse(window.sessionStorage.getItem('projectId'));
                    constructLogApi.getConstructLogRole({
                        'projectId':projectId
                    }).then(res => {
                        this.roleType=res.data;
                        if(res.data.length==0){
                            this.$message.info("当前用户没有添加权限");
                        }else{
                            //获取项目标段
                            this.api.getProjectTendersListByProjectId({"projectId":projectId}).then(res =>{
                                this.projectTendersList=res.data;
                            }).catch(res =>{
                            });
                            if(this.roleType.includes(1) || this.roleType.includes(2) || this.roleType.includes(3)){//工人
                                //（1）施工部位获取
                                constructLogApi.getProjectBuildingTree({"projectId":projectId}).then(res =>{
                                    this.projectBuidlingTree=res.data;
                                }).catch(res =>{
                                });
                                //（2）施工内容获取
                                constructLogApi.getConstructContentByRole({"pageVo":this.contentPage,"roleTypes":this.roleType}).then(res =>{
                                    debugger
                                    this.constructContentList = res.data
                                }).catch(res =>{
                                });
                            }
                            if(this.roleType.includes(2)){//施工员
                                //(1)类容分类获取
                                constructLogApi.getAllConstructContentType({"projectId":projectId}).then(res =>{
                                    this.constructContentTypeList=res.data;
                                }).catch();
                                //(2)班组获取
                                constructLogApi.getAllProjectTeam({"projectId":projectId}).then(res =>{
                                    this.projectTeamList=res.data;
                                }).catch();
                            }
                            if(this.roleType.includes(3)){//班组长
                                //(1)all存在问题获取接口
                                constructLogApi.getAllExistingProblem({"projectId":projectId}).then(res =>{
                                    this.existingProblemList=res.data;
                                }).catch();
                                ////(2)all次日主材获取
                                 constructLogApi.getAllSubjectMaterial({"projectId":projectId}).then(res =>{
                                    this.subjectMaterialList=res.data;
                                }).catch();
                                ////(3)all机械获取
                                constructLogApi.getAllMachinery({"projectId":projectId}).then(res =>{
                                    this.machineryList=res.data;
                                }).catch();
                            }
                            this.dialogFormVisible = true;
                        }
                    });
                }
            },
            resetForm(form) {
                this.dialogFormVisible = false;
            },
            //提交
            submit(form){
                debugger
                let newArr = [...this.logDetailListJobContent, ...this.logDetailListProgress, ...this.logDetailListProduction, ...this.logDetailListWorkThings];
                console.log('newArr',newArr);
                console.log('this.form',this.form);
                this.form.projectId=sessionStorage.getItem("projectId");
                debugger
                constructLogApi.addConstructLog({"constructLog":this.form,"contentList":newArr}).then(res =>{
                    this.initDatas();
                    this.dialogFormVisible = false;
                    this.$message.success(res.message);
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除选中
            deleteSelect(row){
                constructLogApi.deleteConstructLog(this.multipleSelection.constructLog).then( res =>{
                    this.$message.success(res.message);
                    this.initDatas();
                }).catch(res =>{
                    this.$message.error(res.message);
                });
            },
            //删除按钮
            deleteSelects(row){
                constructLogApi.deleteConstructLog([row.constructLog]).then( res =>{
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
                    this.projectList=res.data;
                }).catch(res => {

                });
            },
            initDatas(){
                constructLogApi.getConstructLogList({
                    'pageVo':{
                        "pageSize": pageParams.page.pageSize,
                        "pageNo": pageParams.page.pageNo
                    },
                    'projectId':JSON.parse(sessionStorage.getItem("projectId"))
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
            handleLogDetailDelete(params,paramsType) {

                const detailList = [];
                if(paramsType==1){
                    this.logDetailListProduction.forEach((item) => {
                        if (item.index !== params.index) {
                            item.index = detailList.length;
                            detailList.push(item);
                        }
                    });
                    this.logDetailListProduction = detailList;
                }
                if(paramsType==2){
                    this.logDetailListJobContent.forEach((item) => {
                        if (item.index !== params.index) {
                            item.index = detailList.length;
                            detailList.push(item);
                        }
                    });
                    this.logDetailListJobContent= detailList;
                }
                if(paramsType==3){
                    this.logDetailListProgress.forEach((item) => {
                        if (item.index !== params.index) {
                            item.index = detailList.length;
                            detailList.push(item);
                        }
                    });
                    this.logDetailListProgress = detailList;
                }
                if(paramsType==4){
                    this.logDetailListWorkThings.forEach((item) => {
                        if (item.index !== params.index) {
                            item.index = detailList.length;
                            detailList.push(item);
                        }
                    });
                    this.logDetailListWorkThings = detailList;
                }
            },
        },
        mounted() {
            this.initDatas();
            this.getProjectList();
        }
    }
</script>
<style lang="scss" scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .formStyle{

        float: left;
    }
    .threeTableDiv_select{
        margin-left:10px;
        margin-top: 5px;
        float: left;
    }
    .threeTableDiv_button{
        width:720px;
        text-align: center;
    }
    .dialogMid {
        background-color: #F5F5F5;
        height: 36px;
        width: 87%;
        margin-top: 10px;
        i {
            float: left;
            line-height: 36px;
            margin-left: 10px;
            color: #409EFF;
        }
        span {
            color: #909399;
            font-size: 13px;
            line-height: 36px;
            margin-left: 10px;
            float: left;
        }
        margin-left: 50px;
    }
    .secondTableDiv{
        margin-left: 50px;
    }
    .selectWidth{
        width:130px;
    }
    .selectWidth2{
        width:122px;
    }
    .selectWidth3{
        width:200px;
    }

</style>