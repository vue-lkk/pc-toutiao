<template>
  <div class="setting-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">个人设置</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="16">
          <el-form
            ref="form"
            :model="user"
            :rules="rules"
            label-width="80px"
          >
            <el-form-item label="编号">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机">
              {{user.mobile}}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email" prop="email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
                :loading="isSaveProfile"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="3" :span="4">
          <label for="file">
            <el-avatar
              shape="square"
              :size="100"
              fit="cover"
              :src="user.photo">
            </el-avatar>
            <p style="font-size:14px;">点击修改图片</p>
          </label>
          <input
            type="file"
            id="file"
            hidden
            @change="onChange"
            ref="file"
          >
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="头像修改"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      @opened='onDialogopene'
      @close='onDialogclose'
    >
      <div class="preview-img-wrap">
        <img
          class="preview-img"
          :src="previewImage"
          ref="preview-img"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onUpdatePhoto"
          :loading="isLoading"
          >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

import bus from '@/globle-bus'

export default {
  name: 'Setting',
  components: {},
  props: {},
  data () {
    return {
      user: {},
      dialogVisible: false,
      previewImage: '', // 裁切的图片
      cropper: null, // 裁切器
      isLoading: false,
      isSaveProfile: false,
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'blur' },
          { min: 10, message: '不可以少于10个字', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onSubmit () {
      // 表单验证
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        } else {
          // 接口验证
          this.isSaveProfile = true
          const { name, email, intro } = this.user
          updateUserProfile({
            name,
            email,
            intro
          }).then(() => {
            this.isSaveProfile = false
            bus.$emit('article-user', this.user)
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          })
        }
      })
    },
    // 获取用户信息
    loadUser () {
      userProfile().then(res => {
        this.user = res.data.data
      })
    },
    onChange () {
      // 拿到图片
      const file = this.$refs.file
      // API
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 展示弹出层，预览图片
      this.dialogVisible = true
      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },
    onDialogopene () {
      // 获取图片 DOM节点
      const image = this.$refs['preview-img']
      // 注意：图片裁切必须基于 img 进行初始化，
      // 必须是 img 是可见状态才能完成 初始化裁切器
      // 初始化裁切器
      this.cropper = new Cropper(image, {
        // 裁切器比例
        aspectRatio: 1 / 1,
        // 裁切器不可移出图片
        viewMode: 1,
        // move:可移动图片  none:不可移动图片
        dragMode: 'move',
        // 背景
        background: false,
        // 不可缩放裁切框
        cropBoxResizable: false
        // 跟dragMode功能一样
        // movable: false
        // 当你移动裁切器的时候就会触发调用crop 方法
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    // 弹出层关闭
    onDialogclose () {
      this.cropper.destroy()
    },
    // 确定
    onUpdatePhoto () {
      this.isLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求接口更新用户头像 请求提交fb
        updateUserPhoto(fd).then(res => {
          console.log(res)
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示（这个拿接口的图片有点慢）
          // this.user.photo = res.data.data.photo
          // 更新视图展示（这个不用在接口拿）直接把裁切对象转换为 blob
          this.user.photo = window.URL.createObjectURL(file)
          this.isLoading = true
          bus.$emit('article-user', this.user)
          // 提示
          this.$message({
            type: 'success',
            message: '头像修改成功'
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview-img-wrap{
  .preview-img{
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
