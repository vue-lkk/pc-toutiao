// Vue CLI 的配置
// 这个文件可以配置内部的 webpack 配置

// 该文件必须导出一个对象 (node 中模块语法)
module.exports = {
  // 自定义 Vue CLI 中webpack配置
  configureWebpack: {
    // 告诉webpack 使用 script 标签加载那个资源，而不是去node_modules中打包处理
    externals: {
      // 属性名： 你加载的那个包名 ,必须是字符串
      // 属性值： script 标签暴露的全局变量，必须是字符串
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      echarts: 'echarts'
    }
  }

}
