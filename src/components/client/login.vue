<template>
    <div class="login-container">

        <div>
            <img src="../../assets/logo.png" class="favicon"/>
        </div>
        <div style="font-size: 1.25rem;">
            Sign in
        </div>

        <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item prop="username">
                <el-input type="text" v-model.trim="loginForm.username" placeholder="username or email"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model.trim="loginForm.password" class="password" placeholder="password"/>
            </el-form-item>
            <el-form-item>
                <div style="display: flex;justify-content: flex-end">
                    <span class="reset-password" @click="$router.push({path:`/reset_password`})">Reset password</span>
                </div>
            </el-form-item>
            <el-form-item>
                <div>
                    <el-button type="primary" class="login-btn" @click="login(loginForm)">Sign in</el-button>
                </div>
            </el-form-item>

        </el-form>
        <div>
            <el-divider account="login"/>
        </div>
        <div class="description">
            Login with your social media account.
        </div>
        <div class="description">
            Don't have an account?
        </div>
        <div>
            <el-button size="small" class="register" @click="$router.push({path:`/register`})">
                Register now
            </el-button>

        </div>
    </div>
</template>

<script>
    import * as api from '@/common/request'
    import message from "@/common/message";
    export default {
        name: "login",
        mixins:[message],
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
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
        methods: {
            login(loginForm) {
                this.$refs['loginForm'].validate((valid) => {
                    if (valid) {
                        api.login(loginForm).then(res=>{
                            if (res.data.userId!=null){
                                this.$store.commit('setUser',res.data)
                                this.$router.push({path:`/chat`})
                            }else {
                                this.error(res.data.message)
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            thirdLogin() {

            }
        }
    }
</script>

<style scoped>
    .login-container {
        background-color: #2E364A;
        margin: 0.3rem auto;
        height: 600px;
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

    .login-container > div {
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

    .third-icon {
        height: 35px;
        width: 35px;
    }

    .third-icon:hover {
        cursor: pointer;
    }

    .reset-password {
        color: #26a69a;
    }

    .reset-password:hover {
        cursor: pointer;
        color: #08887C;
    }
</style>
