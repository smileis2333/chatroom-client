<template>
    <div>
        <el-row class="main">
            <el-col :span="4">
                <el-menu :router=true default-active="/admin/manage/users" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                         text-color="#BFCBBD" background-color="#304156">
                    <el-menu-item index="/admin/manage/users">
                        <i class="el-icon-user"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>

                    <el-menu-item index="/admin/manage/messages">
                        <i class="el-icon-chat-dot-round"></i>
                        <span slot="title">消息管理</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <div class="header">


                    <el-dropdown class="right-top" trigger="click">

                        <div>
                            <el-avatar src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"></el-avatar>
                        </div>

                        <el-dropdown-menu slot="dropdown" class="dropItems">
                            <el-dropdown-item class="dropItem" @click.native="logout">Logout</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>


                </div>

                <div class="content">
                    <router-view/>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>

    import * as api from '@/common/request'
    export default {
        name: "manage",
        data() {
            return {};
        },
        methods: {
            handleOpen(key, keyPath) {
            },
            handleClose(key, keyPath) {
            },
            logout() {
                api.logout().then(res => {
                    this.$router.push({path: `/admin`})
                })
            },
        }
    }
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
        border-right: none;
    }

    .main {
        position: absolute;
        background-color: #304156;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px
    }

    .content{
        background-color: #fff;
        position: absolute;
        top: 60px;
        bottom: 0px;
        right: 0px;
        left: 200px;
    }

    .header{
        position: absolute;
        left: 200px;
        background-color: #fff;
        right: 0px;
        height: 50px;
        display: flex;
        justify-content: flex-end;
        padding-right: 15px;
        padding-top: 10px;
    }
    .right-top:hover{
        cursor: pointer;
    }
</style>
