<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">{{id ? '编辑文章' : '发布文章'}}</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form"
        :model="article"
        :rules="formRules"
         label-width="60px"
      >
        <el-form-item label="标题" prop="title" class="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            height="400"
            placeholder="请输入内容"
            lang="zh"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面" class="cover">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面组件 -->
          <template v-if="article.cover.type > 0">
            <div class="cover-item">
              <uploadCover
                class="img"
                v-for="(cover, index) in article.cover.type"
                :key="index"
                :coverImage="article.cover.images[index]"
                @uploadCover="onuploadCover(index, $event)"
              />
              <!-- <uploadCover
                class="img"
                v-for="(cover, index) in article.cover.type"
                :key="index"
                v-model="article.cover.images[index]"
              /> -->
            </div>
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择活动区域">
              <el-option
                v-for="(item, index) in channels"
                :key="index"
                :label="item.name"
                :value="item.id"
                ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="id">
          <el-button type="primary" @click="onPublish(false)">修改</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getArticleChannels, addArticle, getupdateArticle, updateArticle } from '@/api/user'
import uploadCover from './components/upload-cover.vue'
import { uploadImage } from '@/api/image'
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Image,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  TextAlign,
  Indent,
  LineHeight,
  HorizontalRule,
  Preview,
  Fullscreen
} from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
export default {
  name: 'Publish',
  components: {
    'el-tiptap': ElementTiptap,
    uploadCover
  },
  props: {},
  data () {
    return {
      channels: [], // 频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1 张，3-3张
          images: [] // 封面图片的地址
        },
        channel_id: null // 频道id
      },
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          // { required: true, message: '请输入文章内容', trigger: 'blur' },
          // { trigger: 'change' }
          // 自定义
          {
            validator (rule, value, callback) {
              if (value === '<p></p>' || value.length === 0) {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        channel_id: [
          { required: true, message: '请选择频道' }
        ]
      },
      id: '',
      isShow: true,
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }), // 最多有五级标题
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 默认会把图片生成 base64 字符串和内容存储在一起不太好，
          // 所以需要自定义图片上传
          // 会自动调用uploadRequest() 拿到图片对象,提高加载速度。
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            // 必须返回promis
            return uploadImage(fd).then(res => {
              console.log(res)
              // 返回图片线上地址
              return res.data.data.url
            })
          }
        }),
        new Underline({ bubble: true }), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new TextAlign(),
        new Indent(),
        new LineHeight(),
        new HorizontalRule(),
        new Preview(),
        new Fullscreen()
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    // 加载频道
    this.getArticleChannels()
    // 渲染更改文章内容
    const id = this.$route.query.id
    this.id = id
    if (this.id) {
      this.loadArticle(this.$route.query.id)
    }
  },
  mounted () {},
  methods: {
    getArticleChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    // 发布文章 / 修改文章
    onPublish (draft = false) {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        } else {
          // 修改文章
          if (this.$route.query.id) {
            updateArticle(this.$route.query.id, this.article).then(() => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$router.back()
            })
          } else {
            // 发布文章
            addArticle(this.article, draft).then(res => {
              console.log(res)
              this.$message({
                message: `${draft ? '已存入草稿' : '发布成功'}`,
                type: 'success'
              })
              this.$router.back()
            })
          }
        }
      })
    },
    // 修改文章：加载文章内容
    loadArticle (id) {
      getupdateArticle(id).then(res => {
        this.article = res.data.data
      })
    },
    // 上传封面
    onuploadCover (index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style lang="less" scoped>
.title{
  width: 500px;
}
.cover{
  display:flex;
  flex-direction: column;
  .cover-item{
    display: flex;
    .cover-container{
      margin-right: 10px;
    }
  }
}
</style>
