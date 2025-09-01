// addNews.tsx 更新后
import { ElInput, ElSelect, ElOption, ElButton, ElNotification } from 'element-plus'
import * as cls from './style.css'

export default defineComponent({
  name: 'addNews',
  props: {
    onBack: {
      type: Function,
      required: true
    },
    onSave: {
      type: Function,
      required: true
    },
    editData: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const title = ref('')
    const column = ref('')
    const content = ref('')
    
    const handleBack = () => {
      props.onBack && props.onBack()
    }
    
    const handleSave = () => {
      if (!title.value || !column.value || !content.value) {
        ElNotification({
          title: '提示',
          message: '请填写完整信息',
          type: 'warning'
        })
        return
      }
      
      props.onSave && props.onSave({
        newsName: title.value,
        belongTo: column.value,
        content: content.value
      })
    }
    
    // 如果是编辑模式，初始化数据
    onMounted(() => {
      if (props.editData) {
        title.value = props.editData.newsName
        column.value = props.editData.belongTo
        content.value = props.editData.content
      }
    })
    
    return () => (
      <div class={cls.page}>
        <h2>{props.editData ? '编辑新闻' : '新增新闻'}</h2>
        <div>
          <div>标题</div>
          <ElInput v-model={title.value} placeholder="请输入新闻标题" />
        </div>
        
        <div>
          <div>专栏</div>
          <ElSelect v-model={column.value} placeholder="请选择">
            <ElOption label="通知快讯" value="通知快讯" />
            <ElOption label="招聘信息" value="招聘信息" />
            <ElOption label="学术新闻" value="学术新闻" />
          </ElSelect>
        </div>
        
        <div>
          <div>编辑内容</div>
          <ElInput 
            v-model={content.value}
            type="textarea" 
            rows={10}
            placeholder="请输入新闻内容"
          />
        </div>
        
        <div class={cls.buttonposition}>
          <ElButton type="primary" onClick={handleSave}>保存</ElButton>
          <ElButton onClick={handleBack}>返回</ElButton>
        </div>
      </div>
    )
  },
})