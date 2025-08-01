// client/src/coms/CommonTable/index.tsx
import { ElInput, ElTable, ElTableColumn, ElButton } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { TableRow as BaseTableRow } from '@/types/common-table'

// 扩展 TableRow 以允许通过字符串索引访问字段
interface TableRow extends BaseTableRow {
  [key: string]: any
}

export default defineComponent({
  name: 'CommonTable',
  props: {
    data: {
      type: Array as PropType<TableRow[]>,
      required: true,
    },
    editableFields: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<({ prop: string, label: string, width?: string, render?: (params: { row: TableRow; $index: number }) => any })[]>,
      required: true,
    },
    onView: {
      type: Function as PropType<(row: TableRow) => void>,
    },
    onEdit: {
      type: Function as PropType<(row: TableRow) => void>,
    },
    // onSubmit:{
    //   type:Function as PropType<(row:TableRow) => void>,
    // },
    tableClass: {
      type: String,
      default: '',
    },
    showAction: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    return () => (
      <ElTable data={props.data} class={props.tableClass}>
        {props.columns.map((col, colIdx) => (
          <ElTableColumn prop={col.prop} label={col.label} width={col.width} key={col.prop} align="center">
            {{
              default: ({ row, $index }: { row: TableRow; $index: number }) =>
                col.render
                  ? col.render({ row, $index })
                  : props.editableFields.includes(col.prop)
                    ? <ElInput v-model={row[col.prop]} />
                    : <span>{row[col.prop]}</span>
            }}
          </ElTableColumn>
        ))}
        {props.showAction && (props.onView || props.onEdit) && (
          <ElTableColumn label="操作" align="center">
            {{
              default: ({ row }: { row: TableRow }) => (
                <>
                  {props.onView && (
                    <ElButton type="primary" size="small" onClick={() => props.onView!(row)}>
                      查看
                    </ElButton>
                  )}
                  {/* {props.onSubmit && (
                     <ElButton type="primary" size="small" onClick={() => props.onSubmit!(row)}>
                     提交基本信息
                   </ElButton>
                  )} */}
                  {props.onEdit && (
                    <ElButton type="success" size="small" onClick={() => props.onEdit!(row)} style="margin-left: 8px;">
                      编辑
                    </ElButton>
                  )}
                </>
              )
            }}
          </ElTableColumn>
        )}
      </ElTable>
    )
  }
})