<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" type="number" placeholder="价格(元)"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          v-model="skuInfo.skuDesc"
          type="textarea"
          rows="4"
          placeholder="规格描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndAttrValueId" placeholder="请选择">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
          >
            <el-select v-model="saleAttr.saleAttrIdAndSaleAttrValueId" placeholder="请选择">
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"> </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.isDefault === 0"
                type="primary"
                @click="changeDefault(row)"
              >设为默认</el-button>
              <el-button v-else type="success" plain>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储图片的数据
      spuImageList: [],
      // 存储销售属性的数据
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集sku数据
      skuInfo: {
        // 第一类：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：通过数据双向绑定v-model收集
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类：需要自己写代码
        // 默认图片
        skuDefaultImg: '',
        // 收集图片
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        // 收集平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: '',
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: ''
          // }
        ],
        // 收集销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      },
      spu: {},
      // 收集图片数据
      imageList: []
    }
  },
  methods: {
    // 获取SkuForm数据
    async getDate(category1Id, category2Id, spu) {
      this.spu = spu
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // 获取图片数据
      const res = await this.$api.spu.reqSpuImageList(spu.id)
      if (res.code === 200) {
        const list = res.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性的数据
      const res1 = await this.$api.spu.reqSpuSaleAttrList(spu.id)
      if (res1.code === 200) {
        this.spuSaleAttrList = res1.data
      }
      // 获取平台属性的数据
      const res2 = await this.$api.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (res2.code === 200) {
        this.attrInfoList = res2.data
      }
    },
    // table表格复选框按钮的事件
    handleSelectionChange(selection) {
      // 获取到用户选中图片的数据，但是，当前收集的数据当中，缺少isDefault字段
      this.imageList = selection
    },
    // 设为默认图片按钮的事件（排他操作）
    changeDefault(row) {
      // 图片列表数据的isDefault字段变为0
      this.spuImageList.forEach(item => (item.isDefault = 0))
      // 点击的那个图片的isDefault变为1
      row.isDefault = 1
      // 收集默认图片的数据
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮的回调
    cancel() {
      // 自定义事件，让父组件切换场景为0
      this.$emit('changeScenes', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的回调
    async save() {
      // 整理参数
      // 整理平台属性的数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndAttrValueId) {
          const [attrId, valueId] = item.attrIdAndAttrValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 整理销售属性的数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndSaleAttrValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndSaleAttrValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理图片数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发请求
      const res = await this.$api.spu.reqAddSku(skuInfo)
      if (res.code === 200) {
        this.$emit('changeScenes', 0)
        this.$message({ type: 'success', message: '添加SKU成功' })
      }
    }
  }
}
</script>

<style></style>
