import { defineComponent, ref } from "vue"
import { ElCard, ElButton, ElTooltip } from "element-plus"

export default defineComponent({
  name: 'CommonProblem',
  setup() {
    const commonProblems = [
      {
        id: 1,
        question: "中国博士后科学基金资助工作常见问题解答(2021)"
      },
      {
        id: 2,
        question: "进站常见问答"
      },
      {
        id: 3,
        question: "在站管理常见问答"
      },
      {
        id: 4,
        question: "出站相关问答"
      },
      {
        id: 5,
        question: "基金及资助项目申请相关问答"
      }
    ]

    return () => (
      <div style={{ width: '100%' }}>
        {/* 标题栏 - 与招聘信息样式保持一致 */}
        <div style={{ 
          position: 'relative',
          fontSize: '30px',
          color: '#313131',
          fontWeight: 'bold',
          lineHeight: '80px',
          marginBottom: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            常见问题
            {/* 蓝色装饰线 */}
            <div style={{
              content: '',
              display: 'block',
              width: '30px',
              height: '2px',
              background: '#004ea1',
              position: 'absolute',
              left: '0',
              bottom: '2px'
            }}></div>
            {/* 橙色装饰线 */}
            <div style={{
              content: '',
              display: 'block',
              width: '12px',
              height: '2px',
              background: '#f19149',
              position: 'absolute',
              left: '36px',
              bottom: '1px'
            }}></div>
          </div>
          <div style={{
            width: '110px',
            fontSize: '16px',
            color: '#fff',
            lineHeight: '40px',
            fontWeight: 'normal',
            textAlign: 'center',
            background: '#004ea1',
            position: 'relative',
            marginTop: '40px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
            onMouseenter={(e) => {
              const target = e.currentTarget as HTMLDivElement
              if (target) {
                target.style.background = '#FF9E21'
              }
            }}
            onMouseleave={(e) => {
              const target = e.currentTarget as HTMLDivElement
              if (target) {
                target.style.background = '#004ea1'
              }
            }}
          >
            查看更多+
          </div>
        </div>

        {/* 内容区域 */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '8px', 
          padding: '30px 25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          {commonProblems.map((item, index) => (
            <ElTooltip
              key={item.id}
              content={item.question}
              placement="bottom-end"
              effect="dark"
              showAfter={300}
              hideAfter={100}
              disabled={item.question.length <= 25}
            >
              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '18px 0',
                  borderBottom: index === commonProblems.length - 1 ? 'none' : '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseenter={(e) => {
                  const target = e.currentTarget as HTMLDivElement
                  if (target) {
                    target.style.background = '#f8f9fa'
                    target.style.borderRadius = '6px'
                    target.style.padding = '18px 12px'
                  }
                }}
                onMouseleave={(e) => {
                  const target = e.currentTarget as HTMLDivElement
                  if (target) {
                    target.style.background = 'transparent'
                    target.style.borderRadius = '0'
                    target.style.padding = '18px 0'
                  }
                }}
              >
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  background: '#1e5f99', 
                  borderRadius: '50%',
                  flexShrink: 0
                }}></div>
                <div style={{ 
                  fontSize: '16px', 
                  color: '#333',
                  lineHeight: '1.6',
                  flex: 1,
                  fontWeight: '400',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '500px'
                }}>
                  {item.question}
                </div>
              </div>
            </ElTooltip>
          ))}
        </div>
      </div>
    )
  }
})