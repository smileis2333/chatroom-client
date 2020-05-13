export default {
    methods:{
        sendChatRoomMessage(client,content) {
            if (content != null && content != undefined && content != '') {
                client.send('/send/chatRoom', {}, JSON.stringify({
                    'content': content,
                    'user': this.$store.state.user,
                    'ContextType': 'TEXT',
                    'event': 'SENT_MESSAGE',
                    'receiverId':-1
                }))
            }

            this.inputMessage = ''
        },
        sendPrivateChatMessage(client,content,targetUserId) {
            if (content != null && content != undefined && content != '') {
                client.send('/send/chat', {}, JSON.stringify({
                    'content': content,
                    'user': this.$store.state.user,
                    'ContextType': 'TEXT',
                    'event': 'SENT_MESSAGE',
                    'receiverId': targetUserId
                }))
            }
            this.inputMessage = ''
        },
        sendLoginMessage(client){
            client.send('/send/chatRoom', {}, JSON.stringify({
                'user': this.$store.state.user,
                'event': 'LOGIN'
            }))

            this.inputMessage = ''
        },
        sendLogoutMessage(client){
            client.send('/send/chatRoom', {}, JSON.stringify({
                'user': this.$store.state.user,
                'event': 'LOGOUT'
            }))

            this.inputMessage = ''
        },
        sendOpenChatMessage(client,targetUserId){
            client.send('/send/openChat', {}, JSON.stringify({
                'user': this.$store.state.user,
                'targetUserId': targetUserId
            }))
            this.inputMessage = ''
        },
    }
}
