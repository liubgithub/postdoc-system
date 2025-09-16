import { defineComponent, ref } from "vue"
import { ElCard, ElButton } from "element-plus"

export default defineComponent({
  name: 'Fengcai',
  setup() {

    const fengcaiData = [
      {
        id: 1,
        title: "【博士后风采】国家优秀青年科学基金项目入选者——胡晓宇",
        date: "2024-09-28",
        image: `${import.meta.env.BASE_URL}images/fengcai1.jpg`,
        description: "胡晓宇博士在生物医学领域取得重要突破，获得国家优秀青年科学基金资助..."
      },
      {
        id: 2,
        title: "【博士后风采】国家优秀青年科学基金项目入选者——阿力木",
        date: "2024-09-28",
        image: `${import.meta.env.BASE_URL}images/fengcai2.jpg`,
        description: "阿力木博士在材料科学领域的研究成果获得国际认可..."
      },
      {
        id: 3,
        title: "【博士后风采】武松——脚踏实地，坚韧不拔",
        date: "2022-04-28",
        image: `${import.meta.env.BASE_URL}images/fengcai3.jpg`,
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
            background: 'linear-gradient(135deg, #1e5f99 0%, #2b7bc7 100%)',
            borderRadius: '20px',
            width: '280px',
            height: '420px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {/* 背景装饰 */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}></div>

            <div style={{ padding: '40px 30px' }}>
              {/* 博士后咨询 */}
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{
                  margin: '0 0 10px 0',
                  fontSize: '24px',
                  fontWeight: '600',
                  letterSpacing: '1px'
                }}>
                  博士后咨询
                </h2>
                <div style={{ width: '40px', height: '3px', background: '#fff', marginBottom: '20px' }}></div>
              </div>

              {/* 博士后招聘按钮 */}
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                color: '#1e5f99',
                padding: '12px 24px',
                borderRadius: '25px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '40px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                博士后招聘
              </div>

              {/* 博士后风采 */}
              <div>
                <h3 style={{
                  margin: '0',
                  fontSize: '20px',
                  fontWeight: '600',
                  letterSpacing: '1px'
                }}>
                  博士后风采
                </h3>
              </div>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div style={{ flex: 1 }}>
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
              cursor: 'pointer'
            }}>
              查看更多+
            </div>
            {/* 主要展示图片和内容 */}
            <div style={{
              background: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <img
                src={fengcaiData[0].image}
                alt={fengcaiData[0].title}
                style={{
                  width: '100%',
                  height: '240px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '20px' }}>
                <p style={{
                  margin: '0',
                  fontSize: '16px',
                  color: '#333',
                  lineHeight: '1.6',
                  textAlign: 'center'
                }}>
                  {fengcaiData[0].title}
                </p>
              </div>
            </div>

            {/* 其他风采列表 */}
            <div style={{ background: '#fff', borderRadius: '8px', padding: '20px' }}>
              {fengcaiData.slice(1).map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#1e5f99',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '15px',
                      color: '#333',
                      lineHeight: '1.4',
                      marginBottom: '4px'
                    }}>
                      {item.title.length > 40 ? item.title.substring(0, 40) + '...' : item.title}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px',
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