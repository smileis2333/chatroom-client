<template>
    <el-container style="height: 100%">
        <el-header class="header">
            <i class="el-icon-chat-line-round icon"></i>
            <span class="description">Chat Room</span>
            <el-dropdown class="right-top" trigger="click">

                <div>
                    <span class="username">Mirabelle Tow</span>
                    <el-avatar src="http://roba.laborasyon.com/demos/dark/dist/media/img/avatar3.png"></el-avatar>
                </div>

                <el-dropdown-menu slot="dropdown" class="dropItems">
                    <el-dropdown-item class="dropItem" @click.native="showProfile=true">Profile</el-dropdown-item>
                    <el-dropdown-item class="dropItem" style="color: #ff6bac;" @click="logout">Logout</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

        </el-header>
        <el-container>
            <el-aside width="200px" class="aside">
                <div class="tip">
                    Chats
                </div>
                <div style="padding-left: 20px;padding-right: 20px">
                    <el-input v-model="input" placeholder="Search" class="searchArea"
                              style="background-color: black!important;"></el-input>
                </div>
                <div class="user-list">
                    <div v-for="i in 6" :key="i">
                        <div class="user">
                            <el-avatar
                                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                            <div class="username-and-message">
                                <div class="username">Townsend Seary</div>
                                <div class="message">What's up, how are you?</div>
                            </div>
                            <div class="message-count-and-time">
                                <div class="new-message-count">
                                    <!--                                    需要限制消息数目大于多少格式为99+，防止样式丑陋-->
                                    12
                                </div>
                                <div class="time">
                                    Yesterday
                                </div>
                            </div>
                        </div>
                        <el-divider user-dived="" v-if="i!=10" style=""></el-divider>
                    </div>
                </div>
            </el-aside>
            <el-main class="main">
                <el-card class="profile-readonly" v-show="showProfile">
                    <div class="profile-readonly-op-header">
                        <span style="color: rgba(255,255,255,.75);font-size: 21px">Profile</span>
                        <div>
                            <el-button style="background-color: #2E364A;border: 1px solid grey" type="primary"
                                       icon="el-icon-edit" @click="showEditProfile=true"></el-button>
                            <el-button style="background-color: #DF1B5C;border: none" type="primary"
                                       icon="el-icon-close" @click="showProfile=false"></el-button>
                        </div>
                    </div>
                    <div class="profile-meta">
                        <div class="meta-avatar">
                            <img src="http://roba.laborasyon.com/demos/dark/dist/media/img/avatar3.png"/>
                        </div>
                        <div class="meta-username">
                            Mirabelle Tow
                        </div>
                        <div class="last-seen">
                            Last seen: Today
                        </div>
                        <div class="about-and-media">
                            <span :class="selectAboutOrMedia=='about'?'about select-about-or-media ':'about'"
                                  @click="selectAboutOrMedia='about'">About</span>
                            <span :class="selectAboutOrMedia=='media'?'media select-about-or-media':'media'"
                                  @click="selectAboutOrMedia='media'" style="margin-right: 0px">Media</span>
                        </div>
                        <div v-show="selectAboutOrMedia=='about'" class="about-content">
                            <div class="field">
                                <div>
                                    Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and
                                    printing in place of English to emphasise design elements over content. It's also
                                    called placeholder (or filler) text. It's a convenient tool for mock-ups.
                                </div>
                            </div>
                            <div class="field">
                                <div class="property-name">
                                    Phone
                                </div>
                                <div>
                                    (555) 555 55 55
                                </div>
                            </div>
                            <div class="field">
                                <div class="property-name">
                                    City
                                </div>
                                <div>
                                    Germany / Berlin
                                </div>
                            </div>
                        </div>
                        <div v-show="selectAboutOrMedia=='media'" class="media-content">
                            <div class="field">
                                <div class="property-name">
                                    Recent Files
                                </div>
                                <div class="file-list">
                                    <div class="file" v-for="i in 4" :key="i">
                                        <i class="el-icon-files" style="margin-right: 15px"/>
                                        <span class="filename">report4221.pdf</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
                <div class="message-area">
                    <!--                    <div v-for="i in 100" :key="i">-->
                    <!--                        12131-->
                    <!--                    </div>-->
                </div>
                <div class="message-input-area">
                    <div class="message-input-line">
                        <el-button><span class="iconfont"/>emoji</el-button>
                        <el-input v-model="input" placeholder="Write a message"/>
                        <el-upload
                                class="upload-demo"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-remove="beforeRemove"
                                multiple
                                :on-exceed="handleExceed">
                            <el-button icon="el-icon-paperclip"/>
                        </el-upload>
                        <el-button icon="el-icon-s-promotion" class="save-btn" @click="sendMessage(inputMessage)"/>
                    </div>
                </div>
                <el-dialog :visible.sync="showEditProfile" width="600px">
                    <div slot="title" class="edit-profile-title">
                        <i class="el-icon-edit" style="margin-right: 15px"/>Edit Profile
                        <el-divider edit-profile="true"></el-divider>
                    </div>

                    <div class="edit-profile-field">
                        <div class="edit-property-name">
                            FullName
                        </div>
                        <div>
                            <el-input placeholder="请输入内容" v-model="input2">
                                <template slot="append"><i class="el-icon-user"/></template>
                            </el-input>
                        </div>
                    </div>

                    <div class="edit-profile-field">
                        <div class="edit-property-name">
                            Avatar
                        </div>
                        <div style="display: flex;justify-content: flex-start">
                            <el-avatar
                                    src="http://roba.laborasyon.com/demos/dark/dist/media/img/avatar3.png"
                                    style="margin-right: 30px"></el-avatar>
                            <!--                            <el-upload-->
                            <!--                                    class="upload-demo"-->
                            <!--                                    action="https://jsonplaceholder.typicode.com/posts/"-->
                            <!--                                    :on-preview="handlePreview"-->
                            <!--                                    list-type="picture">-->

                            <my-upload field="file"
                                       @crop-success="cropSuccess"
                                       @crop-upload-success="cropUploadSuccess"
                                       @crop-upload-fail="cropUploadFail"
                                       v-model="showUploadSelector"
                                       :width="300"
                                       :height="300"
                                       :url="uploadAvatarURL"
                            ></my-upload>
                            <el-button @click="showUploadSelector=true" size="small" type="primary"
                                       style="background-color: #44c4b8">点击上传
                            </el-button>
                            <!--                            </el-upload>-->
                        </div>
                    </div>


                    <div class="edit-profile-field">
                        <div class="edit-property-name">
                            City
                        </div>
                        <div>
                            <el-input placeholder="请输入内容" v-model="input">
                                <template slot="append"><i class="el-icon-location-outline"/></template>
                            </el-input>
                        </div>
                    </div>

                    <div class="edit-profile-field">
                        <div class="edit-property-name">
                            Phone
                        </div>
                        <div>
                            <el-input placeholder="请输入内容" v-model="input">
                                <template slot="append"><i class="el-icon-mobile-phone"/></template>
                            </el-input>
                        </div>
                    </div>


                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveProfile" class="save-profile">Save</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>


    import myUpload from 'vue-image-crop-upload';

    export default {
        components: {
            myUpload
        },
        name: "layout",
        data() {
            return {
                input: '',
                selectAboutOrMedia: 'media',
                showProfile: false,
                showEditProfile: false,
                showUploadSelector: false,
                uploadAvatarURL: 'http://47.93.53.45:9090/upload',
                fileList: [{
                    name: 'food.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }, {
                    name: 'food2.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }],
                inputMessage:''
            }
        },
        methods: {
            saveProfile() {
                this.showEditProfile = false
            },
            sendMessage(message){

            },
            logout() {

            },

            cropSuccess(imgDataUrl, field) {
                this.imgDataUrl = imgDataUrl;
            },
            cropUploadSuccess(jsonData, field) {
                this.successImgURL = jsonData.url
                this.user.avatar = jsonData.url
            },
            cropUploadFail(status, field) {
                this.$message.error("上传失败，请查看网络连接")
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            }
        }
    }
</script>

<style scoped>

    .header {
        background-color: #44c4b8;
        height: 60px;
        display: flex;
        align-items: center;
    }

    .aside {
        position: absolute;
        top: 60px;
        bottom: 0;
        background-color: #2e364a;
        width: 385px !important;
        overflow: hidden;
    }

    .main {
        position: absolute;
        left: 385px;
        bottom: 0px;
        right: 0px;
        top: 60px;
        overflow-y: hidden;
    }


    ::-webkit-scrollbar {
        background-color: #1a2236;
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgba(66, 66, 66, 0.2);
    }

    .icon {
        font-size: 36px;
        color: whitesmoke;
    }

    .description {
        color: whitesmoke;
        margin-left: 10px;
    }

    .right-top {
        position: absolute;
        right: 0px;
        margin-right: 20px;

    }

    .right-top div {

        display: flex;
        align-items: center;
    }

    .right-top:hover {
        cursor: pointer;
    }

    .username {
        margin-right: 10px;
        color: rgba(255, 255, 255, .8);
        font-size: 14px;
    }

    .dropItem {
        color: rgba(255, 255, 255, .7);
    }

    .dropItems {
        background-color: #6c757d;
        border: 1px solid #6c757d;
    }

    .tip {
        font-size: 21px;
        color: rgba(255, 255, 255, .75);
        height: 40px;
        padding: 25px 25px;
    }

    .searchArea {
        border-color: #424a5e;
    }

    .user-list {
        position: absolute;
        top: 180px;
        left: 20px;
        right: 20px;
        bottom: 0px;
        overflow:scroll;
    }

    .user-list::-webkit-scrollbar {
        display: none;
    }

    .user {
        display: flex;
        justify-content: flex-start;
    }

    .username-and-message {
        margin-left: 20px;
    }

    .user-list .username {
        color: #26a69a;
        font-size: 16px;
    }

    .message {
        color: rgba(255, 255, 255, .4);
        font-size: 14px;
        margin-top: 3px;
    }

    .message-count-and-time {
        position: absolute;
        right: 20px;
    }

    .new-message-count {
        font-weight: 400;
        font-family: Inter, sans-serif;
        -webkit-box-direction: normal;
        cursor: pointer;
        box-sizing: border-box;
        width: 25px;
        height: 25px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        line-height: 0;
        font-size: 13px;
        height: 23px;
        background-color: #26a69a;
        color: #fff;
        border-radius: 50%;
        margin-left: auto;
    }

    .time {
        color: #26a69a;
        font-size: 75%;
        font-weight: 400;
        margin-top: 2px;
    }

    .message-area {
        height: 80%;
        overflow-y: scroll;
    }

    .message-input-area {
        height: 20%;
        padding-top: 35px;
    }

    .message-input-line {
        display: flex;
        justify-content: flex-start;
        background-color: #2e364a;
        border-radius: 10px;
        padding: 15px 20px 15px 0px;
    }

    .message-input-line * {
        margin-left: 20px;
    }

    .profile-readonly {
        position: absolute;
        width: 350px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        background-color: #2E364A;
        border: none;
        z-index: 100;
        padding-right: 0px;
    }

    .profile-readonly-op-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
    }

    .profile-meta::-webkit-scrollbar {
        display: none;
    }

    .profile-meta {
        position: absolute;
        top: 70px;
        bottom: 0px;
        right: 0px;
        left: 0px;
        overflow-y: scroll;
    }

    .meta-username {
        color: #CBCDD2;
        text-align: center;
        font-size: 1.25rem;
        margin-bottom: .25rem !important;
    }

    .meta-avatar {
        display: flex;
        justify-content: center;
        margin-top: 35px;
        margin-bottom: 20px;
    }

    .meta-avatar img {
        border-radius: 50%;
        width: 97px;
        height: 97px;
    }

    .last-seen {
        color: #777987;
        text-align: center;
        font-size: 80%;
        font-weight: 400;
        font-style: italic;
    }

    .about-and-media {
        color: white;
        display: flex;
        justify-content: center;
        margin-top: 35px;
    }

    .about, .media {
        color: rgba(255, 255, 255, .75);
        padding: 10px;
        font-size: 14px;
    }

    .about:hover, .media:hover {
        border-bottom: 2px solid #424A5E;
        cursor: pointer;
    }

    .select-about-or-media {
        border-bottom: 2px solid #26A69A !important;
    }

    .property-name, .edit-property-name {
        color: #CBCDD2;
        font-size: 17px;
        margin-bottom: 5px;
    }

    .field {
        color: #6C8192;
        font-size: 14px;
        margin-bottom: 30px;
    }

    .about-content, .media-content {
        padding-left: 25px;
        padding-right: 25px;
        margin-top: 25px;
    }

    .file-list {
        margin-top: 25px;

    }

    .file {
        padding: 15px 15px 15px 0px;
        border-bottom: 1px solid #424A5E;
    }

    .filename {
        color: #2B9A9A;
    }

    .filename:hover {
        cursor: pointer;
        color: #146552;
    }

    .edit-profile {
        background-color: #465474;
    }

    .edit-profile-title {
        color: rgba(255, 255, 255, .75);
        font-size: 1.25rem;
    }

    .save-profile {
        background-color: #26A69A;
    }

    .save-profile:hover {
        background-color: #08887C
    }

    .edit-property-name {
        font-size: 14px;
        margin-bottom: 10px;
    }

    .edit-profile-field {
        margin-bottom: 20px;
    }

    .save-btn {
        color: white;
        border: none;
        background-color: #26A69A;
    }

    .save-btn:hover {
        background-color: #08887C;
    }
</style>

