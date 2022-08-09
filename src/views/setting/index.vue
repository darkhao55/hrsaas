<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog=true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPermission(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form disabled label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
      <!-- 弹层结构 -->
      <el-dialog :title="isAdd" :visible="showDialog" @close="close">
        <el-form ref="role" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-row type="flex" justify="center">
            <el-button size="small" @click="close">取消</el-button>
            <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          </el-row>
        </template>
      </el-dialog>
    </div>
    <el-dialog title="分配权限" :visible="showPermissionDialog" @close="closePermission">
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <template #footer>
        <el-button size="mini" @click="closePermission">取消</el-button>
        <el-button size="mini" type="primary" @click="btnOkPermission">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { transListToTree } from '@/utils'
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0 // 记录总数
      },
      formData: {},
      showDialog: false,
      showPermissionDialog: false,
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null, // 用来记录分配角色的id
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '', // 部门名称
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isAdd() {
      return this.roleForm.id ? '编辑角色' : '增加角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async btnOkPermission() {
      const selectCheck = await this.$refs.permTree.getCheckedKeys()
      await assignPerm({ id: this.roleId, permIds: selectCheck })
      this.$message.success('分配权限成功')
      this.closePermission()
    },
    async assignPermission(id) {
      this.permData = transListToTree(await getPermissionList(), '0') // 转化list到树形数据
      this.roleId = id
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds
      this.showPermissionDialog = true
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    changePage(page) {
      this.page.page = page
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
    },
    async del(id) {
      await this.$confirm('确认删除?')
      const len = this.list.length
      await deleteRole(id)
      this.$message.success('删除成功')
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      await this.getRoleList()
    },
    async edit(id) {
      this.showDialog = true
      this.roleForm = await getRoleDetail(id)
    },
    close() {
      this.showDialog = false
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
    },
    closePermission() {
      this.showPermissionDialog = false
      this.selectCheck = []
    },
    async btnOk() {
      this.$refs.role.validate()
      if (this.roleForm.id) {
        await updateRole(this.roleForm)
      } else {
        await addRole(this.roleForm)
      }
      // 重新拉取数据
      this.getRoleList()
      this.$message.success('操作成功')
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
