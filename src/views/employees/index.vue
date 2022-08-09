<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #before>
          <span>共50条记录</span>
        </template>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="small" type="primary" @click="AddEmployee">新增员工</el-button>
        </template>
      </PageTools>
      <el-card>
        <el-table :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像">
            <template v-slot="{ row }">
              <el-row type="flex" justify="center">
                <el-avatar style="width:60px;height:60px;" :src="row.staffPhoto" @click.native="showQrCode(row.staffPhoto)">
                  <img src="@/assets/common/bigUserHeader.png" alt="">
                </el-avatar>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column :formatter="formatter" prop="formOfEmployment" label="聘用形式" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button :disabled="checkPermission('DELETE_USER')" type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :current-page="page.page" :page-size="page.size" :total="page.total" @current-change="changePage" />
        </el-row>
      </el-card>
    </div>
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <add-employee :is-show-addemp-dialog.sync="isShowAddempDialog" />
    <AssignRole ref="roleRef" :curret-id="curretId" :show-role-dialog.sync="showRoleDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { mixins } from '@/utils/mixins'
import { formatDate } from '@/filters'
import qrCode from 'qrcode'
// 表头对应关系
const headers = {
  '姓名': 'username',
  '手机号': 'mobile',
  '入职日期': 'timeOfEntry',
  '聘用形式': 'formOfEmployment',
  '转正日期': 'correctionTime',
  '工号': 'workNumber',
  '部门': 'departmentName'
}
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  mixins: [mixins],
  data() {
    return {
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      isShowAddempDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      curretId: ''
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async editRole(id) {
      this.curretId = id
      await this.$refs.roleRef.getCurrentDetailById(id)
      this.showRoleDialog = true
    },
    showQrCode(url) {
      this.showCodeDialog = true
      this.$nextTick(() => {
        qrCode.toCanvas(this.$refs.myCanvas, url)
      })
    },
    async exportToExcel() {
      const { export_json_to_excel } = await import(/* webpackChunkName:'Export2Excel'*/'@/utils/Export2Excel')
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const resData = this.formatterData(rows, headers)
      console.log(resData)
      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        data: resData,
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    formatterData(rows, headers) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // return item[headers[key]]
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return EmployeeEnum.hireType.find(child => +child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
    async getEmployeeList() {
      const { total, rows } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
      // console.log(rows)
    },
    changePage(page) {
      // console.log(page)
      this.page.page = page
      this.getEmployeeList()
    },
    formatter(row, column, cellValue) {
      console.log(cellValue)
      const currentData = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    },
    async del(id) {
      try {
        await this.$confirm('确认删除吗?')
        await delEmployee(id)
        this.$message.success('删除成功')
        await this.getEmployeeList()
      } catch (e) {
        console.log(e)
      }
    },
    AddEmployee() {
      this.isShowAddempDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.text{
  font-size: 12px;
}
</style>
