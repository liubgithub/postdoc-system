import { ElForm, ElFormItem, ElInput, ElDatePicker, ElMessage } from 'element-plus'
import SignaturePad from '@/units/Signature/index'
import apiFetch from '@/api/index'
import { useSignature } from '@/units/Signature/useSignature'
export default defineComponent({
	name: 'Achievement_1',
	props: {
		model: {
			type: Object,
			required: true
		}
	},
	emits: ['update:model'],
	setup(props, { emit }) {

		const localModel = ref({ ...props.model })
		const { hasSignature, signature, isLoading, onSignatureUpload, onSignatureConfirm, fetchSignature } = useSignature('中期考核')
		// 监听父组件传递的model变化
		const onSign = (val:any)=>{
			signature.value = val
			hasSignature.value = !!val
		}
		watch(() => props.model, (newModel) => {
			localModel.value = { ...newModel }
		})

		const onInput = (key: string, value: any) => {
			localModel.value[key] = value
			emit('update:model', { ...localModel.value })
		}
		onMounted(async () => {
			isLoading.value = true
			try {
				await fetchSignature()
				const res = await apiFetch.raw.GET('/researchStatus/', {
					params: { query: { subType: '中期考核' } }
				})
				const maybeData = (res as any)?.data ?? res
				const payload = maybeData?.Target ?? maybeData

				if (payload) {
					localModel.value.subNamePlan = payload[0].subNamePlan
					localModel.value.subDescription = payload[0].subDescription
				}
			} catch (error) {
				console.log(error)
			} finally {
				isLoading.value = false
			}
		})


		return () => (
			<div>
				<div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>博士后项目研究情况</div>
				<ElForm labelWidth="100px" labelPosition="top">
					<div style={{ borderRadius: '4px', background: '#fff', padding: 0, position: 'relative', minHeight: '500px' }}>
						{/* 第一部分 */}
						<div style={{ padding: '16px', minHeight: '180px', position: 'relative' }}>
							<ElFormItem label='主持研究的项目名称及研究计划' style={{ marginBottom: 0 }}>
								<ElInput
									type="textarea"
									autosize={{ minRows: 6 }}
									rows={6}
									modelValue={localModel.value.subNamePlan || ''}
									onInput={val => onInput('subNamePlan', val)}
								/>
							</ElFormItem>

						</div>
						{/* 第二部分 */}
						<div style={{ padding: '16px' }}>
							<ElFormItem label='博士后本人中期工作小结（包括项目进展情况、后期研究计划及参与的其它工作等' >
								<ElInput
									type="textarea"
									autosize={{ minRows: 12 }}
									rows={12}
									modelValue={localModel.value.subDescription || ''}
									onInput={val => onInput('subDescription', val)}
								/>
							</ElFormItem>
							{/* 签字和日期 */}
							<div style={{ position: 'absolute', right: '30px', bottom: '20px', textAlign: 'right', width: '300px' }}>
								<div style={{ marginBottom: '10px', marginRight: '220px' }}>博士后签字</div>
								<SignaturePad
									onChange={val => onSign(val)}
									onUpload={onSignatureUpload}
									onConfirm={onSignatureConfirm}
									image={signature.value}
								/>
								<ElFormItem label="日期" prop="guideGroupDate">
									<ElDatePicker
										type="date"
										placeholder="选择日期"
										modelValue={localModel.value.date || ''}
										onUpdate:modelValue={val => onInput('date', val)}
										style={{ width: '100%' }}
									/>
								</ElFormItem>
							</div>
						</div>
					</div>
				</ElForm>
			</div>
		)
	}
})