<template>
  <div class="">
      <el-card class="box-card filter-card">
        <div slot="header" class="clearfix">
          <!-- 面包屑 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 数据筛选表单 -->
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          class="demo-ruleForm"
          size="mini"
          v-loading="loading"
        >
          <el-form-item label="状态" prop="resource">
            <el-radio-group v-model="status">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">通过审核</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道">
            <el-select v-model="channelId" placeholder="请选择频道">
              <el-option
                label="全部"
                :value="channelId"
              >
              </el-option>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in channels"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="rangeDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="loadArticle(status)"
              :disabled="loading">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>根据筛选条件共才查询到 <i>{{totalCount}}</i> 条结果：</span>
        </div>
        <!-- 数据列表 -->
        <el-table
          :data="articles"
          style="width: 100%"
          border
          stripe
          size="mini"
          v-loading="loading">
          <el-table-column
            prop="date"
            label="封面"
          >
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.cover.images[0]"
                fit="cover"
                lazy>
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            class="table-title"
            prop="title"
            label="标题"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag
              :type="srticleStatus[scope.row.status].type"
              >{{srticleStatus[scope.row.status].text}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布时间"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle  @click="$router.push('/publish?id=' + scope.row.id.toString())"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="DeleteArticle(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 列表分页 -->
        <el-pagination
          layout="prev, pager, next"
          :total="totalCount"
          @current-change="currentChange"
          :page-size="pageSize"
          ref='pageDom'
          :disabled="loading"
          :current-page.sync="page"
          >
        </el-pagination>
      </el-card>
  </div>
</template>

<script>
import { getArticle, getArticleChannels, deleteArticle } from '@/api/user'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      ruleForm: {
        region: '',
        delivery: false,
        type: []
      },
      articles: [],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      status: null, // 状态
      channels: [], // 频道
      channelId: null, // 频道Id
      pageDom: null,
      rangeDate: null,
      loading: true, // 是否显示加载
      page: 1, // 默认第一页
      srticleStatus: [
        { status: 0, text: '草稿', type: 'warning' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核成功', type: 'success' },
        { status: 3, text: '审核失败', type: 'danger' },
        { status: 4, text: '已删除', type: 'info' }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getArticle()
    this.getArticleChannels()
  },
  mounted () {},
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 请求数据默认第一页
    getArticle (page = 1) {
      this.loading = true // 显示加载
      getArticle({
        page, // 第几页
        per_page: this.pageSize, // 每页条数
        status: this.status, // 状态
        channel_id: this.channelId, // 频道
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 结束日期
      }).then(res => {
        // console.log(res)
        const { results, total_count: totalCount } = res.data.data
        this.articles = results // 保存数据
        this.totalCount = totalCount // 总条数
        this.loading = false // 关闭加载
      })
    },
    // 分页
    currentChange (page) {
      console.log(page)
      this.getArticle(page)
    },
    // 查询
    loadArticle (status) {
      this.getArticle()
    },
    // 获取频道
    getArticleChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    // 删除文章
    DeleteArticle (id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 删除成功
        deleteArticle(id)
        this.getArticle(this.page)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card{
  margin-bottom: 30px;
}
.article-img{
  width: 60px;
  background-size: cover;
}
/deep/.cell{
  overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
