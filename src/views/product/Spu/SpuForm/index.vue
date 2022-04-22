<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tm in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          v-model="spu.description"
          type="textarea"
          placeholder="SPU描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdAndAttrName"
          :placeholder="`还有${unSelectSaleAttr.length}个未选择`"
          style="margin: 0px 10px 10px 0px"
        >
          <el-option
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px"> </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
              >添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: '',
        // 收集spu图片的信息
        spuImageList: [
          {
            id: 0,
            imgName: '',
            imgUrl: '',
            spuId: 0
          }
        ],
        // spu名称
        spuName: '',
        // 收集平台属性与属性值
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: '',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: '',
                saleAttrName: '',
                saleAttrValueName: '',
                spuId: 0
              }
            ]
          }
        ],
        // 品牌id
        tmId: ''
      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储spu图片信息
      spuImageList: [],
      // 存储销售属性的信息
      saleAttrList: [],
      // 收集未选择的销售属性的id
      attrIdAndAttrName: ''
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个：尺寸、颜色、版本--saleAttrList
      // 当前spu拥有的属于自己的销售属性spu.spuSaleAttrList
      // 数组的过滤方法，可以从已有的数组中过滤出用户需要的元素，并返回一个新数组
      return this.saleAttrList.filter(item => {
        // every方法，会返回一个布尔值（true|false）
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
    }
  },
  methods: {
    // 照片墙删除某个图片的时候触发
    handleRemove(file, fileList) {
      // file：删除的那张图片的信息；fileList：删除某张图片后剩余的图片的信息
      // 收集照片墙图片的数据
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给dialogImageUrl
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    // 初始化spuForm数据
    async initSpuDate(spu) {
      // 获取spu信息
      const spuRes = await this.$api.spu.reqSpu(spu.id)
      if (spuRes.code === 200) {
        this.spu = spuRes.data
      }
      // 获取品牌信息
      const tradeMarkRes = await this.$api.spu.reqTradeMarkList()
      if (tradeMarkRes.code === 200) {
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取spu图片
      const spuImageRes = await this.$api.spu.reqSpuImageList(spu.id)
      if (spuImageRes.code === 200) {
        // 由于照片墙显示图片的数据需要数组，数组里面的元素需要有name和url字段，需要把服务器返回的数据进行修改
        const listArr = spuImageRes.data
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
      // 获取商品销售属性
      const saleAttrRes = await this.$api.spu.reqBaseSaleAttrList()
      if (saleAttrRes.code === 200) {
        this.saleAttrList = saleAttrRes.data
      }
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response, file, fileList) {
      // 收集图片的信息
      this.spuImageList = fileList
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 把已经收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spu对象的spuSaleAttrList属性里面添加新的销售属性
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      // 添加新的属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清除数据
      this.attrIdAndAttrName = ''
    },
    // 添加属性值的按钮的回调
    addSaleAttrValue(row) {
      // 挂载在销售属性身上的响应式数据inputVisible，控制input与button切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue字段收集新增的销售属性
      this.$set(row, 'inputValue', '')
    },
    // input失去焦点的事件
    handleInputConfirm(row) {
      // 解构出销售属性当中收集的数据
      const { baseSaleAttrId, inputValue } = row
      // 新增的销售属性值不能为空
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      // 新增的属性值不能重复
      const res = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
      if (res) return
      // 新增的销售属性值
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数：需要整理照片墙的数据
      // 携带参数：对于图片，需要携带imgName与imgUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.url || (item.response && item.response.data)
        }
      })
      // 发请求
      const res = await this.$api.spu.reqAddOrUpdateSpu(this.spu)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '保存spu成功' })
        // 通知父组件回到场景0
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加SPU按钮发请求的函数
    async addSpuData(category3Id) {
      // 添加spu的时候收集三级分类的id
      this.spu.category3Id = category3Id
      // 获取品牌信息
      const tradeMarkRes = await this.$api.spu.reqTradeMarkList()
      if (tradeMarkRes.code === 200) {
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取商品销售属性
      const saleAttrRes = await this.$api.spu.reqBaseSaleAttrList()
      if (saleAttrRes.code === 200) {
        this.saleAttrList = saleAttrRes.data
      }
    },
    // 取消按钮
    cancel() {
      // 通知父组件切换场景为0
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清除数据
      // Object.assign：es6中新增的方法，可以合并对象;组件实例this._data：可以操作data中响应式数据；this.$options：可以获取配置对象，配置对象中的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
