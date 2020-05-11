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
