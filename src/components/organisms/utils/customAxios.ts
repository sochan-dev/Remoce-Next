import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'true'
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.put['Access-Control-Allow-Origin'] = 'true'

interface Sample {
  a: String
}

const sampleObj: Sample = {
  a: 'hello'
}

const isSample = (s: Sample): s is Sample => {
  return !s ? false : true
}

isSample(sampleObj)
isSample(null)

export const customAxios = axios
