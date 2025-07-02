import { ElForm, ElFormItem, ElInput } from 'element-plus'

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
        const onInput = (key: string, value: any) => {
            emit('update:model', { ...props.model, [key]: value })
        }
        return () => (
            <div>
                <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>博士后项目研究情况</div>
                <ElForm labelWidth="100px">
                    <div style={{ border: '1px solid #333', borderRadius: '4px', background: '#fff', padding: 0, position: 'relative', minHeight: '500px' }}>
                        {/* 第一部分 */}
                        <div style={{ padding: '20px', minHeight: '180px', borderBottom: '1px solid #666', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '30px', top: '28px', color: '#333', fontSize: '1em', zIndex: 2 }}>
                                主持研究的项目名称及研究计划：
                            </span>
                            <ElInput
                                type="textarea"
                                autosize={{ minRows: 5 }}
                                style={{ paddingLeft: '220px', fontSize: '1em', width: '100%', resize: 'none', background: 'transparent' }}
                                modelValue={props.model.projectPlan || ''}
                                onInput={val => onInput('projectPlan', val)}
                                placeholder="请输入内容..."
                            />
                        </div>
                        {/* 第二部分 */}
                        <div style={{ padding: '20px', minHeight: '220px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '30px', top: '28px', color: '#333', fontSize: '1em', zIndex: 2 }}>
                                博士后本人中期工作小结（包括项目进展情况、后期研究计划及参与的其它工作等）
                            </span>
                            <ElInput
                                type="textarea"
                                autosize={{ minRows: 6 }}
                                style={{ paddingLeft: '480px', fontSize: '1em', width: '100%', resize: 'none', background: 'transparent' }}
                                modelValue={props.model.midSummary || ''}
                                onInput={val => onInput('midSummary', val)}
                                placeholder="请输入内容..."
                            />
                            {/* 签字和日期 */}
                            <div style={{ position: 'absolute', right: '30px', bottom: '20px', textAlign: 'right', width: '300px', color: '#333' }}>
                                <div style={{ marginBottom: '10px' }}>博士后签字</div>
                                <div>年 月 日</div>
                            </div>
                        </div>
                    </div>
                </ElForm>
            </div>
        )
    }
})