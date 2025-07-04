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
        const emitChange = () => emit('change', signaturePad!.toDataURL())
        canvasRef.value.addEventListener('mouseup', emitChange)
        canvasRef.value.addEventListener('touchend', emitChange)
      }
    })

    const clear = () => {
      signaturePad?.clear()
      emit('change', '')
    }

    return () => (
      <div>
        <canvas ref={canvasRef} width={300} height={100} style="border:1px solid #ccc;" />
        <button type="button" onClick={clear}>清除</button>
      </div>
    )
  }
})