import { ElDatePicker, ElRow, ElCol, ElCard } from 'element-plus'
import BarChart from './BarChart'

type Range = [Date, Date] | null

export default defineComponent({
    name:'Statistics',
    setup() {
        const range = ref<Range>(null)

        const xMonths = ref<string[]>([])
        const dataInStation = ref<number[]>([])
        const dataPapers = ref<number[]>([])
        const dataOutStation = ref<number[]>([])
        const dataExtension = ref<number[]>([])

        const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`

        const buildMonths = (start: Date, end: Date) => {
            const s = new Date(start.getFullYear(), start.getMonth(), 1)
            const e = new Date(end.getFullYear(), end.getMonth(), 1)
            const keys: string[] = []
            while (s <= e) {
                keys.push(monthKey(s))
                s.setMonth(s.getMonth() + 1)
            }
            return keys
        }

        const resetSeries = (len: number) => Array.from({ length: len }, () => 0)

        const fetchAll = async (start: Date, end: Date) => {
            const len = xMonths.value.length
            dataInStation.value = resetSeries(len)
            dataPapers.value = resetSeries(len)
            dataOutStation.value = resetSeries(len)
            dataExtension.value = resetSeries(len)
        }

        watch(() => range.value, async (val) => {
            if (!val || val.length !== 2) return
            const [start, end] = val
            xMonths.value = buildMonths(start, end)
            await fetchAll(start, end)
        }, { deep: true })

        const now = new Date()
        const defaultStart = new Date(now.getFullYear(), 0, 1)
        const defaultEnd = new Date(now.getFullYear(), 11, 31)
        range.value = [defaultStart, defaultEnd]
        xMonths.value = buildMonths(defaultStart, defaultEnd)
        fetchAll(defaultStart, defaultEnd)

        return()=> (
            <div style={{ padding: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <ElDatePicker
                        v-model={range.value as any}
                        type="daterange"
                        startPlaceholder="开始日期"
                        endPlaceholder="结束日期"
                        unlinkPanels
                        rangeSeparator="至"
                    />
                </div>
                <ElRow gutter={16}>
                    <ElCol span={12}>
                        <ElCard bodyStyle={{ padding: '12px' }}>
                            <BarChart title="在站人数" yAxisName="在站博士后人数" xData={xMonths.value} yData={dataInStation.value} height="280px" />
                        </ElCard>
                    </ElCol>
                    <ElCol span={12}>
                        <ElCard bodyStyle={{ padding: '12px' }}>
                            <BarChart title="科研成果" yAxisName="科研成果数据" xData={xMonths.value} yData={dataPapers.value} height="280px" />
                        </ElCard>
                    </ElCol>
                </ElRow>
                <ElRow gutter={16} style={{ marginTop: '16px' }}>
                    <ElCol span={12}>
                        <ElCard bodyStyle={{ padding: '12px' }}>
                            <BarChart title="出站人数" yAxisName="出站博士后数量" xData={xMonths.value} yData={dataOutStation.value} height="280px" />
                        </ElCard>
                    </ElCol>
                    <ElCol span={12}>
                        <ElCard bodyStyle={{ padding: '12px' }}>
                            <BarChart title="延期人数" yAxisName="延期博士后数量" xData={xMonths.value} yData={dataExtension.value} height="280px" />
                        </ElCard>
                    </ElCol>
                </ElRow>
            </div>
        )
    },
})