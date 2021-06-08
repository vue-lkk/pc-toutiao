<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="">素材管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <imageList/>
    </el-card>
  </div>
</template>

<script>
import imageList from './components/image-list.vue'
export default {
  name: 'imageIndex',
  components: {
    imageList
  },
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
