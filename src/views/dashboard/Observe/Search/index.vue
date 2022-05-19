<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineChart></LineChart>
        </el-col>
        <el-col :span="12">
          <LineChart></LineChart>
        </el-col>
      </el-row>
      <!-- tab表格 -->
      <el-table :data="tableData" style="width: 100%" border class="table">
        <el-table-column type="index" label="排名" width="80" align="center"> </el-table-column>
        <el-table-column label="搜索关键字" width="180"> </el-table-column>
        <el-table-column label="用户数" sortable> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination layout="prev, pager, next" :total="1000" class="pagination"> </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineChart from './lineChart'

export default {
  name: 'Search',
  components: {
    LineChart
  },
  data() {
    return {
      tableData: [{}]
    }
  }
}
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.search-header {
  display: flex;
  justify-content: space-between;
}

.table {
  margin-top: 10px;
}

.pagination {
  float: right;
  margin: 10px 0;
}
</style>
