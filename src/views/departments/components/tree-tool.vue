<template>
  <el-row type="flex" justify="space-between" align="middle" style="width:100%;">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="6">
      <el-row type="flex" justify="end">
        <el-col><span>{{ treeData.manager }}</span></el-col>
        <el-col>
          <el-dropdown @command="clickItem">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTool',
  props: {
    treeData: {
      type: Object,
      default: () => ({})
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async clickItem(type) {
      if (type === 'add') {
        // console.log('add')
        this.$emit('add-departments', this.treeData)
      } else if (type === 'edit') {
        this.$emit('handleEditDepts', this.treeData)
      } else {
        await this.$confirm('确认退出')
        // console.log('del')
        await delDepartments(this.treeData.id)
        this.$message.success('删除成功')
        this.$emit('getDepartments')
      }
    }
  }
}
</script>

<style>

</style>
