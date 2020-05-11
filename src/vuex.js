import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        user: null,
        isLogin: false
    },
    mutations:{
        setUser(state, userInfo){
            state.user = userInfo
            state.isLogin = true
        },
        unsetUser(state) {
            state.user = null
            state.isLogin = false
        }
    }
})

export default store
