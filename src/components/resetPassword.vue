<template>

    <div class="reset-password-container">
        <div>
            <img src="../assets/logo.png" class="favicon"/>
        </div>
        <div style="font-size: 1.25rem;">
            Reset password
        </div>
        <el-form :model="resetForm" :rules="rules" ref="resetForm">
           <el-form-item prop="usernameOrEmail">
               <el-input v-model.trim="resetForm.usernameOrEmail" class="username" placeholder="username or email"/>
           </el-form-item>
            <el-form-item prop="newPassword">
                <el-input type="password" v-model="resetForm.newPassword" class="password" placeholder="new password"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="login-btn" @click="resetPassword(resetForm)">Submit</el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-divider account="resetPassword"/>
        </div>
        <div class="description">
            Take a different action.
        </div>
        <div>
            <el-button size="small" class="register" @click="$router.push({path:`/register`})">
                Register now!
            </el-button>
            or
            <el-button size="small" class="login" @click="$router.push({path:`/login`})">
                Sign in!
            </el-button>
        </div>
    </div>
</template>

<script>
    import * as api from '@/common/request'
    import message from "@/common/message";
    export default {
        name: "resetPassword",
        mixins:[message],
        data(){
            return {
                resetForm:{
                    usernameOrEmail:'',
                    newPassword:''
                },

                rules: {
                    usernameOrEmail: [
                        {required: true, message: '请输入用户名或邮箱', trigger: 'blur'},
                    ],
                    newPassword: [
                        {required: true, message: '请输入需要设置的新密码', trigger: 'blur'},
                    ],
                }
            }
        },
        methods:{
            resetPassword(resetForm){
                this.$refs['resetForm'].validate((valid) => {
                    if (valid) {
                        api.register(resetForm).then(res=>{
                            if (res.data.success){
                                this.success('登录成功')
                                this.$router.push({path: `/login`})
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

    .reset-password-container {
        background-color: #2E364A;
        margin: 4rem auto;
        height: 450px;
        width: 350px;
        color: rgba(255, 255, 255, .75);
        font-family: Inter, sans-serif;
        font-size: 14px;
        border-radius: .5rem;
        text-align: center;
        padding: 3rem;
    }

    .favicon {
        height: 60px;
        width: 60px;
    }

    .reset-password-container> div {
        margin-bottom: 30px;
    }

    .login-btn {
        width: 100%;
        background-color: #26a69a;
        border: none;
        outline: none;
    }

    .login-btn:hover {
        background-color: #08887C;
    }

    .description {
        color: #6C8192;
    }

    .register,.login{
        background-color: #2E364A;
        border-color: #424a5e !important;
        outline: none;
        color: whitesmoke;
    }

</style>
