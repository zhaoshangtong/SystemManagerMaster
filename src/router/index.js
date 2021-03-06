import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {
                title: '自述文件'
            },
            children: [{
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {
                        title: '数据中心'
                    }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: {
                        title: '自定义图标'
                    }
                }, {
                    path: '/user',
                    component: resolve => require(['../components/mypage/UserManager.vue'], resolve),
                    meta: {
                        title: '用户管理'
                    }
                }, {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: {
                        title: '基础表格'
                    }
                }, {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: {
                        title: 'tab选项卡'
                    }
                }, {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: {
                        title: '基本表单'
                    }
                }, {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: {
                        title: '富文本编辑器'
                    }
                }, {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: {
                        title: 'markdown编辑器'
                    }
                }, {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: {
                        title: '文件上传'
                    }
                }, {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: {
                        title: 'schart图表'
                    }
                }, {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: {
                        title: '权限测试',
                        permission: true
                    }
                }, {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: {
                        title: '404'
                    }
                }, {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: {
                        title: '403'
                    }
                },
                {
                    path: '/datalistview',
                    name: 'datalist',
                    component: resolve => require(['../components/mypage/DataList.vue'], resolve),
                    meta: {
                        title: '查看数据'
                    },
                },

                {
                    path: '/warningset', //:id/:itemId/:tags
                    name: 'warningset',
                    component: resolve => require(['../components/mypage/WarningSet.vue'], resolve),
                    meta: {
                        title: '报警设置'
                    }
                },
                {
                    path: '/warningreal', //:id/:itemId/:tags
                    name: 'warningreal',
                    component: resolve => require(['../components/mypage/WarningRealTime.vue'], resolve),
                    meta: {
                        title: '实时报警'
                    }
                },
                {
                    path: '/warninghistory', //:id/:itemId/:tags
                    name: 'warninghistory',
                    component: resolve => require(['../components/mypage/WarningHistory.vue'], resolve),
                    meta: {
                        title: '历史报警'
                    }
                },
                {
                    path: '/realtime', //:id/:itemId/:tags
                    name: 'realtime',
                    component: resolve => require(['../components/mypage/RealTimeData.vue'], resolve),
                    meta: {
                        title: '实时数据'
                    }
                }, {
                    path: '/historydata', //:id/:itemId/:tags
                    name: 'historydata',
                    component: resolve => require(['../components/mypage/HistoryData.vue'], resolve),
                    meta: {
                        title: '历史数据'
                    }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/weixin',
            component: resolve => require(['../components/mintui/mtHome.vue'], resolve),
            // redirect: 'weixin/mtDashbord?type=0',
            children:[{
                path: 'mtDashbord',
                component: resolve => require(['../components/mintui/mtDashbord.vue'], resolve)
            },{
                path: 'mtDataList',
                component: resolve => require(['../components/mintui/mtDataList.vue'], resolve)
            },{
                path: 'mtRealTime',
                component: resolve => require(['../components/mintui/mtRealTime.vue'], resolve)
            },{
                path: 'mtHistory',
                component: resolve => require(['../components/mintui/mtHistory.vue'], resolve)
            },{
                path: 'mtRealWarning',
                component: resolve => require(['../components/mintui/mtRealTimeWarning.vue'], resolve)
            },{
                path: 'mtHistoryWarning',
                component: resolve => require(['../components/mintui/mtHistoryWarning.vue'], resolve)
            }]
        },
        // {
        //     path: '*',
        //     redirect: '/404'
        // }
    ]
})
