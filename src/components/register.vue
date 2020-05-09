<template>

    <div class="register-container">
        <div>
            <img src="../assets/logo.png" class="favicon"/>
        </div>
        <div style="font-size: 1.25rem;">
            Create account
        </div>
        <div>
            <el-input v-model="registerForm.username" class="username" placeholder="username"/>
        </div>
        <div>
            <el-input type="email" v-model="registerForm.email" class="email" placeholder="email"/>
        </div>
        <div>
            <el-input type="password" v-model="registerForm.password" class="password" placeholder="password" />
        </div>

        <div>
            <el-button type="primary" class="login-btn" @click="register">Register</el-button>
        </div>
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
    export default {
        name: "register",

        data(){
            return{
                registerForm:{
                    username:'',
                    password:'',
                    email:''
                }
            }
        },
        methods:{
            register(form){
                this.$router.push({path:`/login`})
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

    .login-btn{
        width: 100%;
        background-color: #26a69a;
        border: none;
        outline: none;
    }

    .login-btn:hover{
        background-color: #08887C;
    }

    .description{
        color: #6C8192;
    }

    .register{
        background-color: #2E364A;
        border-color: #424a5e!important;
        outline: none;
        color: whitesmoke;
    }

</style>
