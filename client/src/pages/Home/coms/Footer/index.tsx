import { defineComponent } from "vue"

export default defineComponent({
  name: 'Footer',
  setup() {
    return () => (
      <div style={{
        background: 'linear-gradient(135deg,rgb(133, 25, 25) 0%, #920000 100%)',
        color: '#fff',
        padding: '40px 0 20px 0',
        marginTop: '60px',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginBottom: 'calc(-20px)'
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
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '30px',
              padding: '18px 35px',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%'
            }}>
              <span style={{ fontSize: '20px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap' }}>友情链接:</span>
              <a href="`${window.location.origin}/auth/login`" target="_blank" rel="noopener noreferrer" style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '18px',
                padding: '0',
                transition: 'color 0.3s ease'
              }}
              onMouseenter={(e) => (e.target as HTMLElement).style.color = '#FFD700'}
              onMouseleave={(e) => (e.target as HTMLElement).style.color = '#fff'}>
                + 博士后信息管理系统
              </a>
              <a href="https://www.hzau.edu.cn/" target="_blank" rel="noopener noreferrer" style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '18px',
                padding: '0',
                transition: 'color 0.3s ease'
              }}
              onMouseenter={(e) => (e.target as HTMLElement).style.color = '#FFD700'}
              onMouseleave={(e) => (e.target as HTMLElement).style.color = '#fff'}>
                + 华中农业大学
              </a>
              <a href="https://rsc.hzau.edu.cn/" target="_blank" rel="noopener noreferrer" style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '18px',
                padding: '0',
                transition: 'color 0.3s ease'
              }}
              onMouseenter={(e) => (e.target as HTMLElement).style.color = '#FFD700'}
              onMouseleave={(e) => (e.target as HTMLElement).style.color = '#fff'}>
                + 人力资源部
              </a>
            </div>
          </div>

          {/* 联系信息部分 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '30px'
          }}>
            {/* 左侧联系信息 */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div style={{ marginBottom: '12px', fontSize: '18px', lineHeight: '1.6' }}>
                <span style={{ color: '#87CEEB' }}>信息管理：</span>华中农业大学博士后管理办公室
              </div>
              <div style={{ marginBottom: '12px', fontSize: '18px', lineHeight: '1.6' }}>
                <span style={{ color: '#87CEEB' }}>电子邮箱：</span>
                <a href="mailto:bsh@mail.hzau.edu.cn" style={{ 
                  color: '#fff', 
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseenter={(e) => (e.target as HTMLElement).style.color = '#FFD700'}
                onMouseleave={(e) => (e.target as HTMLElement).style.color = '#fff'}>
                  bsh@mail.hzau.edu.cn
                </a>
              </div>
            </div>

            {/* 中间电话信息 */}
            <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px', color: '#87CEEB' }}>
                电话传真：
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                <span style={{ color: '#87CEEB', fontSize: '24px' }}>📞</span>
                <span style={{ color: '#fff' }}>027-87285113</span>
              </div>
            </div>

            {/* 右侧二维码区域 - 暂时留空 */}
            <div style={{ 
              flex: '0 0 auto', 
              textAlign: 'center',
              minWidth: '160px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.1)',
                border: '2px dashed rgba(255,255,255,0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#87CEEB', fontSize: '12px' }}>二维码</span>
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#87CEEB',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                lineHeight: '1.4'
              }}>
                扫一扫关注我们
              </div>
            </div>
          </div>

          {/* 版权信息 */}
          <div style={{
            textAlign: 'right',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '14px', color: '#fff' }}>
              © 2011-2025 湖北省武汉市洪山区狮子山街一号
            </div>
          </div>
        </div>
      </div>
    )
  }
})
