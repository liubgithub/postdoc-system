import SignaturePad from 'signature_pad'

export default defineComponent({
  name: 'SignaturePad',
  emits: ['change'],
  setup(props, { emit }) {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    let signaturePad: SignaturePad | null = null

    onMounted(() => {
      if (canvasRef.value) {
        signaturePad = new SignaturePad(canvasRef.value)
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
        <canvas ref={canvasRef} width={300} height={100} style="border:1px solid #ccc;" />
        <div>
          <button type="button" onClick={clear}>清除</button>
          <button type="button" onClick={confirm} style="margin-left:8px;">确认签名</button>
          {/* 新增上传签字按钮 */}
          <label style="margin-left:8px;">
            <input type="file" accept="image/*" style="display:none" onChange={handleUpload} />
            <span style="border:1px solid #ccc;padding:2px 8px;cursor:pointer;">上传签字</span>
          </label>
        </div>
      </div>
    )
  }
})