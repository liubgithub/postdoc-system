import { ElButton, ElUpload, ElMessage, ElForm, ElFormItem, ElInput } from 'element-plus'
import * as cls from '../StationAssessment/styles.css'
import { mubanContent } from './muban'
import { muban2Content } from './muban2'
import { ref, reactive } from 'vue'

export default defineComponent({
  name: 'StationProtocol',
  setup() {
    const fileList = ref([])
    const form = reactive({
      stuId: '',
      name: '',
      cotutor: '',
      entryYear: '',
      college: '',
      subject: '',
      research: '',
      phone: '',
      email: ''
    })
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
    const handleDownload2 = () => {
      // TODO: Replace with real Word generation logic
      const blob = new Blob([muban2Content], { type: 'application/msword' })
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
      <div class={cls.formContainer} style={{ width: '80vw', margin: '0 auto' }}>
        <div class={cls.header} style={{ textAlign: 'left', margin: '30px 0 20px 0' }}>
          <h1>基础信息</h1>
        </div>
        <ElForm model={form} labelWidth="100px" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <ElFormItem label="学号" prop="stuId" style={{ flex: 1 }}>
              <ElInput v-model={form.stuId} placeholder="请输入学号" />
            </ElFormItem>
            <ElFormItem label="姓名" prop="name" style={{ flex: 1 }}>
              <ElInput v-model={form.name} placeholder="请输入姓名" />
            </ElFormItem>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <ElFormItem label="合作导师" prop="cotutor" style={{ flex: 1 }}>
              <ElInput v-model={form.cotutor} placeholder="请输入合作导师" />
            </ElFormItem>
            <ElFormItem label="入站年份" prop="entryYear" style={{ flex: 1 }}>
              <ElInput v-model={form.entryYear} placeholder="请输入入站年份" />
            </ElFormItem>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <ElFormItem label="所在院系" prop="college" style={{ flex: 1 }}>
              <ElInput v-model={form.college} placeholder="请输入所在院系" />
            </ElFormItem>
            <ElFormItem label="研究方向" prop="research" style={{ flex: 1 }}>
              <ElInput v-model={form.research} placeholder="请输入研究方向" />
            </ElFormItem>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <ElFormItem label="手机" prop="phone" style={{ flex: 1 }}>
              <ElInput v-model={form.phone} placeholder="请输入手机号" />
            </ElFormItem>
            <ElFormItem label="邮箱" prop="email" style={{ width: '100%' }}>
              <ElInput v-model={form.email} placeholder="请输入邮箱" />
            </ElFormItem>
          </div>
        </ElForm>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.5rem', textAlign: 'left' }}>
            上传相关成果要求和入站协议
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <ElUpload
              action="#"
              fileList={fileList.value}
              auto-upload={false}
              on-success={handleUploadSuccess}
              on-error={handleUploadError}
              show-file-list={false}
            >
              <ElButton type="primary" style={{ width: '130px', height: '40px', fontSize: '1.2rem' }}>上传</ElButton>
            </ElUpload>
            <ElButton type="default" style={{ width: '440px', height: '40px', fontSize: '1.2rem' }} onClick={handleDownload}>
              下载模板（合作导师为洪山实验室固定研究人员）
            </ElButton>
            <ElButton type="default" style={{ width: '440px', height: '40px', fontSize: '1.2rem' }} onClick={handleDownload2}>
              下载模板（合作导师非洪山实验室固定研究人员）
            </ElButton>
          </div>
        </div>
      </div>
    )
  }
})
