import { style, globalStyle } from '@vanilla-extract/css'

export const tableWidth = style({
    width: "100%"
})

// 全局样式
globalStyle(`${tableWidth} .el-table__header th`, {
    textAlign: 'center',
    backgroundColor: '#f5f7fa',
    color: '#606266',
    fontWeight: 'bold',
    padding: '12px 0'
})

globalStyle(`${tableWidth} .el-table__body td`, {
    padding: '8px 0'
})

globalStyle(`${tableWidth} .el-input`, {
    width: '100%'
})

globalStyle(`${tableWidth} .el-input__wrapper`, {
    boxShadow: 'none',
    padding: '0 8px'
})

globalStyle(`${tableWidth} .el-input__inner`, {
    height: '32px',
    lineHeight: '32px'
})

globalStyle(`${tableWidth} .el-textarea__inner`, {
    boxShadow: 'none',
    padding: '8px'
})

export const opreateBtn = style({
    width: "100%",
    height: "100%",
    padding: "0 10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px"
})

globalStyle(`${opreateBtn} .el-button`, {
    padding: '8px 20px',
    fontSize: '14px'
})