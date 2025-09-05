import { ElMessage } from 'element-plus'
import { formFetchWithToken } from '@/api/signImage/index'
import apiFetch from '@/api/index'

export const useSignature = (signType: string) => {
    const hasSignature = ref(false)
    const signature = ref('')
    const isLoading = ref(false)

    const onSignatureUpload = async (val: string) => {
        if (val) {
            try {
                const formData = new FormData();
                formData.append('sign_type', signType);
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
                formData.append('sign_type', signType);
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
                params: { query: { sign_type: signType } }
            });
            
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

    return {
        hasSignature,
        signature,
        isLoading,
        onSignatureUpload,
        onSignatureConfirm,
        fetchSignature
    }
}