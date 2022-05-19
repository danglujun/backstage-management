<template>
  <!-- 容器 -->
  <div ref="charts" class="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    //  配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        type: 'category'
      },
      yAxis: {
        // 隐藏y轴
        show: false
      },
      // 系列
      series: [
        {
          type: 'line',
          data: [10, 7, 33, 12, 88, 9],
          // 是否平滑曲线显示
          smooth: true,
          itemStyle: {
            opacity: 0
          },
          // 线条样式
          lineStyle: {
            color: 'purple'
          },
          // 区域填充样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'purple' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ],
      // 布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
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
