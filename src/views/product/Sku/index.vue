<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"> </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="130">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="100"> </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button type="success" icon="el-icon-bottom" size="mini"></el-button>
          <el-button type="info" icon="el-icon-top" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 当前第几页
      page: 1,
      // 当前页面展示数据的条数
      limit: 10,
      // 存储sku列表的数据
      records: [],
      // 分页器一共需要展示的数据条数
      total: 0
    }
  },
  mounted() {
    // 获取sku列表的方法
    this.getSkuList()
  },
  methods: {
    async getSkuList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      const res = await this.$api.sku.reqSkuList(page, limit)
      if (res.code === 200) {
        this.records = res.data.records
        this.total = res.data.total
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    }
  }
}
</script>

<style lang="sass" scoped></style>
