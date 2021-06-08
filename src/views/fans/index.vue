<template>
  <div class="fans-container">
    <div ref="fans" style="width: 600px;height:400px;">
    </div>
    <Map/>
  </div>
</template>

<script>
import Map from './components/echarts-map.vue'
var echarts = require('echarts')

export default {
  name: 'FansIndex',
  components: {
    Map
  },
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    var myChart = echarts.init(this.$refs.fans)
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '第一个ECharts实例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
