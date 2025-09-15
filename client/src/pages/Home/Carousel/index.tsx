
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { ElCarousel, ElCarouselItem, ElImage } from 'element-plus'
import * as cls from './styles.css'

// 轮播图项接口
interface CarouselItem {
  id: number
  imageUrl: string
  title?: string
  description?: string
  link?: string
}

export default defineComponent({
  name: "AppCarousel",
  props: {
    // 轮播图数据
    items: {
      type: Array as () => CarouselItem[],
      default: () => []
    },
    // 自动播放间隔(毫秒)
    interval: {
      type: Number,
      default: 5000
    },
    // 轮播图高度
    height: {
      type: String,
      default: '400px'
    },
    // 指示器位置
    indicatorPosition: {
      type: String as () => 'none' | 'outside',
      default: 'outside'
    },
    // 箭头显示时机
    arrow: {
      type: String as () => 'always' | 'hover' | 'never',
      default: 'hover'
    },
    // 动画类型
    type: {
      type: String as () => 'card' | '',
      default: ''
    },
    // 是否循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      default: true
    },
    // 是否显示标题
    showTitle: {
      type: Boolean,
      default: true
    },
    // 是否显示描述
    showDescription: {
      type: Boolean,
      default: true
    },
    // 是否显示指示器
    showIndicators: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const carouselRef = ref<InstanceType<typeof ElCarousel> | null>(null)
    const currentIndex = ref(0)
    let autoplayTimer: number | null = null

    // 手动切换幻灯片
    const setActiveItem = (index: number) => {
      if (carouselRef.value) {
        carouselRef.value.setActiveItem(index)
      }
    }

    // 上一张
    const prev = () => {
      if (carouselRef.value) {
        carouselRef.value.prev()
      }
    }

    // 下一张
    const next = () => {
      if (carouselRef.value) {
        carouselRef.value.next()
      }
    }

    // 幻灯片变化时的回调
    const handleChange = (current: number, prev: number) => {
      currentIndex.value = current
    }

    // 自定义自动播放逻辑
    const startAutoplay = () => {
      if (props.autoplay && props.items.length > 1) {
        autoplayTimer = window.setInterval(() => {
          next()
        }, props.interval)
      }
    }

    // 停止自动播放
    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer)
        autoplayTimer = null
      }
    }

    onMounted(() => {
      startAutoplay()
    })

    onUnmounted(() => {
      stopAutoplay()
    })

    return {
      carouselRef,
      currentIndex,
      setActiveItem,
      prev,
      next,
      handleChange,
      startAutoplay,
      stopAutoplay
    }
  },
  render() {
    return (
      <div class={cls.carouselContainer}>
        <ElCarousel
          ref="carouselRef"
          interval={this.interval}
          height={this.height}
          indicator-position={this.showIndicators ? this.indicatorPosition : 'none'}
          arrow={this.arrow}
          type={this.type}
          loop={this.loop}
          autoplay={this.autoplay}
          onChange={this.handleChange}
          pause-on-hover={true}
        >
          {this.items.map((item, index) => (
            <ElCarouselItem key={item.id}>
              <div class={cls.carouselItem}>
                <ElImage
                  src={item.imageUrl}
                  class={cls.carouselImage}
                  fit="cover"
                  preview-teleported={true}
                  preview-src-list={this.items.map(i => i.imageUrl)}
                />
                {(this.showTitle || this.showDescription) && (
                  <div class={cls.carouselContent}>
                    {this.showTitle && item.title && (
                      <h3 class={cls.carouselTitle}>{item.title}</h3>
                    )}
                    {this.showDescription && item.description && (
                      <p class={cls.carouselDescription}>{item.description}</p>
                    )}
                  </div>
                )}
              </div>
            </ElCarouselItem>
          ))}
        </ElCarousel>
        
      </div>
    )
  }
})