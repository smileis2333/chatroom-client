<template>
    <div id="app">
        <chatRoom/>
        <!--    <img alt="Vue logo" src="./assets/logo.png">-->
        <!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    </div>
</template>

<script>
    import chatRoom from "@/components/chatroom";

    export default {
        name: 'App',
        components: {
            chatRoom,
        }
    }
</script>

<style>

    body {
        height: 100%;
        width: 100%;
        margin: 0px;
        padding: 0px;
        background-color: #1a2236;
    }

    .el-divider[user-dived]{
        background-color: #505c79!important;
    }


    .el-divider[edit-profile]{
        background-color: #424A5E;
    }

    .el-tabs__nav-wrap::after{
        background-color: #2E364A;
    }

    .el-dialog__header,.el-dialog__body,.el-dialog__footer{
        background-color: #2E364A;
    }

    .el-dialog__body{
        padding-top: 0px!important;
    }


</style>
