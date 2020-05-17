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

export function applyMoreMessage(queryDto) {
    return axios.get(`/message`,{
        params: queryDto
    })
}

export function applyPrivateChat(senderId) {
    return axios.get(`/chat/private/${senderId}`)
}

export function deletePrivateChat(targetUserId) {
    return axios.delete(`/chat/private/other/${targetUserId}`)
}

export function getOtherUser(userId) {
    return axios.get(`/user/${userId}`)
}

export function resetPassword(resetForm) {
    return axios.post(`/user/reset-password`,resetForm)
}

export function getUsers(params) {
    return axios.get(`/user/users`,{
        params:params
    })
}

export function deleteUser(userId) {
    return axios.delete(`/user/${userId}`)
}

export function freezeUser(userId) {
    return axios.put(`/user/freeze/${userId}`)
}

export function deleteUsers(userIds) {
    return axios.delete(`/user/batch`,{
        params: {
            userIds:userIds
        }
    })
}
