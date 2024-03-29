<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            class="date"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="mini"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- 容器 -->
            <div ref="charts" class="charts"></div>
          </el-col>
          <el-col :span="6">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>麦当劳</span>
                <span class="rvalue">299,132</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>必胜客</span>
                <span class="rvalue">283,998</span>
              </li>
              <li>
                <span>4</span>
                <span>海底捞</span>
                <span class="rvalue">266,223</span>
              </li>
              <li>
                <span>5</span>
                <span>西贝筱面村</span>
                <span class="rvalue">223,445</span>
              </li>
              <li>
                <span>6</span>
                <span>汉堡王</span>
                <span class="rvalue">219,663</span>
              </li>
              <li>
                <span>7</span>
                <span>真功夫</span>
                <span class="rvalue">200,997</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      // 收集日历的数据
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      listData: state => state.home.list
    })
  },
  watch: {
    title() {
      // 重新修改图表的配置数据
      this.myCharts.setOption({
        title: {
          text: this.title
        },
        xAxis: {
          data:
            this.title === '销售额'
              ? this.listData.orderFullYearAxis
              : this.listData.userFullYearAxis
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data:
              this.title === '销售额' ? this.listData.orderFullYear : this.listData.orderFullYear,
            color: 'blue'
          }
        ]
      })
    },
    listData() {
      this.myCharts.setOption({
        title: {
          text: '销售额趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.listData.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.listData.orderFullYear,
            color: 'blue'
          }
        ]
      })
    }
  },
  mounted() {
    // 初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts)
    // 配置数据
    this.myCharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [],
          color: 'blue'
        }
      ]
    })
  },
  methods: {
    // 今天
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本月
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.tab {
  width: 100%;
}

.right {
  position: absolute;
  right: 0;
}

.date {
  width: 250px;
  margin: 0px 20px;
}

.right span {
  margin: 0px 10px;
}

.charts {
  width: 100%;
  height: 300px;
}

ul {
  width: 100%;
  list-style: none;
  height: 300px;
  padding: 0px;
}

ul li {
  height: 8%;
  margin: 10px 0;
}

.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}

.rvalue {
  float: right;
}
</style>
