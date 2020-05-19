<template>
    <div class="chat-container">
        <div class="message-area" id="message-list" @scroll="changeScrollDirection">
            <div v-if="!hasMoreMessage" class="has-more-message">
                已经没有更多消息了
            </div>
            <div v-if="hasMoreMessage" class="has-more-message has-more-message-hover"
                 @click="applyMoreMessage">
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
                                    <el-avatar :title="message.username" :src="message.avatar"
                                               class="avatar"></el-avatar>
                                </span>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="$emit('openChat',message.senderId)">New Chat
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="$emit('applyOtherProfile',message.senderId)">Profile
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div class="message">
                        <div class="content">
                            <span v-if="message.contextType=='TEXT'">{{message.content}}</span>
                            <img v-else-if="message.contextType=='RESOURCE'&&message.resourceType=='IMAGE'"
                                 :src="message.content" class="message-image" alt="图片">
                            <div v-else style="display: flex;justify-content: flex-start;">
                                <i class="el-icon-link" style="margin-top: 0px;font-size: 25px;margin-right: 10px"/>
                                <div>
                                    <div>
                                        {{message.fileName}}
                                    </div>
                                    <a :href="message.content" target="_blank" class="download-btn">Download</a>
                                </div>
                            </div>

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
                            <img v-else-if="message.contextType=='RESOURCE'&&message.resourceType=='IMAGE'"
                                 :src="message.content"
                                 class="message-image" alt="图片">

                            <div v-else style="display: flex;justify-content: flex-start;">
                                <i class="el-icon-link" style="margin-top: 0px;font-size: 25px;margin-right: 10px"/>
                                <div>
                                    <div>
                                        {{message.fileName}}
                                    </div>
                                    <a :href="message.content" target="_blank" class="download-btn">Download</a>
                                </div>
                            </div>
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
        <div class="pop-record-search">
            <el-button type="primary" icon="el-icon-search" @click="openSearchRecordArea"/>
        </div>
        <div>
            <el-drawer
                    title="聊天记录"
                    :visible.sync="showSearchRecordArea"
                    class="search-record-area"
                    :direction="'rtl'"
                    :size="'70%'"
                    :custom-class="'search-record-area'"
            >
                <div style="margin-left: 20px;display: flex;height: 39.6px">
                    <el-radio-group v-model="searchType" style="margin-right: 30px">
                        <el-radio-button label="文本"></el-radio-button>
                        <el-radio-button label="文件"></el-radio-button>
                    </el-radio-group>
                    <div style="display: flex;justify-content: flex-start">
                        <div style="width: 300px">
                            <el-input @keypress.enter.native="search" placeholder="搜索消息记录" type="text"
                                      v-model="searchContent" style="display: inline-block"
                                      prefix-icon="el-icon-search"/>
                        </div>
                        <el-button @click="search" style="margin-left: 30px">搜索</el-button>
                    </div>
                </div>
                <div class="search-message-area">
                    <div v-for="message in searchMessages" :key="message.messageId" class="message-meta">
                <div v-if="message.contextType=='WELCOME'" class="welcome">
                    <div class="message">
                        {{message.content}}
                    </div>
                </div>
                <div v-if="message.contextType!='WELCOME'&&!isMyMessage(message)" class="other-message">
                    <el-dropdown trigger="click">
                                <span class="el-dropdown-link">
                                    <el-avatar :title="message.username" :src="message.avatar"
                                               class="avatar"></el-avatar>
                                </span>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="$emit('openChat',message.senderId)">New Chat
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="$emit('applyOtherProfile',message.senderId)">Profile
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div class="message">
                        <div class="content">
                            <span v-if="message.contextType=='TEXT'">{{message.content}}</span>
                            <img v-else-if="message.contextType=='RESOURCE'&&message.resourceType=='IMAGE'"
                                 :src="message.content" class="message-image" alt="图片">
                            <div v-else style="display: flex;justify-content: flex-start;">
                                <i class="el-icon-link" style="margin-top: 0px;font-size: 25px;margin-right: 10px"/>
                                <div>
                                    <div>
                                        {{message.fileName}}
                                    </div>
                                    <a :href="message.content" target="_blank" class="download-btn">Download</a>
                                </div>
                            </div>

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
                            <img v-else-if="message.contextType=='RESOURCE'&&message.resourceType=='IMAGE'"
                                 :src="message.content"
                                 class="message-image" alt="图片">

                            <div v-else style="display: flex;justify-content: flex-start;">
                                <i class="el-icon-link" style="margin-top: 0px;font-size: 25px;margin-right: 10px"/>
                                <div>
                                    <div>
                                        {{message.fileName}}
                                    </div>
                                    <a :href="message.content" target="_blank" class="download-btn">Download</a>
                                </div>
                            </div>
                        </div>
                        <div class="post-time">
                            {{message.createTime|formatDate('hh:mm a')}}
                        </div>
                    </div>
                    <el-avatar :src="message.avatar" class="avatar"></el-avatar>
                </div>
            </div>
                </div>
                <div class="pagination">
                    <pagination v-show="searchParams.total>0" :total="searchParams.total" :page.sync="searchParams.page"
                                :limit.sync="searchParams.size" @pagination="getList"/>
                </div>
            </el-drawer>
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
    import pagination from '@/components/pagination'

    export default {
        name: "chat",
        components: {TwemojiPicker, pagination},
        mixins: [messageStomp],
        props: ['stompClient', 'chatType', 'receiverId','valid'],
        data() {
            return {
                messages: [],
                inputMessage: '',
                hasMoreMessage: true,
                scrollDirection: 'bottom',
                page: 1,
                pageSize: 10,
                showSearchRecordArea: false,
                searchType: null,
                searchContent: '',
                searchParams: {
                    total: 0,
                    page: 1,
                    size: 10
                },
                searchMessages: [],
                privateChatMySideSubscribe:null,
                privateChatOtherSideSubscribe:null,
            }
        },
        methods: {
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
            getList() {
                let params = {
                    page: this.searchParams.page - 1,
                    size: this.searchParams.size,
                    receiverIdOrSenderId: this.receiverId,
                    contextType: this.searchType == '文本' ? 'TEXT' : this.searchType=='文件'?'RESOURCE':null,
                    ...this.otherSearchParams
                }

                /**
                 * 私聊要两个人的范围
                 **/
                if (this.receiverId != -1) {
                    params = {
                        ...params,
                        senderIdOrReceiverId: this.$store.state.user.userId,
                    }
                }

                api.applyMoreMessage(params).then(res => {
                    this.searchMessages = res.data.content
                    this.searchParams.total = res.data.totalElements
                })
            },
            applyMoreMessage() {
                this.scrollDirection = 'top'
                let queryDto = {
                    page: this.page - 1,
                    size: this.pageSize,
                    receiverIdOrSenderId: this.receiverId
                }
                /**
                 * 私聊参数
                 */
                if (this.receiverId != -1) {
                    queryDto = {
                        ...queryDto,
                        senderIdOrReceiverId: this.$store.state.user.userId,
                    }
                }

                api.applyMoreMessage(queryDto).then(res => {
                    if (res.data.content.length > 0) {
                        if (res.data.totalPages == this.page) {
                            this.hasMoreMessage = false
                        } else {
                            this.page++;
                        }

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
                        'content': res.filePath,
                        'user': this.$store.state.user,
                        'ContextType': 'RESOURCE',
                        'event': 'SENT_MESSAGE',
                        'resourceType': res.resourceType,
                        'fileName': res.fileName
                    }))
                } else {
                    this.error(`上传文件失败, ${res.message}`)
                }
            },
            sendMessage() {
                if (this.receiverId == '-1') {
                    this.sendChatRoomMessage(this.stompClient, this.inputMessage, () => {
                        this.inputMessage = ''
                    })
                } else {
                    this.sendPrivateChatMessage(this.stompClient, this.inputMessage, this.receiverId, () => {
                        this.inputMessage = ''
                    })
                }
            },
            openSearchRecordArea() {
                // alert(this.receiverId)
                // this.drawer = trueothis.
                this.showSearchRecordArea = true
            },
            search() {
                this.getList();
            },
            subscribe(){
                if (this.receiverId == -1) {
                    this.subscribeChatRoom(this.stompClient, (messageVo) => {
                        this.messages.push(messageVo)
                    })
                    this.sendLoginMessage(this.stompClient)
                    window.addEventListener('beforeunload', () => this.sendLogoutMessage(this.stompClient))
                } else {
                    this.privateChatOtherSideSubscribe =  this.subscribePrivateChat(this.stompClient, this.receiverId, (messageVo) => this.messages.push(messageVo))
                    this.privateChatMySideSubscribe = this.subscribePrivateMySideChat(this.stompClient, this.receiverId, (messageVo) => this.messages.push(messageVo))
                }
            },
            unsubscribe(callback){
                if (this.receiverId == -1) {
                    // nothing need to do
                }else{
                    this.privateChatOtherSideSubscribe.unsubscribe()
                    this.privateChatMySideSubscribe.unsubscribe()
                    callback()
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
            otherSearchParams() {
                let tmp = this.searchContent


                let result = {
                    senderId: null,
                    receiverId: null,
                    senderName: null,
                    receiverName: null,
                    contents:null,
                    fileNames:null
                }

                let matchResult = null;
                matchResult = /senderId:(\d+)/i.exec(tmp);
                if (matchResult != null) {
                    result.senderId = matchResult[1]
                    tmp = tmp.replace(/senderId:(\d+)/i, "");
                }

                matchResult = /receiverId:(\d+)/i.exec(tmp);
                if (matchResult != null) {
                    result.receiverId = matchResult[1]
                    tmp = tmp.replace(/receiverId:(\d+)/i, "");
                }

                matchResult = /senderName:(\w+)/i.exec(tmp);
                if (matchResult != null) {
                    result.senderName = matchResult[1]
                    tmp = tmp.replace(/senderName:(\w+)/i, "");
                }

                matchResult = /receiverName:(\w+)/i.exec(tmp);
                if (matchResult != null) {
                    result.receiverName = matchResult[1]
                    tmp = tmp.replace(/receiverName:(\w+)/i, "");
                }

                matchResult = tmp.match(/([^\s])+/ig)
                if (matchResult != null) {
                    if (this.searchType=='文件'){
                        result.fileNames = matchResult.join(',')
                    }else{
                        result.contents = matchResult.join(',')
                    }
                }
                return result
            }
        },
        watch: {
            receiverId(newValue, oldValue) {
            }
        },
        created() {
            this.subscribe()
            this.getList()
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

    .chat-container {
        position: absolute;
        left: 385px;
        bottom: 0px;
        right: 0px;
        top: 60px;
        overflow-y: hidden;
        padding-left: 0px;
        padding-right: 0px;
    }

    .pop-record-search {
        position: absolute;
        top: 200px;
        right: 0px;
    }


    .pop-record-search:hover {
        /*right: 0px;*/
    }

    .search-message-area {
        overflow-y: auto;
        position: absolute;
        bottom: 70px;
        top: 150px;
        right: 0px;
        left: 0px;
        margin-left: 20px;
        margin-right: 20px;
    }

    .search-message-area::-webkit-scrollbar {
        display: none;
    }

    .pagination {
        position: absolute;
        bottom: 0px;
    }

    .pagination-container {
        background-color: #1A2236;
    }

    .download-btn {
        color: #26a69a;
        text-decoration: none;
    }

    .download-btn:hover{
        color: #088874;
    }

</style>
