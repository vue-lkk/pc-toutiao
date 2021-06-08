<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href='/'>评论管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 列表 -->
      <el-table
        :data="commentLists"
        style="width: 100%"
        stripe
        v-loading="pre_loadding"
      >
        <el-table-column
          class="comment_tilte"
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数">
        </el-table-column>
        <el-table-column
          prop="comment_status"
          label="评论状态">
          <template slot-scope="scope">
            {{scope.row.comment_status ? '正常': '关闭'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
              <el-switch
                v-model="scope.row.comment_status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="onStatusChange(scope.row)"
                :disabled="scope.row.isDisabled"
                >
              </el-switch>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-sizes="[10, 20, 30]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          background
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArticle } from '@/api/user'
import { updateCommentStatus } from '@/api/article'

export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      commentLists: [],
      isDisabled: false,
      totalCount: 0, // 总数据
      pageSize: 10, // 每页大小
      pre_loadding: false,
      page: 1 // 激活的页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    // 修改每页条数 并 重新回到第一页
    handleSizeChange () {
      this.loadArticles(1)
    },
    // 分页
    handleCurrentChange (val) {
      this.loadArticles(this.page)
    },
    // 评论列表
    loadArticles (page = 1) {
      this.page = page
      this.pre_loadding = true
      getArticle({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.isDisabled = false
        })
        this.commentLists = results
        this.totalCount = res.data.data.total_count
        this.pre_loadding = false
      })
    },
    // 评论状态
    onStatusChange (article) {
      article.isDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        console.log(res)
        article.isDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启评论' : '关闭评论'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.cell{
  overflow: hidden;
  // text-overflow:ellipsis;
  // white-space: nowrap;
  display:  -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

}
</style>
