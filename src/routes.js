import Login from './views/Login.vue'
import DrawerPage from '@/views/measure_manager/components/DrawPage.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserPcManager from './views/system_manager/UserPcManager.vue'
import RoleManager from './views/system_manager/RoleManager.vue'
import NoticeManager from './views/system_manager/Notice.vue'
import MenuManager from './views/system_manager/MenuManager.vue'
import WorkTypeManager from './views/system_manager/WorkTypeManager.vue'
import DepartmentManager from './views/system_manager/DepartmentManager.vue'
import ImageChangeManager from './views/system_manager/ImageChangeManager.vue'
import FeedbackManager from './views/system_manager/FeedbackManager.vue'
import NewsInfoManager from './views/system_manager/NewsInfoManager.vue'
import ProjectManager from './views/project_manager/ProjectManager.vue'
import MeasureBuilding from './views/measure_manager/MeasureBuilding.vue'
import MeasurePaper from './views/measure_manager/MeasurePaper.vue'
import MeasureProblem from './views/measure_manager/MeasureProblem.vue'
import QualityCheck from './views/quality_manager/QualityCheck.vue'
import QualityFine from './views/quality_manager/QualityFine.vue'
import SecurityFine from './views/security_manager/SecurityFine.vue'
import SecurityCheck from './views/security_manager/SecurityCheck.vue'
import MeasureCount from './views/measure_manager/MeasureCount.vue'
import ProjectBuilding from './views/project_manager/ProjectBuilding.vue'
import ProjectTeams from './views/project_manager/ProjectTeams.vue'
import ProjectTenders from './views/project_manager/ProjectTenders.vue'
import ProjectNature from './views/project_manager/ProjectNature.vue'
import ProjectPaper from './views/project_manager/ProjectPaper.vue'
import MaterialCount from './views/material_manager/MaterialCount.vue'
import ProjectCheckType from './views/project_manager/ProjectCheckType.vue'
import echarts from './views/charts/echarts.vue'
import ConstructLog from './views/construct_log/ConstructLog';
import ConstructContent from './views/construct_log/ConstructContent';
import ConstructContentType from './views/construct_log/ConstructContentType';
import RoleConstruct from './views/construct_log/RoleConstruct';
import ExistingProblem from "./views/construct_log/ExistingProblem";
import Machinery from "./views/construct_log/Machinery";
import SubjectMaterial from "./views/construct_log/SubjectMaterial";
import ConstructionTask from "./views/construction_task/ConstructionTask.vue";
import StudyData from "./views/studyData_manager/StudyData.vue";
import StudyFile from "./views/studyData_manager/StudyFile.vue";
import StudyEvent from "./views/studyData_manager/StudyEvent.vue";
import StudyWorkerType from "./views/studyData_manager/StudyWorkerType.vue";
import StudyPaper from "./views/studyData_manager/StudyPaper.vue";
import StudyImage from "./views/studyData_manager/StudyImage.vue";
import AttencePlace from "./views/attence_manager/AttencePlace.vue";
import AttenceMode from "./views/attence_manager/AttenceMode.vue";
import AttenceLog from "./views/attence_manager/AttenceLog.vue";
import WorkTask from "./views/workthing_manager/WorkTask.vue";

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/DrawerPage',
        component: DrawerPage,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/pc_user_manager', component: UserPcManager, name: 'PC端用户管理' },
            { path: '/banner_manager', component: ImageChangeManager, name: '图片轮播管理' },
            { path: '/department_manager', component: DepartmentManager, name: '部门管理' },
            { path: '/work_type_manager', component: WorkTypeManager, name: '工种管理' },
            { path: '/role_manager', component: RoleManager, name: '角色管理'},
            { path: '/menu_manager', component: MenuManager, name: '菜单管理' },
            { path: '/feedback_manager', component: FeedbackManager, name: '意见反馈' },
            { path: '/notice_manager', component: NoticeManager, name: '公告' },
            { path: '/newsinfo_manager', component: NewsInfoManager, name: '新闻资讯' }
        ]
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '项目管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/project_manager', component: ProjectManager, name: '项目基本信息管理' },
            { path: '/project_building', component: ProjectBuilding, name: '项目楼栋管理' },
            { path: '/project_teams', component: ProjectTeams, name: '项目班组管理' },
            { path: '/project_tenders', component: ProjectTenders, name: '项目标段管理' },
            { path: '/project_check_type',component: ProjectCheckType, name: '项目检查项管理' },
            { path: '/project_nature',component: ProjectNature, name: '项目检查性质管理' },
            { path: '/project_paper',component: ProjectPaper, name: '项目图纸管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '实测实量',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/measure_building', component: MeasureBuilding, name: '测点管理' },
            { path: '/measure_paper', component: MeasurePaper, name: '图纸管理' },
            { path: '/measure_problem', component: MeasureProblem, name: '爆点管理' },
            { path: '/measure_count', component: MeasureCount, name: '统计管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '学习资料',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/study_data', component: StudyData, name: '题目管理' },
            { path: '/study_paper', component: StudyPaper, name: '试卷管理' },           
            { path: '/study_file', component: StudyFile, name: '资料管理' },
            { path: '/study_worker_type', component: StudyWorkerType, name: '工种类型管理' },
            { path: '/study_image', component: StudyImage, name: '图片轮播' },
            { path: '/study_event', component: StudyEvent, name: '学习事件' }
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '物资管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/material_count', component: MaterialCount, name: '物资统计' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '施工日志',
        iconCls: 'fa fa-address-card',
        // leaf: true,//只有一个节点
        children: [
            { path: '/construct_log', component: ConstructLog, name: '施工日志' },
            { path: '/construct_content', component: ConstructContent, name: '施工内容' },
            { path: '/construct_content_type', component: ConstructContentType, name: '内容类型' },
            { path: '/role_construct', component:RoleConstruct, name: '权限管理' },
            { path: '/existing_problem', component: ExistingProblem, name: '存在问题' },
            { path: '/machinery', component: Machinery, name: '机械管理' },
            { path: '/subject_material', component: SubjectMaterial, name: '主材量管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '质量管理',
        iconCls: 'fa fa-address-card',
        // leaf: true,//只有一个节点
        children: [
            { path: '/quality_check',component: QualityCheck, name: '质量检查单'},
            { path: '/quality_fine',component: QualityFine, name: '质量奖惩单'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '安全管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/security_check',component: SecurityCheck, name: '安全检查单'},
            { path: '/security_fine',component: SecurityFine, name: '安全奖惩单'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '施工任务单管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/construction_task',component: ConstructionTask, name: '施工任务单'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '工作管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/work_task',component: WorkTask, name: '日常任务'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '考勤管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/attence_place',component: AttencePlace, name: '考勤地点'},
            { path: '/attence_mode',component: AttenceMode, name: '考勤模板'},
            { path: '/attence_log',component: AttenceLog, name: '考勤记录'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;