<template>
    <div class="login-container">
        <div>
            <img src="../assets/logo.png" class="favicon"/>
        </div>
        <div style="font-size: 1.25rem;">
            Sign in
        </div>
        <div>
            <el-input v-model="loginForm.username" class="username" placeholder="username"/>
        </div>
        <div>
            <el-input type="password" v-model="loginForm.password" class="password" placeholder="password"/>
        </div>

        <div style="display: flex;justify-content: flex-end">
            <span class="reset-password" @click="$router.push({path:`/reset_password`})">Reset password</span>
        </div>
        <div>
            <el-button type="primary" class="login-btn" @click="login(loginForm)">Sign in</el-button>
        </div>
        <div>
            <el-divider account="login"/>
        </div>
        <div class="description">
            Login with your social media account.
        </div>
        <div>
            <img src="../assets/wechat.png" class="third-icon" @click="thirdLogin"/>
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
    export default {
        name: "login",
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                }
            }
        },
        methods: {
            login(loginForm) {
                this.$router.push({path:`/chat`})
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
