<template>
  <div class="">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside
        class="aside"
        width="auto"
      >
        <app-aside class="aside-menu" :isCollapse="isCollapse"/>
      </el-aside>
      <el-container>
        <!-- 顶部 -->
        <el-header class="header">
          <div>
            <i
              :class="isCollapse?'el-icon-s-unfold': 'el-icon-s-fold'"
              @click="isCollapse = !isCollapse"
            >
            </i>
            <span>卡卡</span>
          </div>
          <el-dropdown>
            <div class="user-menu">
              <img :src="user.photo" alt="">
              <span>
                {{user.name}}
              </span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="onlogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <!-- 内容 -->
        <el-main class="main">
          <!--子路由-->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAside from './components/aside'
import { userProfile } from '@/api/user'

import bus from '@/globle-bus'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      user: [], // 当前登陆用户信息
      isCollapse: false // 侧边栏的展示状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserProfile()
    // 事件总线
    bus.$on('article-user', (data) => {
      console.log(data)
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  mounted () {},
  methods: {
    getUserProfile () {
      userProfile().then(res => {
        this.user = res.data.data
        console.log(res)
      })
    },
    // 退出登陆
    onlogout () {
      this.$confirm('确认退出码?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已成功退出,欢迎下次使用！'
        })
        window.localStorage.removeItem('user')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layout-container{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .aside{
    background-color: #ccc;
    .aside-menu{
      height: 100%;
    }
  }
}
.header{
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items:center;
  .user-menu{
    display: flex;
    align-items: center;
    img{
      width: 35px;
      height: 35px;
      border-radius: 35px;
      margin-right: 5px;
    }
  }
}
.main{
  background-color: #ccc;
}
</style>
