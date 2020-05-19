export default {
    methods:{
        /**
         * 发聊天室消息
         */
        sendChatRoomMessage(client,content,done) {
            if (content != null && content != undefined && content != '') {
                client.send('/send/chatRoom', {}, JSON.stringify({
                    'content': content,
                    'user': this.$store.state.user,
                    'ContextType': 'TEXT',
                    'event': 'SENT_MESSAGE',
                    'receiverId':-1
                }))
            }
            done()
        },
        /**
         * 发私聊消息
         */
        sendPrivateChatMessage(client,content,targetUserId,done) {
            if (content != null && content != undefined && content != '') {
                client.send('/send/chat', {}, JSON.stringify({
                    'content': content,
                    'user': this.$store.state.user,
                    'ContextType': 'TEXT',
                    'event': 'SENT_MESSAGE',
                    'receiverId': targetUserId
                }))
            }
            done()
        },
        /**
         * 发进入聊天室的消息
         */
        sendLoginMessage(client){
            client.send('/send/chatRoom', {}, JSON.stringify({
                'user': this.$store.state.user,
                'event': 'LOGIN'
            }))
        },
        /**
         * 发退出聊天室的消息，绑定在窗口关闭的时候
         */
        sendLogoutMessage(client){
            client.send('/send/chatRoom', {}, JSON.stringify({
                'user': this.$store.state.user,
                'event': 'LOGOUT'
            }))
        },
        /**
         * 发打开私聊的消息
         */
        sendOpenChatMessage(client,targetUserId){
            client.send('/send/openChat', {}, JSON.stringify({
                'user': this.$store.state.user,
                'targetUserId': targetUserId
            }))
        },

        /**
         * 订阅聊天室消息
         */
        subscribeChatRoom(stompClient,done){
            return stompClient.subscribe('/subscribe/chatRoom', (message) => {
                if (message.body) {
                    let messageVo = JSON.parse(message.body);
                    done(messageVo)
                }
            })
        },

        /**
         * 订阅他人发过来的私聊
         */
        subscribePrivateChat(stompClient,targetUserId,done){
            return stompClient.subscribe(`/subscribe/chat/sender/${targetUserId}/receiver/${this.$store.state.user.userId}`, (message) => {
                if (message.body) {
                    let messageVo = JSON.parse(message.body);
                    done(messageVo)
                }
            })
        },

        /**
         * 订阅自己发出去的私聊(如果不订阅，自己发出去的收不回来)
         */
        subscribePrivateMySideChat(stompClient,targetUserId,done){
            return stompClient.subscribe(`/subscribe/chat/sender/${this.$store.state.user.userId}/receiver/${targetUserId}`, (message) => {
                if (message.body) {
                    let messageVo = JSON.parse(message.body);
                    done(messageVo)
                }
            })
        },
    }
}
