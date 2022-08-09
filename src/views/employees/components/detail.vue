<template>
  <el-card class="container">
    <el-tabs>
      <el-tab-pane label="登录账户设置">
        <el-form ref="formRef" :model="formData" :rules="rules" class="form" label-width="120px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="formData.username" style="width:40%;" />
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input v-model="formData.password2" style="width:40%;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情">
        <!-- 放置个人详情 -->
        <component :is="UserInfo" />
        <!-- <user-info /> -->
      </el-tab-pane>
      <el-tab-pane label="岗位信息">
        <component :is="JobInfo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info.vue'
import JobInfo from '@/views/employees/components/job-info.vue'
export default {
  components: { UserInfo, JobInfo },
  data() {
    return {
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      formData: {
        // 专门存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id)
      this.formData = res
    },
    async update() {
      await this.$refs.formRef.validate()
      try {
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2
        })
        this.$message.success('修改用户成功')
      } catch (e) {
        this.$message.error('更新失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
.form{
  margin-left: 20px;
  padding-top: 20px;
}
}
</style>
