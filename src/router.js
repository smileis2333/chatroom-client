import VueRouter from 'vue-router'
import login from "@/components/login";
import chatroom from "@/components/chatroom";
import register from "@/components/register";
import resetPassword from "@/components/resetPassword";


const router = new VueRouter({
    routes: [
        {
          path:'/',redirect:'login'
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

export default router
