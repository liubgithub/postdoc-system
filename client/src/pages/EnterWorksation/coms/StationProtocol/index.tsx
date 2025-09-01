import { ElButton, ElUpload, ElMessage, ElForm, ElFormItem, ElInput } from 'element-plus'
import * as cls from '../StationAssessment/styles.css'
import { mubanContent } from './muban'
import { muban2Content } from './muban2'
import { ref, reactive } from 'vue'
import fetch from '@/api/index'

export default defineComponent({
  name: 'StationProtocol',
  setup() {
    const fileList = ref([])
    const form = ref({
      stuId: '',
      name: '',
      cotutor: '',
      entryYear: '',
      college: '',
      subject: '',
      phone: '',
      email: ''
    })
    const handleSubmit = async() =>{
      try{
        const res = await fetch.raw.POST('/enterProtocol/', { body: form.value })
        if(res.response.ok){
          ElMessage.success('提交成功')
        }
      }catch(error){
        console.log(error)
      }
    }
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
    onMounted(async () => {
      try {
        const res = await fetch.raw.GET('/enterProtocol/')
        if (res.response.ok && res.data && typeof res.data === 'object') {
          // 只有当接口返回有效数据时才更新表单
          // 使用原始表单作为默认值，然后用接口数据覆盖
          form.value = {
            stuId: res.data.stuId || '',
            name: res.data.name || '',
            cotutor: res.data.cotutor || '',
            entryYear: res.data.entryYear || '',
            college: res.data.college || '',
            subject: res.data.subject || '',
            phone: res.data.phone || '',
            email: res.data.email || ''
          }
        }
        // 如果没有数据或接口调用失败，保持原始的空值表单
      } catch (error) {
        console.error('获取进站协议数据失败:', error)
        // 保持原始的空值表单，不进行任何赋值操作
      }
    })
    return () => (
      <div class={cls.formContainer} style={{ width: '80vw', margin: '0 auto' }}>
        <div class={cls.header} style={{ textAlign: 'left', margin: '30px 0 20px 0' }}>
          <h1>基础信息</h1>
        </div>
        <ElForm model={form.value} labelWidth="100px" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <ElFormItem label="学号" prop="stuId" style={{ flex: 1 }}>
              <ElInput v-model={form.value.stuId} placeholder="请输入学号" />
            </ElFormItem>
            <ElFormItem label="姓名" prop="name" style={{ flex: 1 }}>
              <ElInput v-model={form.value.name} placeholder="请输入姓名" />
            </ElFormItem>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <ElFormItem label="合作导师" prop="cotutor" style={{ flex: 1 }}>
              <ElInput v-model={form.value.cotutor} placeholder="请输入合作导师" />
            </ElFormItem>
            <ElFormItem label="入站年份" prop="entryYear" style={{ flex: 1 }}>
              <ElInput v-model={form.value.entryYear} placeholder="请输入入站年份" />
            </ElFormItem>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <ElFormItem label="所在院系" prop="college" style={{ flex: 1 }}>
              <ElInput v-model={form.value.college} placeholder="请输入所在院系" />
            </ElFormItem>
            <ElFormItem label="研究方向" prop="subject" style={{ flex: 1 }}>
              <ElInput v-model={form.value.subject} placeholder="请输入研究方向" />
            </ElFormItem>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <ElFormItem label="手机" prop="phone" style={{ flex: 1 }}>
              <ElInput v-model={form.value.phone} placeholder="请输入手机号" />
            </ElFormItem>
            <ElFormItem label="邮箱" prop="email" style={{ flex: 1 }}>
              <ElInput v-model={form.value.email} placeholder="请输入邮箱" />
            </ElFormItem>
          </div>
          <div style={{ marginBottom: '20px',textAlign: 'center' }}>
            <ElButton type='primary' onClick={handleSubmit}>提交信息</ElButton>
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
