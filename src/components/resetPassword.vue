<template>

    <div class="reset-password-container">
        <div>
            <img src="../assets/logo.png" class="favicon"/>
        </div>
        <div style="font-size: 1.25rem;">
            Reset password
        </div>
        <div>
            <el-input v-model="resetForm.usernameOrEmail" class="username" placeholder="username or email"/>
        </div>
        <div>
            <el-input type="password" v-model="resetForm.newPassword" class="password" placeholder="password"/>
        </div>

        <div>
            <el-button type="primary" class="login-btn" @click="resetPassword">Submit</el-button>
        </div>
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
    export default {
        name: "resetPassword",
        data(){
            return {
                resetForm:{
                    usernameOrEmail:'',
                    newPassword:''
                }
            }
        },
        methods:{
            resetPassword(resetForm){

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
