import { ElForm, ElFormItem, ElInput, ElDatePicker, ElMessage } from 'element-plus'
import SignaturePad from '@/units/Signature/index'
import apiFetch from '@/api/index'
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
		const isLoading = ref(false)
		const localModel = ref({ ...props.model })
		const hasSignature = ref(false)
		const signature = ref('')
		// 监听父组件传递的model变化
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
		const formFetchWithToken = async (url: string, options: RequestInit = {}) => {
			const token = localStorage.getItem('token');
			const headers = new Headers(options.headers);

			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}

			// 如果是 FormData，让浏览器自动设置 Content-Type
			if (options.body instanceof FormData) {
				headers.delete('Content-Type');
			}

			return fetch(`/api${url}`, {
				...options,
				headers
			});
		};
		const onSign = async (val: any) => {
			signature.value = val
			hasSignature.value = !!val;
		}
		const onSignatureUpload = async (val: string) => {
			if (val) {
				try {
					const formData = new FormData();
					formData.append('sign_type', '中期考核');
					formData.append('image_base64', val);

					const res = await formFetchWithToken('/uploadSign/upload_image', {
						method: 'POST',
						body: formData
					});

					if (res.ok) {
						console.log('Signature uploaded successfully');
						hasSignature.value = true;
						ElMessage.success('签名上传成功');
					}
				} catch (error) {
					console.error('Failed to upload signature:', error);
					ElMessage.error('签名上传失败');
				}
			}
		}

		const onSignatureConfirm = async (val: string) => {
			if (val) {
				try {
					const formData = new FormData();
					formData.append('sign_type', '中期考核');
					formData.append('image_base64', val);

					const res = await formFetchWithToken('/uploadSign/upload_image', {
						method: 'POST',
						body: formData
					});

					if (res.ok) {
						console.log('Signature uploaded successfully');
						hasSignature.value = true;
						ElMessage.success('签名成功');
					}
				} catch (error) {
					console.error('Failed to upload signature:', error);
					ElMessage.error('签名失败');
				}
			} else {
				hasSignature.value = false;
			}
		}

		const fetchSignature = async () => {
			try {
				const res = await apiFetch.raw.GET('/uploadSign/get_image_base64', {
					params: { query: { sign_type: '中期考核' } }
				});
				console.log(res, 'fff')
				if (res.data && (res.data as any).image_base64) {
					const imgBase64 = (res.data as { image_base64: string }).image_base64;
					signature.value = imgBase64;
					hasSignature.value = true;
				}
			} catch (error: any) {
				// 404错误是正常情况（新用户没有签名）
				if (error.response?.status === 404) {
					console.log('No signature found for new user');
					signature.value = '';
					hasSignature.value = false;
				} else {
					console.error('Error fetching signature:', error);
					ElMessage.error('获取签名失败');
				}
			}
		};
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