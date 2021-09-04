import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'true'
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.put['Access-Control-Allow-Origin'] = 'true'

export const customAxios = axios
