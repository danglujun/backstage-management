<template>
  <!-- 容器 -->
  <div ref="charts" class="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'

export default {
  name: 'ProgressChart',
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    //  配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 最小值与最大值
        min: 0,
        max: 100
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        // 均分
        type: 'category'
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          // 柱状图的宽度
          barWidth: 10,
          // 背景颜色设置
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 文本
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }
        }
      ],
      // 布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
