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

export const sidebarMenu = style({
    borderRight: 'none',
    background: '#fff',
})

export const sidebarMenuItem = style({
    fontSize: '16px',
    height: '50px',
    lineHeight: '50px',
    borderBottom: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    ':hover': {
        background: '#f5f7fa',
        color: '#409eff',
    }
})

export const sidebarMenuItemActive = style({
    background: '#e6f7ff',
    color: '#409eff',
    borderRight: '3px solid #409eff',
})
