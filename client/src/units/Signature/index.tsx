import SignaturePad from 'signature_pad'

export default defineComponent({
  name: 'SignaturePad',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    image: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    let signaturePad: SignaturePad | null = null

    const loadImageToCanvas = (imgSrc: string) => {
      if (canvasRef.value && imgSrc) {
        const img = new window.Image()
        img.onload = () => {
          const ctx = canvasRef.value!.getContext('2d')
          ctx?.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
          ctx?.drawImage(img, 0, 0, canvasRef.value!.width, canvasRef.value!.height)
        }
        img.src = imgSrc
      }
    }

    onMounted(() => {
      if (canvasRef.value) {
        signaturePad = new SignaturePad(canvasRef.value)
        if (props.disabled) {
          signaturePad.off() // 禁用签名
        }
        if (props.image) {
          loadImageToCanvas(props.image)
        }
      }
    })

    // 监听 disabled 变化
    watch([() => props.disabled,()=>props.image], ([disabled,newimage]) => {
      if (signaturePad) {
        disabled ? signaturePad.off() : signaturePad.on()
      }
      if(newimage){
        loadImageToCanvas(newimage)
      }
    })

    // 新增：处理图片上传
    const handleUpload = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files[0] && canvasRef.value) {
        const file = input.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new window.Image()
          img.onload = () => {
            const ctx = canvasRef.value!.getContext('2d')
            if (ctx) {
              ctx.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
              // 保持图片比例自适应canvas
              let w = img.width, h = img.height
              const maxW = canvasRef.value!.width, maxH = canvasRef.value!.height
              let drawW = maxW, drawH = maxH
              if (w / h > maxW / maxH) {
                drawW = maxW
                drawH = (h / w) * maxW
              } else {
                drawH = maxH
                drawW = (w / h) * maxH
              }
              ctx.drawImage(img, (maxW - drawW) / 2, (maxH - drawH) / 2, drawW, drawH)
              emit('change', canvasRef.value!.toDataURL())
              signaturePad?.clear() // 清除手写轨迹，防止混淆
            }
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    }

    const clear = () => {
      if (canvasRef.value) {
        const ctx = canvasRef.value.getContext('2d')
        ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
      }
      signaturePad?.clear()
      emit('change', '')
    }

    // 新增：确认签名
    const confirm = () => {
      if (signaturePad && !signaturePad.isEmpty()) {
        emit('change', signaturePad.toDataURL())
      } else {
        emit('change', '')
      }
    }

    return () => (
      <div>
        <canvas ref={canvasRef} width={300} height={100}
          style={{
            border: '1px solid #ccc',
            cursor: props.disabled ? 'not-allowed' : 'crosshair'
          }} />
        <div>
          <button type="button" onClick={clear} disabled={props.disabled}>清除</button>
          <button type="button" onClick={confirm} style="margin-left:8px;" disabled={props.disabled}>确认签名</button>
          {/* 新增上传签字按钮 */}
          <label style="margin-left:8px;">
            <input
              type="file"
              accept="image/*"
              style="display:none"
              onChange={handleUpload}
              disabled={props.disabled}
            />
            <span style={{
              border: '1px solid #ccc',
              padding: '2px 8px',
              cursor: props.disabled ? 'not-allowed' : 'pointer',
              opacity: props.disabled ? 0.6 : 1
            }}>
              上传签字
            </span>
          </label>
        </div>
      </div>
    )
  }
})