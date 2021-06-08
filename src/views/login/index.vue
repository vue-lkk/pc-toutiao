<template>
  <div class="login-container">
    <el-form class="login-form" ref="loginForm" :model="form" :rules="formRules">
      <el-form-item prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="checked">
        <el-checkbox v-model="form.checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="loginLoading"
          @click="onLogin"
        >登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      form: { // 表单
        mobile: '', // 手机号
        code: '', // 验证码
        checked: false // 是否同意协议的选中状态
      },
      // checked: false, // 是否同意协议的选中状态
      loginLoading: false, // 登陆的 loading 状态
      formRules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
        ],
        checked: [
          {
            // 自定义验证规则
            // 验证通过 callback()
            // 验证失败 callback(new Error('请同意用户协议'))
            validator: (rules, value, callback) => {
              // console.log(value)
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      // 表单验证  验证成功才能发请求接口验证
      // validate()为异步 所以 this.login()要放在里面
      this.$refs.loginForm.validate((valid, err) => {
        // console.log(valid, err)
        if (!valid) {
          return
        }
        // 请求接口验证
        this.login()
      })
    },
    login () {
      // 请求接口验证
      const user = this.form
      this.loginLoading = true
      login(user).then(res => {
        console.log(res)
        this.$message({
          showClose: true,
          message: '登陆成功',
          type: 'success'
        })
        this.loginLoading = false
        // 将接口返回用户相关的数据放到本地存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 跳转到首页
        // this.$router.push('/')
        // 跳转到首页
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登陆失败', err)
        this.$message({
          showClose: true,
          message: '登陆失败,手机号或验证码错误',
          type: 'error'
        })
        this.loginLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('./login.jpg') no-repeat;
  background-size: cover;
  .login-form{
    background-color: #fff;
    padding: 50px;
    .login-btn{
      width: 100%;
    }
  }
}
</style>
