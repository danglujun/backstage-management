<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!category3Id"
          @click="addAttr"
        >添加属性</el-button>
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"> </el-table-column>
          <el-table-column prop="name" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                type="success"
                style="margin-right: 10px"
              >{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <span v-else style="display: block" @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length < 1"
          @click="addOrUpdateAttr"
        >保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      // 控制table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性
      attrInfo: {
        attrName: '', // 属性名
        // 属性名的属性值，属性值可以是多个，所以是数组
        attrValueList: [],
        categoryId: 0, // category3Id
        categoryLevel: 3 // 区分几级id
      }
    }
  },
  methods: {
    // 自定义事件
    getCategoryId({ categoryId, level }) {
      // 区分一二三级分类相应的id，一级父组件进行存储
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类id有了
        this.category3Id = categoryId
        // 发请求获取品牌属性
        this.getAttrList()
      }
    },
    // 获取品牌属性
    // 当用户确定三级分类数据的时候，向服务器发请求获取品牌属性进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const res = await this.$api.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (res.code === 200) {
        this.attrList = res.data
      }
    },
    // 添加属性值按钮的回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        // 属性的id，新增属性的id由服务器的数据库生成，带给服务器的为undefined；修改属性时，在已有属性值的基础上新增属性值时，需要把已有的属性id带上（修改时已将深拷贝赋值给attrInfo）
        attrId: this.attrInfo.id,
        valueName: '', // 属性值
        flag: true // 给每一个属性值添加一个标记flag，用于切换查看与编辑模式，好处是每一个属性值可以控制自己的切换
      })
      // 点击添加属性值按钮时候让input自动聚焦
      this.$nextTick(() => {
        // 获取数组的最后一个元素
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 清除数据，收集三级分类的id
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    // 修改属性
    updateAttr(row) {
      this.isShowTable = false
      // 将选中的属性赋值给attrInfo
      // 由于数据结构中存在对象里面有数组，数组里面有对象，因此需要深拷贝解决
      this.attrInfo = cloneDeep(row)
      // 在修改某个属性，将相应的属性值元素添加上flag这个标记
      // item.flag=false，这样写也可以给属性值添加flag标记，但是会发现视图不会跟着变化，因为flag不是响应式数据，Vue无法探测普通的新增property，$set()添加的是响应式数据
      this.attrInfo.attrValueList.forEach(item => this.$set(item, 'flag', false))
    },
    // 失去焦点事件--切换为查看模式，展示span
    toLook(row) {
      // row：用户添加的最新属性值
      // 如果属性值为空，不能作为最新的属性值，需要给用户提示
      if (row.valueName.trim() === '') {
        this.$message('请输入一个属性值')
        return
      }
      // 新增的属性值不能与已有的属性值重复
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        // 需要将row从数组里面判断的时候去除，row为最新新增的属性值（数组的最后一项元素）
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepeat) return
      row.flag = false
    },
    // 点击span的回调--变为编辑模式
    toEdit(row, index) {
      row.flag = true
      // 注意：点击span，切换为input编辑模式的时候，对于浏览器，页面重绘和重排需要耗费一定时间，不可能一点击span立马获取到input；$nextTick：当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        // 获取input节点，实现自动聚焦
        this.$refs[index].focus()
      })
    },
    // 气泡确认框确定按钮的回调
    deleteAttrValue(index) {
      // 当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮：进行添加|修改属性
    async addOrUpdateAttr() {
      // 整理参数
      // 1.如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      // 2.提交给服务器的数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          delete item.flag
          return true
        }
      })
      try {
        // 发请求
        await this.$api.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        // 提示消息
        this.$message({ type: 'success', message: '保存成功' })
        // 保存成功后再次发请求获取商品属性进行展示
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
    }
  }
}
</script>

<style lang="sass" scoped></style>
