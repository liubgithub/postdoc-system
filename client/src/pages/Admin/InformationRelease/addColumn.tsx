// addColumn.tsx 更新后
import { ElButton, ElInput, ElNotification } from "element-plus"
import * as cls from './style.css'

export default defineComponent({
  name: 'addColumn',
  props: {
    onBack: {
      type: Function,
      required: true
    },
    onSave: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const name = ref('')
    const description = ref('')
    
    const handleBack = () => {
      props.onBack && props.onBack()
    }
    
    const handleSave = () => {
      if (!name.value || !description.value) {
        ElNotification({
          title: '提示',
          message: '请填写完整信息',
          type: 'warning'
        })
        return
      }
      
      props.onSave && props.onSave({
        name: name.value,
        description: description.value
      })
    }
    
    return () => (
      <div class={cls.page}>
        <h2>新增专栏</h2>
        <div>
          <div>专栏名称</div>
          <ElInput v-model={name.value} placeholder="请输入专栏名称" />
        </div>
        
        <div>
          <div>编辑内容（专栏介绍）</div>
          <ElInput 
            v-model={description.value}
            type="textarea" 
            placeholder="请输入专栏介绍"
            rows={6}
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