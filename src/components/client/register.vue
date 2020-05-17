<template>

    <div class="register-container">
        <div>
            <img src="../../assets/logo.png" class="favicon"/>
        </div>
        <div style="font-size: 1.25rem;">
            Create account
        </div>
        <el-form :model="registerForm" :rules="rules" ref="registerForm">
            <el-form-item prop="username">
                <el-input v-model.trim="registerForm.username" class="username" placeholder="username"/>
            </el-form-item>
            <el-form-item prop="email">
                <el-input type="email" v-model.trim="registerForm.email" class="email" placeholder="email"/>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model.trim="registerForm.password" class="password" placeholder="password"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="login-btn" @click="register(registerForm)">Register</el-button>
            </el-form-item>
        </el-form>

        <div>
            <el-divider account="login"/>
        </div>
        <div class="description">
            Already have an account?
        </div>
        <div>
            <el-button size="small" class="register" @click="$router.push({path:`/login`})">Sign in</el-button>

        </div>
    </div>
</template>

<script>
    import * as api from '@/common/request'
    import message from "@/common/message";
    export default {
        name: "register",
        mixins:[message],
        data() {
            return {
                registerForm: {
                    username: '',
                    password: '',
                    email: ''
                },

                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    email:[
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            register(registerForm) {

                this.$refs['registerForm'].validate((valid) => {
                    if (valid) {
                        api.register(registerForm).then(res=>{
                            if (res.data.success){
                                this.success(`注册成功, 请到邮箱进行激活`)
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

    .register-container {
        background-color: #2E364A;
        margin: 1rem auto;
        height: 570px;
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

    .register-container > div {
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

    .register {
        background-color: #2E364A;
        border-color: #424a5e !important;
        outline: none;
        color: whitesmoke;
    }

</style>
