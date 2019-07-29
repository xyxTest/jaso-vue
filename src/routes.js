import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserPcManager from './views/system_manager/UserPcManager.vue'
import UserAppManager from './views/system_manager/UserAppManager.vue'
import RoleManager from './views/system_manager/RoleManager.vue'
import MenuManager from './views/system_manager/MenuManager.vue'
import DepartmentManager from './views/system_manager/DepartmentManager.vue'
import ImageChangeManager from './views/system_manager/ImageChangeManager.vue'
import ProjectManager from './views/project_manager/ProjectManager.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
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
            { path: '/app_user_manager', component: UserAppManager, name: 'APP端用户管理' },
            { path: '/banner_manager', component: ImageChangeManager, name: '图片轮播管理' },
            { path: '/department_manager', component: DepartmentManager, name: '部门管理' },
            { path: '/role_manager', component: RoleManager, name: '角色管理' },
            { path: '/menu_manager', component: MenuManager, name: '菜单管理' }

        ]
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '项目管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/project_manager', component: ProjectManager, name: '项目基本信息管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '实测实量',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '其他管理',
        iconCls: 'fa fa-address-card',
       // leaf: true,//只有一个节点
        children: [
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