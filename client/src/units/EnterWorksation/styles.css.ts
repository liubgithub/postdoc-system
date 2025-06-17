import { style } from '@vanilla-extract/css'

export const tableWidth = style({
    width: "100%",
    selectors: {
        '& .el-table__header th': {
            textAlign: 'center',
            backgroundColor: '#f5f7fa',
            color: '#606266',
            fontWeight: 'bold',
            padding: '12px 0'
        },
        '& .el-table__body td': {
            padding: '8px 0'
        },
        '& .el-input': {
            width: '100%'
        },
        '& .el-input__wrapper': {
            boxShadow: 'none',
            padding: '0 8px'
        },
        '& .el-input__inner': {
            height: '32px',
            lineHeight: '32px'
        },
        '& .el-textarea__inner': {
            boxShadow: 'none',
            padding: '8px'
        }
    }
})

export const opreateBtn = style({
    width: "100%",
    height: "100%",
    padding: "0 10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    selectors: {
        '& .el-button': {
            padding: '8px 20px',
            fontSize: '14px'
        }
    }
})