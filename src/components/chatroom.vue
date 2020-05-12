<template>
    <el-container style="height: 100%">
        <el-header class="header">
            <i class="el-icon-chat-line-round icon"></i>
            <span class="description">Chat Room</span>
            <el-dropdown class="right-top" trigger="click">

                <div>
                    <span class="username">{{updateUserForm.username}}</span>
                    <el-avatar :src="updateUserForm.avatar"></el-avatar>
                </div>

                <el-dropdown-menu slot="dropdown" class="dropItems">
                    <el-dropdown-item class="dropItem" @click.native="showProfile=true">Profile</el-dropdown-item>
                    <el-dropdown-item class="dropItem" style="color: #ff6bac;" @click.native="logout">Logout
                    </el-dropdown-item>
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
                        <div class="user" @click="switchChat(i)">
                            <el-avatar
                                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                            <div class="username-and-message">
                                <div class="username">Townsend Seary</div>
                                <div class="message-thumb">What's up, how are you?</div>
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
                        <el-divider :user-dived="selectChat==i?'select':'unselect'" v-if="i!=10"></el-divider>
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
                            <img :src="updateUserForm.avatar"/>
                        </div>
                        <div class="meta-username">
                            {{updateUserForm.username}}
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
                                    {{updateUserForm.description}}
                                </div>
                            </div>
                            <div class="field">
                                <div class="property-name">
                                    Phone
                                </div>
                                <div>
                                    {{updateUserForm.phone||'未填'}}
                                </div>
                            </div>
                            <div class="field">
                                <div class="property-name">
                                    City
                                </div>
                                <div>
                                    {{updateUserForm.city||'未填'}}
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
                <div class="message-area" id="message-list" @scroll="changeScrollDirection">
                    <div v-if="!hasMoreMessage" class="has-more-message">
                        已经没有更多消息了
                    </div>
                    <div v-if="hasMoreMessage" class="has-more-message has-more-message-hover" @click="applyMoreMessage(page,pageSize)">
                        <i class="el-icon-pie-chart" style="margin-right: 15px"/>查看更多消息
                    </div>
                    <div v-for="message in messages" :key="message.messageId" class="message-meta">
                        <div v-if="!isMyMessage(message)" class="other-message">
                            <el-avatar :src="message.avatar" class="avatar"></el-avatar>
                            <div class="message">
                                <div class="content">
                                    <span v-if="message.contextType=='TEXT'">
                                    {{message.content}}
                                    </span>
                                    <img v-if="message.contextType=='RESOURCE'" :src="message.content" class="message-image" alt="">
                                </div>
                                <div class="post-time">
                                    {{message.createTime|formatDate('hh:mm a')}}
                                </div>
                            </div>
                        </div>
                        <div v-if="isMyMessage(message)" class="mine-message">
                            <div class="message">
                                <div class="content">
                                    <span v-if="message.contextType=='TEXT'">
                                    {{message.content}}
                                    </span>
                                    <img v-if="message.contextType=='RESOURCE'" :src="message.content" class="message-image" alt="图片">
                                </div>
                                <div class="post-time">
                                    {{message.createTime|formatDate('hh:mm a')}}
                                </div>
                            </div>
                            <el-avatar :src="message.avatar" class="avatar"></el-avatar>
                        </div>
                    </div>
                </div>
                <div class="message-input-area">
                    <div class="message-input-line">

                        <TwemojiPicker
                                :pickerWidth="600"
                                :pickerHeight="200"
                                :pickerCloseOnClickaway="true"
                                :emojiData="emojiDataAll"
                                :emojiGroups="emojiGroups"
                                :skinsSelection="false"
                                :searchEmojisFeat="true"
                                searchEmojiPlaceholder="Search here."
                                searchEmojiNotFound="Emojis not found."
                                @emojiUnicodeAdded="emojiUnicodeAdded"
                                @emojiImgAdded="emojiImgAdded"
                                isLoadingLabel="Loading..."
                        />

                        <el-input v-model="inputMessage" placeholder="Write a message"/>

                        <el-upload
                                class="upload-demo"
                                action="http://127.0.0.1:9090/file/upload"
                                name="file"
                                :with-credentials="true"
                                :show-file-list="false"
                                :on-success="handleSuccess"
                                multiple
                                >
                            <el-button icon="el-icon-paperclip"/>
                        </el-upload>
                        <el-button icon="el-icon-s-promotion" class="save-btn" @click="sendMessage(inputMessage)"/>
                    </div>
                </div>
                <el-dialog :visible.sync="showEditProfile" width="600px" style="margin: -100px auto;">
                    <div slot="title" class="edit-profile-title">
                        <i class="el-icon-edit" style="margin-right: 15px"/>Edit Profile
                        <el-divider edit-profile="true"></el-divider>
                    </div>
                    <el-form :model="updateUserForm" :rules="rules" ref="updateUserForm">
                        <div class="edit-profile-field">
                            <div class="edit-property-name">
                                Username
                            </div>
                            <div>
                                <el-form-item prop="username">
                                    <el-input placeholder="请输入内容" v-model.trim="updateUserForm.username">
                                        <template slot="append"><i class="el-icon-user"/></template>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>

                        <div class="edit-profile-field">
                            <div class="edit-property-name">
                                Username
                            </div>
                            <div>
                                <el-form-item prop="email">
                                    <el-input placeholder="请输入内容" v-model.trim="updateUserForm.email">
                                        <template slot="append"><i class="el-icon-message"/></template>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>

                        <div class="edit-profile-field">
                            <div class="edit-property-name">
                                Avatar
                            </div>
                            <div style="display: flex;justify-content: flex-start">
                                <el-avatar
                                        :src="updateUserForm.avatar"
                                        style="margin-right: 30px"></el-avatar>
                                <my-upload field="file"
                                           @crop-success="cropSuccess"
                                           @crop-upload-success="cropUploadSuccess"
                                           @crop-upload-fail="cropUploadFail"
                                           v-model="showUploadSelector"
                                           :width="300"
                                           :height="300"
                                           :url="uploadAvatarURL"
                                           :withCredentials="true"
                                ></my-upload>
                                <el-button @click="showUploadSelector=true" size="small" type="primary"
                                           style="background-color: #44c4b8">点击上传
                                </el-button>
                            </div>
                        </div>

                        <div class="edit-profile-field">
                            <div class="edit-property-name">
                                City
                            </div>
                            <div>
                                <el-form-item prop="city">
                                    <el-input placeholder="请输入内容" v-model="updateUserForm.city">
                                        <template slot="append"><i class="el-icon-location-outline"/></template>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>

                        <div class="edit-profile-field">
                            <div class="edit-property-name">
                                Phone
                            </div>
                            <div>
                                <el-form-item prop="phone">
                                    <el-input placeholder="请输入内容" v-model.trim="updateUserForm.phone">
                                        <template slot="append"><i class="el-icon-mobile-phone"/></template>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>

                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveProfile({...updateUserForm})" class="save-profile">Save
                        </el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>


    import myUpload from 'vue-image-crop-upload';
    import {
        TwemojiPicker
    } from '@kevinfaguiar/vue-twemoji-picker';
    import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json';
    import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
    import * as api from '@/common/request'
    import message from "@/common/message";
    import SockJS from 'sockjs-client';
    import Stomp from 'stompjs';
    import moment from 'moment'

    export default {
        components: {
            myUpload, TwemojiPicker
        },
        mixins: [message],
        name: "layout",
        data() {
            return {
                input: '',
                selectAboutOrMedia: 'about',
                showProfile: false,
                showEditProfile: false,
                showUploadSelector: false,
                selectChat: '1',
                uploadAvatarURL: 'http://127.0.0.1:9090/user/avatar',
                fileList: [{
                    name: 'food.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }, {
                    name: 'food2.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }],
                inputMessage: '',
                stompClient: null,
                url: 'http://localhost:9090/websocket',
                messages: [],
                hasMoreMessage:true,
                scrollDirection:'bottom',
                page:1,
                pageSize:10,
                updateUserForm: {
                    username: '',
                    email: '',
                    city: '',
                    phone: '',
                    description: '',
                    avatar: ''
                },

                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱', trigger: 'blur'}
                    ], phone: [
                        {validator: this.checkPhone, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            saveProfile(updatedForm) {
                this.$refs['updateUserForm'].validate((valid) => {
                    if (valid) {
                        api.updateUser(updatedForm).then(res => {
                            if (res.data.success) {
                                this.success('更新成功')
                                this.showEditProfile = false
                                this.refreshUser()
                            } else {
                                this.error(`更新失败, ${res.data.message}`)
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            sendMessage(content) {
                if (content!=null&&content!=undefined&&content!=''){
                    this.stompClient.send('/send/chatRoom',{},JSON.stringify({
                        'content':content,
                        'user': this.$store.state.user,
                        'ContextType':'TEXT'
                    }))
                }
            },

            logout() {
                api.logout().then(res => {
                    this.$router.push({path: `/login`})
                })
            },

            cropSuccess(imgDataUrl, field) {
            },
            cropUploadSuccess(result, field) {
                if (result.success) {
                    this.refreshUser()
                }
            },
            cropUploadFail(status, field) {
                this.$message.error("上传失败，请查看网络连接")
            },
            handleSuccess(res,file,fileList){
                if(res.success){
                    this.stompClient.send('/send/chatRoom',{},JSON.stringify({
                        'content':res.message,
                        'user': this.$store.state.user,
                        'ContextType':'RESOURCE'
                    }))
                }else{
                    this.error(`上传文件失败, ${res.message}`)
                }
            },
            emojiUnicodeAdded(ele) {
                this.inputMessage = this.inputMessage + ele
            },
            emojiImgAdded(ele) {
            },
            switchChat(chatId) {
                this.selectChat = chatId
            },
            initUpdateUserForm(userForm) {
                this.updateUserForm = userForm
            },
            checkPhone(rule, value, callback) {
                if (!value) {
                    return callback();
                } else {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                    console.log(reg.test(value));
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            },
            refreshUser() {
                api.getUser().then(res => {
                    if (res.data.userId != null) {
                        this.$store.commit('setUser', res.data)
                        this.initUpdateUserForm({...this.$store.state.user})
                    } else {
                        this.error(res.data.message)
                    }
                })
            },
            connect() {
                let sockJS = new SockJS(this.url);
                this.stompClient = Stomp.over(sockJS);

                this.stompClient.connect({}, () => {
                    console.log('stomp  连接成功')
                    this.stompClient.subscribe('/subscribe/chatRoom',(message)=>{
                        if (message.body){
                            console.log('接受聊天室消息')
                            let messageVo = JSON.parse(message.body);
                            console.log(messageVo)
                            this.messages.push(messageVo)
                            this.inputMessage = ''
                        }
                    })
                })
            },
            isMyMessage(message){
                return message.ownerId==this.$store.state.user.userId
            },
            applyMoreMessage(page,pageSize){
                this.scrollDirection = 'top'
                api.applyMoreMessage(page,pageSize).then(res=>{
                    if (res.data.content.length>0){
                        if (res.data.totalPages==this.page){
                            this.hasMoreMessage = false
                        }else{
                            this.page++;
                        }
                        // res.data.
                        this.messages = res.data.content.concat(this.messages)
                    }else{
                        this.hasMoreMessage = false
                    }
                })
            },
            changeScrollDirection(event){

                let obj = this.$el.querySelector("#message-list");
                if (obj.clientHeight+obj.scrollTop+1>obj.scrollHeight){
                    this.scrollDirection = 'bottom'
                }
            },
            scrollToEnd() {
                let container = this.$el.querySelector("#message-list");
                container.scrollTop = container.scrollHeight;
            },
            scrollToTop() {
                let container = this.$el.querySelector("#message-list");
                container.scrollTop = -container.scrollHeight;
            },
        },
        computed: {
            emojiDataAll() {
                return EmojiAllData;
            },
            emojiGroups() {
                return EmojiGroups;
            }
        },
        created() {
            this.connect()
            this.initUpdateUserForm({...this.$store.state.user})
        },
        updated(){
            this.$nextTick(function () {
                if (this.scrollDirection=='top'){
                    this.scrollToTop()
                }else if (this.scrollDirection=='bottom'){
                    this.scrollToEnd()
                }
            })
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
        padding-left: 0px;
        padding-right: 0px;
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
        overflow: scroll;
    }

    .user-list::-webkit-scrollbar {
        display: none;
    }

    .user {
        display: flex;
        justify-content: flex-start;
    }

    .user:hover {
        cursor: pointer;
    }


    .username-and-message {
        margin-left: 20px;
    }

    .user-list .username {
        color: #26a69a;
        font-size: 16px;
    }

    .message-thumb {
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
        height: 77%;
        overflow-y: scroll;
        padding-left: 20px;
        padding-right: 20px;
    }

    .message-input-area {
        height: 23%;
        padding-top: 35px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .message-input-line {
        display: flex;
        justify-content: flex-start;
        background-color: #2e364a;
        border-radius: 10px;
        padding: 15px 20px 15px 0px;
        align-items: center;
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

    .message {
        max-width: 65%;
        margin-left: 20px;
        margin-right: 20px;
    }

    .message .content {

        border-radius: 10px;
        background-color: #2E364A;
        padding: 15px;
        word-break: break-word;
        color: rgba(255, 255, 255, .8);
        font-family: Inter, sans-serif;
        font-size: 14px;
    }

    .message-meta {
        margin-bottom: 50px;
    }

    .avatar {
        /*margin-top: 2px;*/
    }

    .post-time {
        color: #828282;
        margin-top: 5px;
        font-style: italic;
        font-size: 12px;
        text-align: right;
    }

    .other-message {
        display: flex;
        justify-items: flex-start;
    }

    .mine-message {
        display: flex;
        justify-content: flex-end;
    }

    .other-message, .mine-message {
        margin-bottom: 50px;
    }

    .message-image{
        max-width: 200px;
        border-radius: 5px;
    }

    .has-more-message{
        color: cornflowerblue;
        text-align: center;
    }

    .has-more-message-hover:hover{
        cursor: pointer;
    }

</style>

