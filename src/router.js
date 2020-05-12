import VueRouter from 'vue-router'
import login from "@/components/login";
import chatroom from "@/components/chatroom";
import register from "@/components/register";
import resetPassword from "@/components/resetPassword";
import store from "@/vuex";


const router = new VueRouter({
    routes: [
        {
          path:'/',redirect:'/login'
        },
        {
            path:'/login', component: login
        },
        {
            path:'/register', component: register
        },
        {
            path:'/reset_password', component: resetPassword
        },
        {
            path:'/chat', component: chatroom,
        },
    ]
});


router.beforeEach((to, from, next) => {
    if (store.state.isLogin||to.path=='/'||to.path=='/login'||to.path=='/register'||to.path=='/resetPassword'){
        next()
    }else {
        next()
        next('/login')
    }

    // next()
})

export default router
