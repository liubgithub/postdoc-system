import { ElButton, ElUpload, ElMessage } from 'element-plus'
import * as cls from '../StationAssessment/styles.css'
import { mubanContent } from './muban'
import { ref } from 'vue'

export default defineComponent({
  name: 'StationProtocol',
  setup() {
    const fileList = ref([])
    const handleDownload = () => {
      // TODO: Replace with real Word generation logic
      const blob = new Blob([mubanContent], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '进站协议模板.doc'
      a.click()
      URL.revokeObjectURL(url)
    }
    const handleUploadSuccess = () => {
      ElMessage.success('上传成功')
    }
    const handleUploadError = () => {
      ElMessage.error('上传失败')
    }
    return () => (
      <div style={{ width: '900px', margin: '0 auto' }}>
        <div class={cls.header} style={{ textAlign: 'left', margin: '30px 0 20px 0' }}>
          <h1>基础信息</h1>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', border: '1px solid #dcdfe6' }}>
          <tbody>
            <tr>
              <td style={{ width: '20%' }}>学号</td>
              <td style={{ width: '30%' }}></td>
              <td style={{ width: '20%' }}>姓名</td>
              <td style={{ width: '30%' }}></td>
            </tr>
            <tr>
              <td>合作导师</td>
              <td></td>
              <td>入站年份</td>
              <td></td>
            </tr>
            <tr>
              <td>所在院系</td>
              <td></td>
              <td>专业名称</td>
              <td></td>
            </tr>
            <tr>
              <td>研究方向</td>
              <td></td>
              <td>手机</td>
              <td></td>
            </tr>
            <tr>
              <td>邮箱</td>
              <td colspan={3}></td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontSize: '2rem', margin: '40px 0 30px 0', textAlign: 'left' }}>
          上传相关成果要求和入站协议
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '60px' }}>
          <ElUpload
            action="#"
            fileList={fileList.value}
            auto-upload={false}
            on-success={handleUploadSuccess}
            on-error={handleUploadError}
            show-file-list={false}
          >
            <ElButton type="primary" style={{ width: '200px', height: '60px', fontSize: '1.5rem' }}>上传</ElButton>
          </ElUpload>
          <ElButton type="default" style={{ width: '200px', height: '60px', fontSize: '1.5rem' }} onClick={handleDownload}>
            下载模板
          </ElButton>
        </div>
      </div>
    )
  }
})
