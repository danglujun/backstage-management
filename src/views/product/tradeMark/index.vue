<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 10px"
      @click="showDialog"
    >添加</el-button>
    <!--
      表格组件
        data：表格组件将来要展示的数据，只能是数组类型
        border：给表格添加边框
        column属性：
          label：显示标题
          width：对应列的宽度
          align：标题的对齐方式
          prop：对应列内容的字段名
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
        当前第几页、数据总条数、每一页展示条数、连续页码数
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        current-page：当前第几页
        total：数据总条数
        page-size：每一页展示条数
        page-sizes：可以设置的每一页展示条数
        layout：分页器布局
        page-count：按钮的数量，如果是7，连续页码数是5
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-count="7"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />
    <!--
      对话框
        :visible.sync：控制对话框显示与隐藏
    -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!--
        form表单
          model属性：把表单的数据收集到哪个对象身上，将来表单验证也需要这个属性
          Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
        -->
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--
            action：设置图片上传的地址
            :on-success：当图片上传成功会执行一次
            :before-upload：图片上传之前会执行一次
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      // 分页器第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 控制对话框显示与隐藏的属性
      dialogFormVisible: false,
      // 收集品牌信息
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        // 品牌logo的验证规则
        logoUrl: [{ required: true, message: '请选择品牌图片' }]
      }
    }
  },
  mounted() {
    // 组件挂载完毕发请求，获取品牌列表数据
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据的方法
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      // 获取品牌列表数据的接口
      const res = await this.$api.tradeMark.reqTradeMarkList(page, limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.list = res.data.records
      }
    },
    // 当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true
      // 清除数据
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 修改某个品牌
    updateTradeMark(row) {
      // row：当前选中的品牌信息
      this.dialogFormVisible = true
      // 将服务器返回的品牌信息，直接赋值给tmForm进行展示（浅拷贝）
      this.tmForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res) {
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 对话框确定按钮（新增品牌|修改品牌）
    addOrUpdateTradeMark() {
      // 当全部字段验证通过，再去写业务逻辑
      this.$refs.ruleForm.validate(async success => {
        // 如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false
          // 发请求（新增品牌|修改品牌）
          const res = await this.$api.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          if (res.code === 200) {
            // 弹出信息
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            // 修改或添加品牌成功后再次获取品牌列表数据进行展示
            // 新增品牌停留在第一页，修改品牌停留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除品牌
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`你确定删除${row.tmName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 当用户点击确定按钮的时候会触发
          // 向服务器发请求
          const res = await this.$api.tradeMark.reqDeleteTradeMark(row.id)
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 再次获取品牌列表数据
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          // 当用户点击取消按钮的时候会触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
