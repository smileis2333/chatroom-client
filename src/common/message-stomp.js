export default {
    methods:{
        sendMessage(client,content) {
            if (content != null && content != undefined && content != '') {
                client.send('/send/chatRoom', {}, JSON.stringify({
                    'content': content,
                    'user': this.$store.state.user,
                    'ContextType': 'TEXT',
                    'event': 'SENT_MESSAGE',
                    'receiverId':-1
                }))
            }
        },
        sendLoginMessage(client){
            client.send('/send/chatRoom', {}, JSON.stringify({
                'user': this.$store.state.user,
                'event': 'LOGIN'
            }))
        },
        sendLogoutMessage(client){
            client.send('/send/chatRoom', {}, JSON.stringify({
                'user': this.$store.state.user,
                'event': 'LOGOUT'
            }))
        },
        sendOpenChatMessage(client,targetUserId){
            client.send('/send/openChat', {}, JSON.stringify({
                'user': this.$store.state.user,
                'targetUserId': targetUserId
            }))
        },
    }
}
