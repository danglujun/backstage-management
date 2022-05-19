/* eslint-disable require-atomic-updates */ /* eslint-disable require-atomic-updates */
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
          <el-button
            v-if="row.isSale === 0"
            type="success"
            icon="el-icon-bottom"
            size="mini"
            @click="OnSale(row)"
          ></el-button>
          <el-button
            v-else
            type="info"
            icon="el-icon-top"
            size="mini"
            @click="CancelSale(row)"
          ></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
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
    <!-- 抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              type="success"
              style="margin-right: 10px"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="700px" autoplay loop>
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="height: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
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
      total: 0,
      skuInfo: {},
      show: false
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
    },
    // 上架
    async OnSale(row) {
      const res = await this.$api.sku.reqOnSale(row.id)
      if (res.code === 200) {
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    // 下架
    async CancelSale(row) {
      const res = await this.$api.sku.reqCancelSale(row.id)
      if (res.code === 200) {
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message('正在开发中')
    },
    // 获取sku详情的方法
    async getSkuInfo(row) {
      // 展示抽屉
      this.show = true
      // 获取sku数据
      const res = await this.$api.sku.reqSkuInfo(row.id)
      if (res.code === 200) {
        this.skuInfo = res.data
      }
    }
  }
}
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}
</style>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>
