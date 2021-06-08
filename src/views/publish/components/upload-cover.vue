<template>
  <div class="cover-container" @click="showCover">
    <div class="cover-wrap">
        <img
          :src="coverImage ? coverImage : src "
          ref="cover-img"
          class="cover"
        >
    </div>
    <!-- 弹出层 -->
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      append-to-body
      width="70%"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name='first'>
          <imageList
            :isShowAddImage="false"
            :isShowAction="false"
            :isselected="true"
            ref='imgList'
          ></imageList>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name='second'>
          <input type="file" @change="onChange" ref="file">
          <div>
            <img src="" style="width:100px;" ref="previewImage">
          </div>
        </el-tab-pane>
      </el-tabs>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onCoverConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import imageList from '@/views/image/components/image-list.vue'
export default {
  name: 'coverIndex',
  components: {
    imageList
  },
  props: {
    coverImage: {
      type: String
    }
  },
  data () {
    return {
      dialogVisible: false,
      activeName: 'first',
      src: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    showCover () {
      this.dialogVisible = true
    },
    // 上传图片
    onChange () {
      const file = this.$refs.file.files[0]
      const blob = window.URL.createObjectURL(file)
      this.$refs.previewImage.src = blob
    },
    // 点击确定
    onCoverConfirm () {
      // 如果 tab 选中上传图片，并且 选择了图片
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择图片')
          return
        }
        // 上传到服务器
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          console.log(res)
          // 关闭弹出层
          this.dialogVisible = false
          // 将图片地址发送给父组件
          this.$emit('uploadCover', res.data.data.url)
          // 页面展示上传的图片
          this.src = res.data.data.url
        })
      } else {
        // 如果 tab 选中素材库，并且 选择了图片
        if (this.activeName === 'first') {
          // 子组件ref 父组件可以直接访问子组件中的数据
          const imageList = this.$refs.imgList
          const { selected } = imageList
          if (selected === null) {
            this.$message('请选择图片')
            return
          }
          // 关闭对话框
          this.dialogVisible = false
          // 修改父组件
          this.$emit('uploadCover', imageList.images[selected].url)
          // 展示上传的图片
          this.src = imageList.images[selected].url
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cover-container{
  .cover-wrap{
    width: 100px;
    height: 100px;
    border: 1px double #ccc;
    display: flex;
  }
  .cover{
    max-width: 100px;
    height: 100px;
  }
}
</style>
