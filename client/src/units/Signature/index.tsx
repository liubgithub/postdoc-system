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

    const clear = () => {
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
        </div>
      </div>
    )
  }
})