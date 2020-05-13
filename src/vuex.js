import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        user: null,
        isLogin: false,
        messagesMap:new Map()
    },
    mutations:{
        setUser(state, userInfo){
            state.user = userInfo
            state.isLogin = true
        },
        unsetUser(state) {
            state.user = null
            state.isLogin = false
        },
        saveMessages(state,payload){
            state.messagesMap.set(payload.receiverId,payload.messages)
        },
    }
})

export default store
