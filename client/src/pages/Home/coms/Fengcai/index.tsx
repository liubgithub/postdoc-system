import { defineComponent, ref } from "vue"
import { ElCard, ElButton } from "element-plus"

export default defineComponent({
  name: 'Fengcai',
  setup() {

    console.log(import.meta.env.BASE_URL)

    const fengcaiData = [
      {
        id: 1,
        title: "【博士后风采】国家优秀青年科学基金项目入选",
        date: "2024-09-28",
        image: `${import.meta.env.BASE_URL}images/fengcai1.png`,
        description: "胡晓宇博士在生物医学领域取得重要突破，获得国家优秀青年科学基金资助..."
      },
      {
        id: 2,
        title: "【博士后风采】求实创新，励志图强",
        date: "2024-09-28",
        image: `${import.meta.env.BASE_URL}images/fengcai2.png`,
        description: "阿力木博士在材料科学领域的研究成果获得国际认可..."
      },
      {
        id: 3,
        title: "【博士后风采】坚韧不拔，潜心学术",
        date: "2022-04-28",
        image: `${import.meta.env.BASE_URL}images/fengcai3.png`,
        description: "武松博士在农业科学领域的研究为乡村振兴贡献重要力量..."
      },
      {
        id: 3,
        title: "【博士后风采】求真务实，砥砺前行",
        date: "2022-04-28",
        image: `${import.meta.env.BASE_URL}images/fengcai3.png`,
        description: "武松博士在农业科学领域的研究为乡村振兴贡献重要力量..."
      }
    ]

    return () => (
      <div>
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

        </div>

        <div style={{ display: 'flex', gap: '20px' }}>

          {/* 左侧蓝色导航卡片 */}
          <div style={{
            background: 'linear-gradient(135deg,rgb(150, 25, 25) 0%, #920000 50%,rgb(105, 15, 15) 100%)',
            borderRadius: '20px',
            width: '200px',
            height: '450px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 32px rgba(46, 123, 199, 0.3)',
            animation: 'breathe 3s ease-in-out infinite'
          }}
            onMouseenter={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              if (target) {
                target.style.transform = 'translateY(-5px) scale(1.02)';
                target.style.boxShadow = '0 12px 40px rgba(46, 123, 199, 0.4)';
              }
            }}
            onMouseleave={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              if (target) {
                target.style.transform = 'translateY(0) scale(1)';
                target.style.boxShadow = '0 8px 32px rgba(46, 123, 199, 0.3)';
              }
            }}
          >
            {/* 动态背景装饰 - 多个圆形 */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              animation: 'float 4s ease-in-out infinite'
            }}></div>

            <div style={{
              position: 'absolute',
              top: '60%',
              left: '-40px',
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%',
              animation: 'float 3s ease-in-out infinite reverse'
            }}></div>

            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '20px',
              width: '60px',
              height: '60px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>

            {/* 渐变光效 */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              animation: 'shimmer 2s linear infinite'
            }}></div>

            <div style={{
              padding: '10px 20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              position: 'relative',
              zIndex: 2,
              transform: 'translateY(-30px)'
            }}>
              {/* 博士后风采 - 居中显示 */}
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  fontSize: '26px',
                  fontWeight: '600',
                  letterSpacing: '2px',
                  opacity: 0,
                  animation: 'fadeInUp 1s ease-out 0.5s forwards'
                }}>
                  博士后风采
                </h2>
                <div style={{
                  width: '50px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))',
                  margin: '0 auto',
                  borderRadius: '2px',
                  opacity: 0,
                  animation: 'fadeInUp 1s ease-out 0.8s forwards, glow 2s ease-in-out infinite'
                }}></div>
              </div>
            </div>

            {/* CSS 动画样式 */}
            <style>{`
              @keyframes breathe {
                0%, 100% { 
                  transform: scale(1);
                }
                50% { 
                  transform: scale(1.01);
                }
              }
              
              @keyframes float {
                0%, 100% { 
                  transform: translateY(0px) rotate(0deg);
                }
                50% { 
                  transform: translateY(-10px) rotate(180deg);
                }
              }
              
              @keyframes pulse {
                0%, 100% { 
                  opacity: 0.05;
                  transform: scale(1);
                }
                50% { 
                  opacity: 0.15;
                  transform: scale(1.1);
                }
              }
              
              @keyframes shimmer {
                0% { 
                  transform: translateX(-100%);
                }
                100% { 
                  transform: translateX(200px);
                }
              }
              
              @keyframes fadeInUp {
                0% {
                  opacity: 0;
                  transform: translateY(20px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes glow {
                0%, 100% {
                  box-shadow: 0 0 5px rgba(255,255,255,0.5);
                }
                50% {
                  box-shadow: 0 0 15px rgba(255,255,255,0.8);
                }
              }
            `}</style>
          </div>

          {/* 右侧内容区域 */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* 查看更多按钮 - 右上角 */}
            <div style={{
              width: '110px',
              fontSize: '16px',
              color: '#fff',
              lineHeight: '40px',
              fontWeight: 'normal',
              textAlign: 'center',
              background: '#920000',
              position: 'absolute',
              top: '0',
              right: '0',
              cursor: 'pointer',
              zIndex: 10,
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
                  target.style.background = '#920000'
                }
              }}
            >
              查看更多+
            </div>

            {/* 主要展示图片和内容 */}
            <div style={{
              background: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '20px',
              marginTop: '50px',
              height: '300px',
              position: 'relative'
            }}>
              {/* 背景图片 */}
              <img
                src={fengcaiData[0].image}
                alt={fengcaiData[0].title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* 悬浮文字覆盖层 */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3), transparent)',
                padding: '20px',
                color: '#fff'
              }}>
                <p style={{
                  margin: '0',
                  fontSize: '16px',
                  lineHeight: '1.4',
                  textAlign: 'left',
                  fontWeight: '500',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                }}>
                  {fengcaiData[0].title}
                </p>
              </div>
            </div>

            {/* 其他风采列表 */}
            <div style={{ 
              background: '#fff', 
              borderRadius: '8px', 
              padding: '20px',
              height: '120px',
              overflow: 'hidden'
            }}>
              {fengcaiData.slice(1).map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    borderBottom: item.id === fengcaiData.length ? 'none' : '1px solid #f0f0f0',
                    cursor: 'pointer'
                  }}
                  onMouseenter={(e) => {
                    const target = e.currentTarget as HTMLDivElement
                    if (target) {
                      target.style.background = '#f8f9fa'
                      target.style.borderRadius = '6px'
                      target.style.padding = '6px 8px'
                    }
                  }}
                  onMouseleave={(e) => {
                    const target = e.currentTarget as HTMLDivElement
                    if (target) {
                      target.style.background = 'transparent'
                      target.style.borderRadius = '0'
                      target.style.padding = '6px 0'
                    }
                  }}
                >
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: '#1e5f99',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      color: '#333',
                      lineHeight: '1.3',
                      marginBottom: '2px'
                    }}>
                      {item.title.length > 35 ? item.title.substring(0, 35) + '...' : item.title}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '16px',
                    color: '#999',
                    flexShrink: 0
                  }}>
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
})