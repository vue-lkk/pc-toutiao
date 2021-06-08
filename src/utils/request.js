import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
// 单独引用
import { Message } from 'element-ui'

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      return data
    }
    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 统一处理token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, (err) => {
  console.log(err)
})

// 响应拦截器
request.interceptors.response.use(res => {
  return res
}, err => {
  const { status } = err.response
  // 任何 超出2xx 的响应状态码都会进入这里
  // 401 token错误
  if (status === 401) {
    // 跳转到登陆
    router.push('/login')
    Message('登陆状态无效,请重新登陆')
    // 清除token
    window.localStorage.removeItem('user')
  } else if (status === 403) {
    // token 未携带或已过期
    Message('没有操作权限')
  } else if (status === 400) {
    // 客户端参数错误
    Message('请求参数错误')
  } else if (status >= 5000) {
    // 服务器错误
    Message('服务的内部异常,请稍后重试')
  }
})

export default request
