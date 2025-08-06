import { ElButton, ElCard, ElMessage } from 'element-plus'
import { getMyProcessTypes, getProcessTypesByUserId } from '@/api/enterWorkstation'

export default defineComponent({
    name: 'ProcessTypesTest',
    setup() {
        const myProcessTypes = ref<any>(null)
        const userProcessTypes = ref<any>(null)
        const loading = ref(false)
        const userId = ref(1) // 测试用的用户ID

        const fetchMyProcessTypes = async () => {
            loading.value = true
            try {
                const response = await getMyProcessTypes()
                if (response.data) {
                    myProcessTypes.value = response.data
                    ElMessage.success('获取当前用户process_types成功')
                } else {
                    ElMessage.error('获取失败: ' + response.error?.message)
                }
            } catch (error) {
                console.error('获取process_types失败:', error)
                ElMessage.error('获取失败')
            } finally {
                loading.value = false
            }
        }

        const fetchUserProcessTypes = async () => {
            loading.value = true
            try {
                const response = await getProcessTypesByUserId(userId.value)
                if (response.data) {
                    userProcessTypes.value = response.data
                    ElMessage.success(`获取用户${userId.value}的process_types成功`)
                } else {
                    ElMessage.error('获取失败: ' + response.error?.message)
                }
            } catch (error) {
                console.error('获取用户process_types失败:', error)
                ElMessage.error('获取失败')
            } finally {
                loading.value = false
            }
        }

        const testPermissionScenarios = () => {
            const scenarios = [
                { userId: 1, description: '查看自己的process_types' },
                { userId: 2, description: '查看其他学生的process_types（学生角色会失败）' },
                { userId: 999, description: '查看不存在的用户process_types' }
            ]
            
            scenarios.forEach(scenario => {
                console.log(`测试场景: ${scenario.description}`)
                console.log(`用户ID: ${scenario.userId}`)
                // 这里可以添加实际的测试逻辑
            })
        }

        return () => (
            <div style="padding: 20px;">
                <h2>Process Types API 测试</h2>
                
                <ElCard style="margin-bottom: 20px;">
                    <h3>获取当前用户的process_types</h3>
                    <ElButton 
                        type="primary" 
                        onClick={fetchMyProcessTypes}
                        loading={loading.value}
                        style="margin-bottom: 10px;"
                    >
                        获取我的process_types
                    </ElButton>
                    
                    {myProcessTypes.value && (
                        <div>
                            <h4>结果:</h4>
                            <pre>{JSON.stringify(myProcessTypes.value, null, 2)}</pre>
                        </div>
                    )}
                </ElCard>

                <ElCard>
                    <h3>根据用户ID获取process_types</h3>
                    <div style="margin-bottom: 10px;">
                        <label>用户ID: </label>
                        <input 
                            type="number" 
                            value={userId.value}
                            onChange={(e) => userId.value = parseInt(e.target.value)}
                            style="margin-left: 10px; padding: 5px;"
                        />
                    </div>
                    <ElButton 
                        type="success" 
                        onClick={fetchUserProcessTypes}
                        loading={loading.value}
                        style="margin-bottom: 10px;"
                    >
                        获取用户process_types
                    </ElButton>
                    
                    <ElButton 
                        type="warning" 
                        onClick={testPermissionScenarios}
                        style="margin-left: 10px; margin-bottom: 10px;"
                    >
                        测试权限场景
                    </ElButton>
                    
                    {userProcessTypes.value && (
                        <div>
                            <h4>结果:</h4>
                            <pre>{JSON.stringify(userProcessTypes.value, null, 2)}</pre>
                        </div>
                    )}
                </ElCard>
            </div>
        )
    }
})