<template>
  <el-dialog :title="`${showTitle}部门`" :visible="isShowAddDepts" @close="close">
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- <el-input v-model="formData.manager" /> -->
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="small" @click="submit">提交</el-button>
        <el-button size="small" @click="close">重置</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    isShowAddDepts: {
      type: Boolean,
      default: false
    },
    currentTreeData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let currentChildren = null
      if (this.formData.id) {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentTreeData.pid && item.id !== this.currentTreeData.id
        })
      } else {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentTreeData.id
        })
      }
      const isRepeat = currentChildren.some(item => {
        return item.name === value
      })
      if (isRepeat) {
        return Promise.reject('部门名称重复了')
      }
    }
    const checkCode = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = null
      if (this.formData.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.currentTreeData.id)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }
      if (isRepeat) {
        return Promise.reject('部门编码重复了')
      }
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑' : '添加'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async submit() {
      this.$refs.form.validate()
      if (this.formData.id) {
        await updateDepartments(this.formData)
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.currentTreeData.id
        })
      }
      this.$message.success('添加成功')
      this.$emit('getDepartments')
      this.close()
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    close() {
      this.$refs.form.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$emit('update:isShowAddDepts', false)
    }
  }
}
</script>

<style>

</style>
