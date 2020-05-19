<template>
    <el-container style="height: 100%">
        <el-header class="header">
            <div style="display: flex;align-items: center">
                <i class="el-icon-chat-line-round icon"></i>
                <span class="description">Chat Room</span>
            </div>
            <div class="return-room" v-if="receiverId!=-1" @click="receiverId=-1">
                <img src="../../assets/return.png" alt="" style="width: 40px">
                <span style="color: #243b93">返回聊天室</span>

            </div>
            <div style="display: flex;align-items: center">
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
            </div>


        </el-header>
        <el-container>
            <el-aside width="200px" class="aside">
                <div class="tip">
                    Private Chats
                </div>
                <div style="padding-left: 20px;padding-right: 20px">
                    <el-input v-model="filterChatInput" placeholder="Search" class="searchArea"
                              style="background-color: black!important;"></el-input>
                </div>
                <div class="user-list">
                    <div v-for="(privateChat,index) in filterMatch(privateChats)" :key="privateChat.privateChatId" >
                        <div class="user" @click="switchChat(privateChat.receiverId)">
                            <el-avatar
                                    :src="privateChat.receiver.avatar"></el-avatar>
                            <div class="username-and-message">
                                <div class="username">{{privateChat.receiver.username}}</div>
                                <div class="message-thumb">What's up, how are you?</div>
                            </div>
                            <div class="message-count-and-time">
                                <div class="time">
                                    Yesterday
                                </div>
                                <div>
                                    <el-dropdown trigger="click">
                                        <span class="el-dropdown-link">
                                            <i class="el-icon-more option-icon"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native="applyOtherProfile(privateChat.receiverId)">
                                                Profile
                                            </el-dropdown-item>
                                            <el-dropdown-item @click.native="closeChat(privateChat.receiverId)">Delete
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </div>
                        </div>

                        <el-divider :user-dived="receiverId==privateChat.receiverId?'select':'unselect'"></el-divider>
                    </div>
                </div>
            </el-aside>

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
                        Last seen: {{$store.state.user.lastLogoutTime|fromNow}}
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
                                <div class="file" v-for="file in recentFiles" :key="file.messageId">
                                    <div style="display: flex;align-items: flex-start">
                                        <i class="el-icon-link" style="margin-right: 15px;margin-top: 3px"/>
                                        <a class="filename" :href="file.content" target="_blank">{{file.fileName}}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="other-profile" v-if="showOtherProfile">
                <div class="profile-readonly-op-header">
                    <span style="color: rgba(255,255,255,.75);font-size: 21px">Profile</span>
                    <div>
                        <el-button style="background-color: #DF1B5C;border: none" type="primary"
                                   icon="el-icon-close" @click="showOtherProfile=false"></el-button>
                    </div>
                </div>
                <div class="profile-meta">
                    <div class="meta-avatar">
                        <img :src="otherProfile.avatar"/>
                    </div>
                    <div class="meta-username">
                        {{otherProfile.username}}
                    </div>
                    <div class="last-seen">
                        Last seen: {{otherProfile.lastLogoutTime|fromNow}}
                    </div>
                    <div class="about-and-media">
                        <span class="select-about-or-media about'">About</span>
                    </div>
                    <div class="about-content">
                        <div class="field">
                            <div>
                                {{otherProfile.description}}
                            </div>
                        </div>
                        <div class="field">
                            <div class="property-name">
                                Phone
                            </div>
                            <div>
                                {{otherProfile.phone||'未填'}}
                            </div>
                        </div>
                        <div class="field">
                            <div class="property-name">
                                City
                            </div>
                            <div>
                                {{otherProfile.city||'未填'}}
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-dialog :visible.sync="showEditProfile" width="600px" style="margin: -100px auto;"
                       :before-close="discardEdit">
                <div slot="title" class="edit-profile-title">
                    <i class="el-icon-edit" style="margin-right: 15px"/>Edit Profile
                    <el-divider edit-profile="true"></el-divider>
                </div>
                <el-form :model="updateUserForm" :rules="rules" ref="updateUserForm">
                    <div class="edit-basic-or-description">
                            <span @click="editWhich='basic'"
                                  :class="editWhich=='basic'?'edit-basic select-basic-or-description':'edit-basic'">Personal</span>
                        <span @click="editWhich='description'"
                              :class="editWhich=='description'?'edit-description select-basic-or-description':'edit-description'">About</span>
                    </div>
                    <div v-show="editWhich=='basic'">
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
                    </div>
                    <div v-show="editWhich=='description'">
                        <el-form>
                            <div>
                                <div class="edit-property-name">
                                    Write a few words that describe you
                                </div>
                                <el-form-item prop="description">
                                    <el-input type="textarea" autosize
                                              v-model="updateUserForm.description"></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saveProfile({...updateUserForm})" class="save-profile">Save
                    </el-button>
                </div>
            </el-dialog>
            <el-main>
<!--                多个聊天区，分别由多个实例管理，分为两类，一个聊天室区，以及多个私聊区-->
                <div>
                    <chat v-show="receiverId==-1" :receiver-id="-1" :chat-type="chatType"
                          v-if="stompClient!=null&&stompClient.connected" @openChat="openChat"
                          @applyOtherProfile="applyOtherProfile" :stomp-client="stompClient"/>
                    <div v-for="privateChat in privateChats" :key="privateChat.receiverId">
                        <chat v-show="receiverId==privateChat.receiverId" :receiver-id="privateChat.receiverId" :ref="`pt_${privateChat.receiverId}`"
                              :chat-type="chatType" v-if="stompClient!=null&&stompClient.connected" @openChat="openChat"
                              @applyOtherProfile="applyOtherProfile" :stomp-client="stompClient"/>
                    </div>
                </div>

            </el-main>
        </el-container>
    </el-container>
