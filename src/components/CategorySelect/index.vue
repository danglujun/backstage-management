/* eslint-disable vue/require-prop-types */
<template>
  <div>
    <!-- inline：行内表单，一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1Id"
          :disabled="show"
          placeholder="请选择"
          @change="handler1"
        >
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          :disabled="show"
          placeholder="请选择"
          @change="handler2"
        >
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          :disabled="show"
          placeholder="请选择"
          @change="handler3"
        >
          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 一级分类的数据
      list1: [],
      // 二级分类的数据
      list2: [],
      // 三级分类的数据
      list3: [],
      // 收集相应的一级、二级、三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  // 组件挂载完毕，向服务器发请求，获取相应的一级分类数据
  mounted() {
    // 获取一级分类数据的方法
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据的方法
    async getCategory1List() {
      const res = await this.$api.attr.reqCategory1List()
      if (res.code === 200) {
        this.list1 = res.data
      }
    },
    // 一级分类的select事件回调（当一级分类的option发生变化的时候获取相应的二级分类数据）
    async handler1() {
      // 清除数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      const res = await this.$api.attr.reqCategory2List(category1Id)
      if (res.code === 200) {
        this.list2 = res.data
      }
    },
    // 二级分类的select事件回调（当二级分类的option发生变化的时候获取相应的三级分类数据）
    async handler2() {
      // 清除数据
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const res = await this.$api.attr.reqCategory3List(category2Id)
      if (res.code === 200) {
        this.list3 = res.data
      }
    },
    // 三级分类的事件回调
    handler3() {
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style lang="sass" scoped></style>
