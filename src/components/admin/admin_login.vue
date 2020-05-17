<template>
    <div class="admin-login">
        <el-form :model="adminLoginForm" :rules="rules" ref="adminLoginForm">
            <div class="description">Admin Login</div>
            <el-form-item prop="username">
               <el-input prefix-icon="el-icon-user-solid" type="text" v-model.trim="adminLoginForm.username" placeholder="username or email"/>
            </el-form-item>
            <el-form-item prop="password">
               <el-input type="password" v-model.trim="adminLoginForm.password" prefix-icon="el-icon-lock" placeholder="password"/>
            </el-form-item>
            <el-form-item>
                <el-button class="login-btn" type="primary" @click="login">Login</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import * as api from '@/common/request'
    import message from "@/common/message";
    export default {
        name: "login",
        mixins:[message],
        data(){
            return {
                adminLoginForm:{
                    username:'',
                    password:''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名/邮箱', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                }
            }
        },
        methods:{
            login(){
                this.$refs['adminLoginForm'].validate((valid) => {
                    if (valid) {
                        api.login(this.adminLoginForm).then(res=>{
                            if (res.data.userId!=null){
                                if (res.data.role!='ADMIN'){
                                    this.error('账号或密码错误')
                                }else{
                                    this.$store.commit('setUser',res.data)
                                    this.$router.push({path:`/admin/manage/users`})
                                }
                            }else {
                                this.error(res.data.message)
                            }
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
.admin-login{
    margin: 200px auto;
    width: 460px;
    text-align: center;
}

    .login-btn{
        width: 100%;
    }

    .description{
        color: #EEEEEE;
        margin-bottom: 30px;
    }
</style>
