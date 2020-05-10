import axios from 'axios'

axios.defaults.baseURL=process.env.VUE_APP_REQUEST_BASE_API
axios.defaults.withCredentials=true

export function login(loginForm) {
    return axios.post(`/login`,loginForm)
}
