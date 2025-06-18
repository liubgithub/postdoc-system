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

export const container = {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    height: "calc(100vh - 40px)", // 减去padding的高度
    overflowY: "auto", // 添加垂直滚动
    boxSizing: "border-box", // 确保padding不会增加总高度
};


export const formWrapper = {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
};

export const btnGroup = {
    marginTop: "20px",
    textAlign: "right",
};