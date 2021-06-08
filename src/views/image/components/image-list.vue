<template>
  <div class="image-container">
      <div class="radio-box">
        <el-radio-group
          v-model="collect"
          style="padding-bottom: 20px;"
          @change="onCollectChange"
        >
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          class="btn"
          size='mini'
          type="success"
          @click="centerDialogVisible = true"
          v-if="isShowAddImage"
        >上传素材</el-button>
      </div>
    <!-- 素材列表 -->
    <el-row :gutter="10" v-loading="loading">
      <el-col
        :xs="12"
        :sm="6"
        :md="6"
        :lg="4"
        v-for="(img, index) in images"
        :key="index"
        @click.native="selected = index"
        class="row-container"
        >
        <el-image
          class="img"
          style=" height: 150px"
          :src="img.url"
          fit="cover"
        >
        </el-image>
        <div :class="isselected ? 'selected' : ''" v-if="selected === index"></div>
        <div class="image-action" v-if="isShowAction">
          <el-button
            plain
            :icon="img.is_collected? 'el-icon-star-on' : 'el-icon-star-off'"
            @click="onCollect(img)"
            :loading='img.loading'
            circle></el-button>
          <el-button
            plain
            icon='el-icon-delete-solid'
            @click="onDelete(img)"
            :loading='img.loading'
            circle></el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="totalCount"
      @current-change="onPageChange"
      :current-page.sync="page"
    >
    </el-pagination>
    <!-- 弹出层 -->
    <el-dialog
      class="dialog"
      title="上传图片"
      :visible.sync="centerDialogVisible"
      width="40%"
      center
      :append-to-body="true"
    >
      <el-upload
        v-if="centerDialogVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeader"
        name="image"
        multiple
        :on-success="onUploadSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImage, collectImage, deleteCollect } from '@/api/image'
export default {
  name: 'imgListIndex',
  components: {},
  props: {
    isShowAddImage: {
      type: Boolean,
      default () {
        return true
      }
    },
    isShowAction: {
      type: Boolean,
      default () {
        return true
      }
    },
    isselected: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    // 拿到本地的token
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询收藏的素材列表
      images: [], // 图片素材列表
      centerDialogVisible: false, // 弹出层
      uploadHeader: { // 设置请求头
        Authorization: `Bearer ${user.token}`
      },
      loading: false,
      totalCount: 0, // 总页数
      pageSize: 18, // 每页数量
      page: 1, // 控制高亮的页码
      selected: null
    }
  },
  computed: {},
  watch: {},
  created () {
    // 页面初始化加载 第1页数据
    this.loadImage(1)
  },
  mounted () {},
  methods: {
    // 默认渲染组件就显示全部图片
    loadImage (page) {
      this.loading = true
      this.page = page
      getImage({
        collect: this.collect, // 是否收藏
        page, // 第几页
        per_page: this.pageSize // 每页数量
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // 在请求拿到的数据中 添加loading来控制 加载状态
          img.loading = false
        })
        console.log(results)
        this.images = results
        this.totalCount = res.data.data.total_count
        this.loading = false
      })
    },

    // 点击全部 / 收藏 切换
    onCollectChange () {
      this.loadImage(1)
    },

    // 刷新
    onUploadSuccess () {
      // 关闭弹出层
      this.centerDialogVisible = false
      // 更新列表
      this.loadImage(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },

    // 分页
    onPageChange (page) {
      this.loadImage(page)
    },

    // 收藏
    onCollect (img) {
      img.loading = true
      // 已收藏 / 取消收藏
      collectImage(img.id, !img.is_collected).then(res => {
        // 更新收藏图标
        img.is_collected = !img.is_collected
        img.loading = false
        // 更新页面
        this.loadImage(this.page)
      })
    },

    // 删除
    onDelete (img) {
      deleteCollect(img.id).then(res => {
        img.loading = false
        // 更新页面
        this.loadImage(this.page)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.radio-box{
  display: flex;
  justify-content: space-between;
  .btn{
    margin-top: 5px;
    height: 30px;
  }
}
.el-image{
  margin-bottom: 5px;
}
.row-container{
  position: relative;
  .image-action{
    position: absolute;
    height: 40px;
    left: 5px;
    right: 5px;
    bottom: 9px;
    background-color: rgba(204, 204, 204,0);

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    .el-button{
      background-color: rgba(204, 204, 204,0);
      border: 0;
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(204, 204, 204,0);
    }
  }
}
.row-container:hover .image-action{
  background-color: rgba(204, 204, 204,.5);
}
.row-container:hover .el-button{
  color: #ffffffec;
}
.selected{
  width: 95%;
  height: 150px;
  background-color: rgb(6, 131, 214);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: .3;
  margin-left: 5px;
}
</style>
