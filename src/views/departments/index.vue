<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <treeTool :tree-data="company" :is-root="true" @add-departments="addDepartments" />
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{data}">
          <treeTool :tree-data="data" :is-root="false" @handleEditDepts="handleEditDepts" @add-departments="addDepartments" @getDepartments="getDepartments" />
        </template>
      </el-tree>
    </div>
    <!-- 属性value 方法input -->
    <!-- 双向 属性名不变 -->
    <!-- 提供给子组件一个自定义事件 用于修改当前字段 -->
    <!-- 事件名称：update ：属性名 -->
    <addDept ref="addDept" :current-tree-data="currentTreeData" :is-show-add-depts.sync="isShowAddDepts" @getDepartments="getDepartments" />
  </div>
</template>

<script>
import treeTool from '@/views/departments/components/tree-tool.vue'
import addDept from '@/views/departments/components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { transListToTree } from '@/utils'
export default {
  components: {
    treeTool,
    addDept
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      isShowAddDepts: false,
      currentTreeData: {},
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      try {
        const res = await getDepartments()
        // console.log(res)
        this.company = {
          name: res.companyName,
          manage: res.companyManage || '管理员',
          id: ''
        }
        this.departs = transListToTree(res.depts, '')
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    addDepartments(node) {
      this.isShowAddDepts = true
      this.currentTreeData = node
    },
    handleEditDepts(node) {
      this.isShowAddDepts = true
      this.currentTreeData = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped lang="scss">
.app-container{
  width: 780px;
  // display:flex;
  // justify-content: center;
  margin:10px auto;
}
.tree-card {
  // padding: 30px  140px;
  width: 100%;
  font-size:14px;
}
</style>
