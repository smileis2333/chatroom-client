import VueRouter from 'vue-router'
import login from "@/components/client/login";
import chatroom from "@/components/client/chatroom";
import register from "@/components/client/register";
import resetPassword from "@/components/client/resetPassword";
import store from "@/vuex";
import admin_login from "@/components/admin/admin_login";
import manage from "@/components/admin/manage";
import el from "element-ui/src/locale/lang/el";
import users from "@/components/admin/users";
import messages from "@/components/admin/messages";


const router = new VueRouter({
    routes: [
        {
            path: '/', redirect: '/login'
        },
        {
            path: '/login', component: login
        },
        {
            path: '/register', component: register
        },
        {
            path: '/reset_password', component: resetPassword
        },
        {
            path: '/chat', component: chatroom,
        },
        {
            path: '/admin/login', component: admin_login
        },
        {
            path: '/admin/manage', component: manage,
            children:[
                {
                    path: 'users', component: users
                },
                {
                    path: 'messages', component: messages
                }
            ]
        },
        {
            path: '/admin', redirect: '/admin/login'
        }
    ]
});


router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/admin')) {
        if (to.path == '/admin/login') {
            next()
        }
        if (store.state.user.role!='ADMIN'){
            next()
            next('/admin/login')
        }
        next()
    } else {
        if (store.state.isLogin || to.path == '/' || to.path == '/login' || to.path == '/register' || to.path == '/reset_password') {
            next()
        } else {
            next()
            next('/login')
        }
    }
})

export default router
