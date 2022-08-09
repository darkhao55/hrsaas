<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list.sync="fileList"
      :limit="1"
      :class="{completed:isCompleted}"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog></div>

</template>
<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDRggPr2yd18yYqrc7LIzQZR2MQDiwub19',
  SecretKey: 'tWsxlIXVCdmeFaeQv86nDLDo8Bysa2FD'
})
// 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  name: 'ImageUpload',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      showPercent: false,
      fileList: [
      ],
      percent: 0
    }
  },
  computed: {
    isCompleted() {
      return this.fileList.length === 1
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    changeFile(file, fileList) {
    //   console.log(file, fileList)
      this.fileList = fileList
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.id
      this.showPercent = true
      return true
    },
    upload({ file }) {
      if (!file) return
      cos.putObject({
        Bucket: '13698012531-1313213569', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          this.percent = percent * 100
          console.log(percent)
        }
      }, (err, data) => {
        if (err) {
          return this.$message.error(err?.message || '上传出错')
        }
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            item.upload = true
          }
        })
        setTimeout(() => {
          this.showPercent = false // 隐藏进度条
          this.percent = 0 // 进度归0
        }, 2000)
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.completed{
    ::v-deep .el-upload--picture-card{
        display:none;
    }
}
</style>
