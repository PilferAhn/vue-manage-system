import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: 'DashBoard',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/DashboardPage/Dashboard.vue'),
            },
            // {
            //     path: '/product/create-application',
            //     name: 'ApplicationForm',
            //     meta: {
            //         title: '의뢰서 작성',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/ApplicationForm.vue'),
            // },
            {
                path: '/product/create-application',
                name: 'PDTApplication',
                meta: {
                    title: '의뢰서 작성',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/PDTApplication.vue'),
            },
            {
                path: '/product/meas-info/:uuid',
                name: 'MeasurementInfo',
                meta: {
                    title: '의뢰서 작성',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/MeasurementPage/MeasurementInfo.vue'),
            },
            {
                path: '/admin/application-list',
                name: 'ApplicationList',
                meta: {
                    title: '의뢰서',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/AdminPage/ApplicationList.vue'),
            },
            {
                path: '/admin/application-detail/:uuid',
                name: 'ApplicationDetail',
                meta: {
                    title: '의뢰서 자세히',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/AdminPage/ApplicationDetail.vue'),
            },
            {
                path: '/product/reserved-application-list',
                name: 'ReservedMeasurement',
                meta: {
                    title: '의뢰서 자세히',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/MeasurementPage/ReservedMeasurement.vue'),
            },
            {
                path: '/product/completed-application-list',
                name: 'CompletedMeasurementList',
                meta: {
                    title: '측정 완료 항목',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/MeasurementPage/CompletedMeasurementList.vue'),
            },
            {
                path: '/product/application-detil/:uuid',
                name: 'MeasurementDetail',
                meta: {
                    title: '의뢰서 자세히',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/MeasurementPage/MeasurementDetail.vue'),
            },
            {
                path: '/product/my-application-list',
                name: 'MyProductApplicationList',
                meta: {
                    title: '의뢰서 자세히',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/ApplicationPage/MyProductApplicationList.vue'),
            },
            {
                path: '/product/my-application-detail:uuid',
                name: 'MyProductApplicationDetail',
                meta: {
                    title: '내 의뢰서 보기',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/ApplicationPage/MyProductApplicationDetail.vue'),
            },
            
            {
                path: '/teg/waiting-list',
                name: 'TegMeasurementQue',
                meta: {
                    title: '의뢰서 자세히',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/TegPage/MeasurementQueue/TegMeasurementQue.vue'),
            },
            {
                path: '/product/application/:uuid',
                name: 'LoadProductApp',
                meta: {
                    title: '의뢰서 자세히',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage/LoadProductApp.vue'),
            },
            {
                path: '/admin/pdt/application',
                name: 'PDTApplication2',
                meta: {
                    title: '의뢰서 자세히',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/ProductPage//PDTApplication.vue'),
            },
            {
                path: '/admin/teg/create-teg-application',
                name: 'TegApplication',
                meta: {
                    title: 'TEG 의뢰서 작성',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/TegPage/Application/TegApplication.vue'),
            },
            {
                path: '/admin/teg/teg-application-list',
                name: 'TegApplicationList',
                meta: {
                    title: 'TEG 의뢰서 목록',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/AdminPage/TEG/TegApplicationListPage.vue'),
            },
            {
                path: '/teg/teg-queue',
                name: 'TegMeasurementQueue',
                meta: {
                    title: '의뢰서 자세히',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/TegPage/MeasurementQueue/TegMeasurementQue.vue'),
            },
            // {
            //     path: '/teg/teg-application-detail/:uuid',
            //     name: 'TegApplicationDetail',
            //     meta: {
            //         title: '의뢰서 자세히',
            //         permiss: '5',
            //     },
            //     component: () => import(/* webpackChunkName: "table" */ '../views/TegPage/MeasurementQueue/LoadTegApplication.vue'),
            // },                            
            {
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '表格',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            },
            
            {
                path: '/statistic/chart',
                name: 'basecharts',
                meta: {
                    title: '통계',
                    permiss: '11',
                },
                component: () => import(/* webpackChunkName: "charts" */ '../views/AdminPage/Statistic/charts.vue'),
            },
            {
                path: '/form',
                name: 'baseform',
                meta: {
                    title: '表单',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            },
            {
                path: '/tabs',
                name: 'tabs',
                meta: {
                    title: 'tab标签',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            },
            {
                path: '/donate',
                name: 'donate',
                meta: {
                    title: '鼓励作者',
                    permiss: '14',
                },
                component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '13',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传插件',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/icon',
                name: 'icon',
                meta: {
                    title: '自定义图标',
                    permiss: '10',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            },
            {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '9',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            },
            {
                path: '/export',
                name: 'export',
                meta: {
                    title: '导出Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "export" */ '../views/export.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '导入Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/create-account',
        name: 'Register',
        meta: {
            title: '계정생성',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/Register.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (to.path === '/create-account'){
        next()
    }
    else if (!role && to.path !== '/login') {        
        next('/login');    
    }
    else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done()
})

export default router;
