<template>
    <div class="chat-container">
        <div class="message-area" id="message-list" @scroll="changeScrollDirection">
            <div v-if="!hasMoreMessage" class="has-more-message">
                已经没有更多消息了
            </div>
            <div v-if="hasMoreMessage" class="has-more-message has-more-message-hover"
                 @click="applyMoreMessage(page,pageSize)">
                <i class="el-icon-pie-chart" style="margin-right: 15px"/>查看更多消息
            </div>
            <div v-for="message in messages" :key="message.messageId" class="message-meta">
                <div v-if="message.contextType=='WELCOME'" class="welcome">
                    <div class="message">
                        {{message.content}}
                    </div>
                </div>
                <div v-if="message.contextType!='WELCOME'&&!isMyMessage(message)" class="other-message">
                    <el-dropdown trigger="click">
                                <span class="el-dropdown-link">
                                    <el-avatar :title="message.username" :src="message.avatar" class="avatar"></el-avatar>
                                </span>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="$emit('openChat',message.senderId)">New Chat</el-dropdown-item>
                            <el-dropdown-item >Profile</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div class="message">
                        <div class="content">
                                    <span v-if="message.contextType=='TEXT'">
                                    {{message.content}}
                                    </span>
                            <img v-if="message.contextType=='RESOURCE'" :src="message.content"
                                 class="message-image" alt="">
                        </div>
                        <div class="post-time">
                            {{message.createTime|formatDate('hh:mm a')}}
                        </div>
                    </div>
                </div>
                <div v-if="message.contextType!='WELCOME'&&isMyMessage(message)" class="mine-message">
                    <div class="message">
                        <div class="content">
                                    <span v-if="message.contextType=='TEXT'">
                                    {{message.content}}
                                    </span>
                            <img v-if="message.contextType=='RESOURCE'" :src="message.content"
                                 class="message-image" alt="图片">
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

                <el-input v-model="inputMessage" @keypress.enter.native="sendMessage" placeholder="Write a message"/>

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
                <el-button icon="el-icon-s-promotion" class="save-btn" @click="sendMessage"/>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from "@/common/request";
    import {
        TwemojiPicker
    } from '@kevinfaguiar/vue-twemoji-picker';
    import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json';
    import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
    import messageStomp from "@/common/message-stomp";
    import message from "@/common/message";

    export default {
        name: "chat",
        components:{TwemojiPicker},
        mixins:[messageStomp],
        props:['stompClient','chatType','receiverId'],
        data(){
          return {
              messages: [],
              inputMessage: '',
              hasMoreMessage: true,
              scrollDirection: 'bottom',
              page: 1,
              pageSize: 10,
          }
        },
        methods:{
            changeScrollDirection(event) {

                let obj = this.$el.querySelector("#message-list");
                if (obj.clientHeight + obj.scrollTop + 1 > obj.scrollHeight) {
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
            isMyMessage(message) {
                return message.senderId == this.$store.state.user.userId
            },
            applyMoreMessage(page, pageSize) {
                this.scrollDirection = 'top'
                api.applyMoreMessage(page, pageSize).then(res => {
                    if (res.data.content.length > 0) {
                        if (res.data.totalPages == this.page) {
                            this.hasMoreMessage = false
                        } else {
                            this.page++;
                        }
                        // res.data.
                        this.messages = res.data.content.concat(this.messages)
                    } else {
                        this.hasMoreMessage = false
                    }
                })
            },
            emojiUnicodeAdded(ele) {
                this.inputMessage = this.inputMessage + ele
            },
            emojiImgAdded(ele) {
            },
            handleSuccess(res, file, fileList) {
                if (res.success) {
                    this.stompClient.send('/send/chatRoom', {}, JSON.stringify({
                        'content': res.message,
                        'user': this.$store.state.user,
                        'ContextType': 'RESOURCE'
                    }))
                } else {
                    this.error(`上传文件失败, ${res.message}`)
                }
            },
            subscribeChatRoom(){
                this.stompClient.subscribe('/subscribe/chatRoom', (message) => {
                    if (message.body) {
                        console.log('接受聊天室消息')
                        let messageVo = JSON.parse(message.body);
                        console.log(messageVo)
                        if (this.receiverId!=-1){
                            this.$store.state.messagesMap.get(-1).push(messageVo)
                        }else {
                            this.messages.push(messageVo)
                        }
                    }
                })
                this.sendLoginMessage(this.stompClient)
            },
            subscribePrivateChat(targetUserId){
                this.stompClient.subscribe(`/subscribe/chat/sender/${targetUserId}/receiver/${this.$store.state.user.userId}`, (message) => {
                    if (message.body) {
                        console.log('接受私聊消息')
                        let messageVo = JSON.parse(message.body);
                        console.log(messageVo)

                        if (this.receiverId!=-targetUserId){
                            this.$store.state.messagesMap.get(targetUserId).push(messageVo)
                        }else {
                            this.messages.push(messageVo)
                        }
                    }
                })
            },
            subscribePrivateMySideChat(targetUserId){
                this.stompClient.subscribe(`/subscribe/chat/sender/${this.$store.state.user.userId}/receiver/${targetUserId}`, (message) => {
                    if (message.body) {
                        console.log('接受私聊消息')
                        let messageVo = JSON.parse(message.body);
                        if (this.receiverId!=-targetUserId){
                            this.$store.state.messagesMap.get(targetUserId).push(messageVo)
                        }else {
                            this.messages.push(messageVo)
                        }
                    }
                })
            },
            sendMessage(){
                if (this.receiverId=='-1'){
                    this.sendChatRoomMessage(this.stompClient,this.inputMessage)
                }else {
                   this.sendPrivateChatMessage(this.stompClient,this.inputMessage,this.receiverId)
                }
            }
        },
        updated() {
            this.$nextTick(function () {
                if (this.scrollDirection == 'top') {
                    this.scrollToTop()
                } else if (this.scrollDirection == 'bottom') {
                    this.scrollToEnd()
                }
            })
        },
        computed: {
            emojiDataAll() {
                return EmojiAllData;
            },
            emojiGroups() {
                return EmojiGroups;
            },
        },
        watch:{
            receiverId(newValue,oldValue){
                /**
                 * vuex设置messages
                 */
                this.$store.commit('saveMessages',{
                    receiverId: oldValue,
                    messages: this.messages
                })

                 if(this.$store.state.messagesMap.get(newValue)==undefined){
                     this.messages = []
                     /**
                      * 订阅别人发来的
                      */
                     this.subscribePrivateChat(newValue)
                     /**
                      * 监听自己发出去的
                      */
                     this.subscribePrivateMySideChat(newValue)
                 }else{
                     this.messages = this.$store.state.messagesMap.get(newValue)
                 }

                 console.log(this.stompClient)

                // console.log(this.messages);
            }
        },
        created(){
            this.subscribeChatRoom()
            // this.subscribeChatRoom()
            // this.subscribeChatRoom()
            window.addEventListener('beforeunload',()=>this.sendLogoutMessage(this.stompClient))
        },
    }
</script>

<style scoped>

    .message-area {
        height: 77%;
        overflow-y: scroll;
        padding-left: 20px;
        padding-right: 20px;
    }

    .message-area::-webkit-scrollbar {
        background-color: #1a2236;
    }
    .message-area::-webkit-scrollbar-thumb {
        background-color: rgba(66, 66, 66, 0.2);
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

    .welcome > .message {
        border-radius: 10px;
        background-color: #2E364A;
        padding: 7px;
        color: rgba(255, 255, 255, .8);
        font-family: Inter, sans-serif;
        font-size: 12px;
    }

    .welcome {
        display: flex;
        justify-content: center;
        margin-top: 10px;
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

    .message-image {
        max-width: 200px;
        border-radius: 5px;
    }

    .has-more-message {
        color: cornflowerblue;
        text-align: center;
    }

    .has-more-message-hover:hover {
        cursor: pointer;
    }

    .message-meta {
        margin-bottom: 50px;
    }

    .avatar:hover {
        cursor: pointer;
    }

    .post-time {
        color: #828282;
        margin-top: 5px;
        font-style: italic;
        font-size: 12px;
        text-align: right;
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

    .chat-container{
        position: absolute;
        left: 385px;
        bottom: 0px;
        right: 0px;
        top: 60px;
        overflow-y: hidden;
        padding-left: 0px;
        padding-right: 0px;
    }
</style>
