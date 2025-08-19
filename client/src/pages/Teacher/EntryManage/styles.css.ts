import { style } from '@vanilla-extract/css'


export const tableWidth = style({
    width: "100%"
})

export const formWrapper = style({
    background: '#fff',
    borderRadius: '0.5em',
    boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)',
    padding: '2em 4em',
    margin: 0,
});

export const formContainer = style({
    padding: '20px',
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