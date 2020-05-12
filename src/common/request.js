import axios from 'axios'

axios.defaults.baseURL=process.env.VUE_APP_REQUEST_BASE_API
axios.defaults.withCredentials=true

export function login(loginForm) {
    return axios.post(`/login`,loginForm)
}

export function logout() {
    return axios.get(`/logout`)
}

export function register(registerForm) {
    return axios.post(`/user/register`,registerForm)
}

export function getUser() {
    return axios.get(`/user`)
}

export function updateUser(updateForm) {
    return axios.post(`/user`,updateForm)
}

export function applyMoreMessage(page,pageSize) {
    return axios.get(`/message`,{
        params:{
            page:page-1,
            size:pageSize
        }
    })
}

export function applyPrivateChat(senderId) {
    return axios.get(`/chat/private/${senderId}`)
}
