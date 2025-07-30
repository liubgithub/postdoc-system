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

globalStyle(`${tableWidth} .el-table .el-table__cell`, {
    textAlign: 'center'
})

export const formSection = style({
    marginBottom: '20px',
});

export const cardHeader = style({
    fontWeight: 'bold',
    fontSize: '16px',
});

export const cardContent = style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '120px',
    lineHeight: 1.6,
})

export const para = style({
    marginBottom: '20px',
})

export const signatureWrapper = style({
    alignSelf: 'flex-end',
    textAlign: 'right'
})

export const signature = style({
    marginTop: '10px'
})

export const voteInput = style({
    width: '60px',
    margin: '0 10px',
}) 
export const formContainer = style({
    padding: '10px 20px',
    border: '1px solid #dcdfe6',
    fontFamily: '"SimSun", "STSong", "serif"',
    backgroundColor: '#f5f7fa',
    boxSizing: 'border-box',
    minHeight: '100vh',
    overflowY: 'auto',
})

export const header = style({
    textAlign: 'center',
    marginBottom: '20px',
})

export const container = {
    // height:"100%",
    padding: "20px",
    margin: "0 auto",
    // overflowY: "auto", // 添加垂直滚动
    boxSizing: "border-box", // 确保padding不会增加总高度
};


export const formWrapper = {
    marginTop: "10px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
};

