import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
let router = new Router({
    routes: [
        {
            path:'/',
            component:()=>import('@/components/pages/Layout'),
            children:[
                {
                    path:'home',
                    component:()=>import('../components/pages/Index'),
                    //设置一个自定义属性，用来告知页面加载时，左侧哪个菜单选中
                    meta:{select:'/home'}
                },
                {
                    path:'menu',
                    component:()=>import('../components/pages/Menu/Index'),
                    meta:{select:'/menu'}
                },
                {
                    path:'menu/add',
                    component:()=>import('../components/pages/Menu/Info'),
                    meta:{select:'/menu'}
                },
                {
                    path:'menu/:menuid',
                    component:()=>import('../components/pages/Menu/Info'),
                    meta:{select:'/menu'}
                },
                {
                    path:'role',
                    component:()=>import('../components/pages/Role/Index'),
                    meta:{select:'/role'}
                },
                {
                    path:'role/add',
                    component:()=>import('../components/pages/Role/Info'),
                    meta:{select:'/role'}
                },
                {
                    path:'role/:roleid',
                    component:()=>import('../components/pages/Role/Info'),
                    meta:{select:'/role'}
                },
                {
                    path:'user',
                    component:()=>import('../components/pages/User/Index'),
                    meta:{select:'/user'}
                },
                {
                    path:'user/add',
                    component:()=>import('../components/pages/User/Info'),
                    meta:{select:'/user'}
                },
                {
                    path:'user/:userid',
                    component:()=>import('../components/pages/User/Info'),
                    meta:{select:'/user'}
                },
                {
                    path:'category',
                    component:()=>import('../components/pages/Category/Index'),
                    meta:{select:'/category'}
                },
                {
                    path:'category/add',
                    component:()=>import('../components/pages/Category/Info'),
                    meta:{select:'/category'}
                },
                {
                    path:'category/:id',
                    component:()=>import('../components/pages/Category/Info'),
                    meta:{select:'/category'}
                },
                {
                    path:'specs',
                    component:()=>import('../components/pages/Specs/Index'),
                    meta:{select:'/specs'}
                },
                {
                    path:'specs/add',
                    component:()=>import('../components/pages/Specs/Info'),
                    meta:{select:'/specs'}
                },
                {
                    path:'specs/:id',
                    component:()=>import('../components/pages/Specs/Info'),
                    meta:{select:'/specs'}
                },
                {
                    path:'goods',
                    component:()=>import('../components/pages/Goods/Index'),
                    meta:{select:'/goods'}
                },
                {
                    path:'goods/add',
                    component:()=>import('../components/pages/Goods/Info'),
                    meta:{select:'/goods'}
                },
                {
                    path:'goods/:id',
                    component:()=>import('../components/pages/Goods/Info'),
                    meta:{select:'/goods'}
                },
                {
                    path:'member',
                    component:()=>import('../components/pages/Member/Index'),
                    meta:{select:'/member'}
                },
                {
                    path:'member/add',
                    component:()=>import('../components/pages/Member/Info'),
                    meta:{select:'/member'}
                },
                {
                    path:'member/:id',
                    component:()=>import('../components/pages/Member/Info'),
                    meta:{select:'/member'}
                },
                {
                    path:'banner',
                    component:()=>import('../components/pages/Banner/Index'),
                    meta:{select:'/banner'}
                },
                {
                    path:'banner/add',
                    component:()=>import('../components/pages/Banner/Info'),
                    meta:{select:'/banner'}
                },
                {
                    path:'banner/:id',
                    component:()=>import('../components/pages/Banner/Info'),
                    meta:{select:'/banner'}
                },
                {
                    path:'seckill',
                    component:()=>import('../components/pages/Seckill/Index'),
                    meta:{select:'/seckill'}
                },
                {
                    path:'seckill/add',
                    component:()=>import('../components/pages/Seckill/Info'),
                    meta:{select:'/seckill'}
                },
                {
                    path:'seckill/:id',
                    component:()=>import('../components/pages/Seckill/Info'),
                    meta:{select:'/seckill'}
                }
            ]
        },
        {
            path:'/login',
            component:()=>import('../components/pages/Login')
        }
    ]
})


//路由导航守卫
router.beforeEach((to,from,next)=>{
    let userinfo = store.getters.userInfo;
    if(userinfo){
        //如果用户已登录，则执行默认路由规则
        // next();
        //根据用户角色已分配的菜单权限，来对用户当前访问的路由进行验证
        //menu ['/menu','/user']
        userinfo.menus_url.push('/');
        userinfo.menus_url.push('/home');
        let menuarr = userinfo.menus_url;//允许访问的路由数组
        //由于添加和动态路由没有纳入菜单管理中，所以我们要对访问的添加路由和动态路由允许访问
        let nowpatharr = to.path.split('/');
        let nowpath = '/' + nowpatharr[1];
        //遍历数组，找到匹配的元素
        let res = menuarr.find(d=>{
            return d == nowpath;
        });
        if(res){
            next();
        }else{
            next('/')
        }
    }else{
        //如果用户没有登录，跳转到登录页面
        if(to.path == '/login'){
            next();
        }else{
            next('/login')
        }
    }
})

export default router;