import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, TitleComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TooltipComponent, GridComponent, TitleComponent, BarChart, CanvasRenderer])

export default defineComponent({
	name: 'BarChart',
	props: {
		title: { type: String, required: true },
		xData: { type: Array as () => string[], required: true },
		yData: { type: Array as () => number[], required: true },
		yAxisName: { type: String, required: false, default: '' },
		height: { type: String, required: false, default: '300px' },
	},
	setup(props) {
		const chartRef = ref<HTMLDivElement | null>(null)
		let chart: echarts.ECharts | null = null

		const render = () => {
			if (!chartRef.value) return
			if (!chart) {
				chart = echarts.init(chartRef.value)
			}
			const option = {
				title: { text: props.title },
				tooltip: { trigger: 'axis' },
				grid: { left: 40, right: 20, top: 50, bottom: 30 },
				xAxis: {
					type: 'category',
					data: props.xData,
					axisTick: { alignWithLabel: true },
				},
				yAxis: {
					type: 'value',
					name: props.yAxisName,
				},
				series: [
					{
						name: props.title,
						type: 'bar',
						data: props.yData,
						barWidth: '50%',
					},
				],
			} as echarts.EChartsCoreOption
			chart.setOption(option)
		}

		onMounted(() => {
			render()
			window.addEventListener('resize', resize)
		})

		const resize = () => {
			if (chart) chart.resize()
		}

		watch(() => [props.xData, props.yData, props.title, props.yAxisName], () => {
			render()
		}, { deep: true })

		onBeforeUnmount(() => {
			window.removeEventListener('resize', resize)
			if (chart) {
				chart.dispose()
				chart = null
			}
		})

		return () => (
			<div ref={chartRef} style={{ width: '100%', height: props.height }}></div>
		)
	},
})


