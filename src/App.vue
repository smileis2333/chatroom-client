<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import chatRoom from "@/components/client/chatroom";

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

    .el-divider[user-dived=unselect]{
        background-color: #424A5E;
    }

    .el-divider[user-dived=select]{
        background-color: #26A69A;
    }

    .el-divider[edit-profile]{
        background-color: #424A5E;
    }

    .el-divider[account]{
       background-color: #293042;
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

    .emoji {
        height: 36px;
        width: 36px;
    }


</style>
