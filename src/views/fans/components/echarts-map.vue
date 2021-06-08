<template>
  <div class="map-container">
    <div ref="fans" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
var echarts = require('echarts')

export default {
  name: 'MapIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    var myChart = echarts.init(this.$refs.fans)
    var option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