</template>

<script>


    import myUpload from 'vue-image-crop-upload';
    import * as api from '@/common/request'
    import message from "@/common/message";
    import chat from "@/components/client/chat";
    import messageStomp from "@/common/message-stomp";
    import SockJS from 'sockjs-client';
    import Stomp from 'stompjs';

    export default {
        components: {
            chat,
            myUpload
        },
        mixins: [message, messageStomp],
        name: "layout",
        data() {
            return {
                filterChatInput: '',
                selectAboutOrMedia: 'about',
                showProfile: false,
                showOtherProfile: false,
                otherProfile: null,
                showEditProfile: false,
                showUploadSelector: false,
                // selectChat: '',
                uploadAvatarURL: 'http://127.0.0.1:9090/user/avatar',
                chatType: 'chatRoom',
                receiverId: -1,
                editWhich: 'basic',
                updateUserForm: {
                    username: '',
                    email: '',
                    city: '',
                    phone: '',
                    description: '',
                    avatar: ''
                },
                showOptionVisible: false,

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
                },

                url: 'http://localhost:9090/websocket',
                stompClient: null,
                privateChats: [],
                recentFiles:[],
            }
        },
        methods: {
            connect() {
                let sockJS = new SockJS(this.url);
                this.stompClient = Stomp.over(sockJS);

                let headers = {username:this.$route.params.username,password:this.$route.params.password}
                this.stompClient.connect(headers, () => {
                    this.subscribeOpenChat()
                })
            },
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
            logout() {
                api.logout().then(res => {
                    this.sendLogoutMessage(this.stompClient)
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
            switchChat(receiverId) {
                this.receiverId = receiverId
            },
            initUpdateUserForm(userForm) {
                this.updateUserForm = userForm
            },
            checkPhone(rule, value, callback) {
                if (!value) {
                    return callback();
                } else {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
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
            discardEdit(done) {
                this.updateUserForm = this.$store.state.user
                done()
            },
            openChat(targetUserId) {
                this.sendOpenChatMessage(this.stompClient, targetUserId)
                setTimeout(() => this.refreshPrivateChatList(), 2000)
                /**
                 * 还需要订阅私聊，todo
                 */
            },
            closeChat(targetUserId) {

                api.deletePrivateChat(targetUserId).then(res => {
                    if (res.data.success) {
                        this.success('删除私聊成功')
                        /**
                         * 需要取消订阅 todo
                         **/
                        this.$refs[`pt_${targetUserId}`][0].unsubscribe(()=>this.refreshPrivateChatList())
                        this.receiverId = -1
                        // setTimeout(()=>console.log(this.stompClient),3000)
                    }
                })
            },
            refreshPrivateChatList() {
                api.applyPrivateChat(this.$store.state.user.userId).then(res => {
                    this.privateChats = res.data
                })
            },
            subscribeOpenChat() {
                this.stompClient.subscribe(`/subscribe/openChat/1`, (message) => {
                    if (message.body) {
                        this.refreshPrivateChatList()
                    }
                })
            },
            filterMatch(pts) {
                return pts.filter(pt => pt.receiver.username.search(this.filterChatInput) != -1)
            },
            applyOtherProfile(otherUserId) {
                api.getOtherUser(otherUserId).then(res => {
                    if (res.data.userId) {
                        this.showOtherProfile = true
                        this.otherProfile = res.data
                    }
                })
            }

        },

        created() {
            /**
             * 需要订阅openChat和closeChat的反馈，用来刷新私聊列表
             */
            this.connect()
            this.refreshPrivateChatList()
            this.initUpdateUserForm({...this.$store.state.user})
        },
        watch:{
            selectAboutOrMedia(newValue,oldValue){
                if (newValue=='media'){
                    let params = {
                        page: 0,
                        size: 4
                    }
                    api.getRecentFiles(params).then(res=>{
                        this.recentFiles = res.data.content
                    })
                }else if (newValue=='about'){

                }
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
        justify-content: space-between;
    }

    .aside {
        position: absolute;
        top: 60px;
        bottom: 0;
        background-color: #2e364a;
        width: 385px !important;
        overflow: hidden;
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
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .time {
        color: #26a69a;
        font-size: 75%;
        font-weight: 400;
        margin-top: 2px;
    }

    .profile-readonly {
        position: absolute;
        width: 350px;
        right: 0px;
        top: 60px;
        bottom: 0px;
        background-color: #2E364A;
        border: none;
        z-index: 100;
        padding-right: 0px;
    }

    .other-profile {
        position: absolute;
        width: 385px;
        left: 0px;
        top: 60px;
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

    .select-about-or-media, .select-basic-or-description {
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
        text-decoration: none;
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

    .return-room {
        display: flex;
        align-items: center
    }

    .return-room:hover {
        cursor: pointer;
    }

    .edit-basic, .edit-description {
        color: whitesmoke;
        margin-right: 20px;
        display: inline-block;
        padding-bottom: 5px;
        margin-bottom: 10px;
    }

    .edit-basic:hover, .edit-description:hover {
        cursor: pointer;
    }

    .option-icon {
        color: #08887C;
        font-size: 18px;
        margin-top: 10px;
        visibility: hidden;
    }

    .message-count-and-time:hover .option-icon {
        visibility: visible;
    }
</style>

