import { defineComponent } from "vue"

export default defineComponent({
  name: 'Footer',
  setup() {
    return () => (
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: '#fff',
        padding: '40px 0 20px 0',
        marginTop: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 背景网格效果 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.3
        }}></div>
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* 友情链接部分 */}
          <div style={{
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.1)',
              padding: '8px 20px',
              borderRadius: '20px',
              marginBottom: '15px'
            }}>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>友情链接</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <a href="/auth/login" style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '5px 10px',
                borderRadius: '4px',
                transition: 'background-color 0.3s',
                background: 'rgba(255,255,255,0.1)'
              }}
              onMouseenter={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
              onMouseleave={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}>
                博士后信息管理系统
              </a>
              <a href="https://www.hzau.edu.cn/" target="_blank" rel="noopener noreferrer" style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '5px 10px',
                borderRadius: '4px',
                transition: 'background-color 0.3s',
                background: 'rgba(255,255,255,0.1)'
              }}
              onMouseenter={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
              onMouseleave={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}>
                华中农业大学
              </a>
              <a href="https://rsc.hzau.edu.cn/" target="_blank" rel="noopener noreferrer" style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '5px 10px',
                borderRadius: '4px',
                transition: 'background-color 0.3s',
                background: 'rgba(255,255,255,0.1)'
              }}
              onMouseenter={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
              onMouseleave={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}>
                人力资源部
              </a>
            </div>
          </div>

          {/* 联系信息部分 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* 左侧联系信息 */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                <strong>信息管理：</strong>华中农业大学博士后管理办公室
              </div>
              <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                <strong>电子邮箱：</strong>
                <a href="mailto:bsh@mail.hzau.edu.cn" style={{ color: '#fff', textDecoration: 'none' }}>
                  bsh@mail.hzau.edu.cn
                </a>
              </div>
              <div style={{ fontSize: '14px' }}>
                <strong>电话传真：</strong>
                <span style={{ marginLeft: '5px' }}>📞 027-87285113</span>
              </div>
            </div>

            {/* 右侧版权信息 */}
            <div style={{ textAlign: 'right', flex: '1', minWidth: '300px' }}>
              <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                © 2011-2025 湖北省武汉市洪山区狮子山街一号
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
