<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect :show="scene != 0" @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里有三部分进行切换展示 -->
      <div v-show="scene === 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!category3Id"
          @click="addSpu"
        >添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column align="center" type="index" label="序号" width="80"> </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"> </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"> </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                title="添加sku"
                type="success"
                icon="el-icon-plus"
                size="mini"
                @click="addSku(row)"
              ></el-button>
              <el-button
                title="修改spu"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                title="查看当前spu的sku列表"
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onconfirm="deleteSpu(row)">
                <el-button
                  slot="reference"
                  title="删除spu"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-count="7"
          :page-size="limit"
          layout="prev, pager, next, jumper,->, sizes,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene === 1" ref="spu" @changeScene="changeScene"></SpuForm>
      <SkuForm v-show="scene === 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table v-loading="loading" :data="skuList" style="width: 100%" border>
        <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
        <el-table-column prop="price" label="价格" width="width"> </el-table-column>
        <el-table-column prop="weight" label="重量" width="width"> </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'

export default {
  name: 'Spu',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      total: 0,
      records: [],
      // 0：展示spu列表数据，1：展示添加spu|修改spu，2：展示添加sku
      scene: 0,
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      // 控制loading的显示与隐藏
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件，可以把子组件相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId：获取到的一二三级分类的id；level：区分是几级id
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 获取spu数据列表进行展示
        this.getSpuList()
      }
    },
    // 获取spu列表数据的方法
    async getSpuList(pager = 1) {
      this.page = pager
      const { page, limit, category3Id } = this
      const res = await this.$api.spu.reqSpuList(page, limit, category3Id)
      if (res.code === 200) {
        this.total = res.data.total
        this.records = res.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加spu按钮的回调
    addSpu() {
      // 切换为场景1
      this.scene = 1
      // 通知子组件发请求--两个
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改spu按钮的回调
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuDate(row)
    },
    // SpuForm自定义事件回调
    changeScene({ scene, flag }) {
      // flag：区分保存按钮是添加还是修改
      // 切换结构（场景）
      this.scene = scene
      // 重新获取数据展示
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu
    async deleteSpu(row) {
      const res = await this.$api.spu.reqDeleteSpu(row.id)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku按钮的回调
    addSku(row) {
      // 切换场景为2
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求--三个请求
      this.$refs.sku.getDate(this.category1Id, this.category2Id, row)
    },
    // SkuForm自定义事件回调
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看sku列表按钮的回调
    async handler(row) {
      this.dialogTableVisible = true
      this.spu = row
      // 发请求获取sku列表数据进行展示
      const res = await this.$api.spu.reqSkuList(row.id)
      if (res.code === 200) {
        this.skuList = res.data
        // loading隐藏
        this.loading = false
      }
    },
    // 关闭对话框前的回调
    close(done) {
      this.loading = true
      // 清除sku列表的数据
      this.skuList = []
      // done 用于关闭 Dialog
      done()
    }
  }
}
</script>

<style lang="sass" scoped></style>
