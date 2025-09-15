import { style } from '@vanilla-extract/css'

export const sidebarMenu = style({
  height: '100%',
  borderRight: '1px solid #e6e6e6',
})

export const sidebarMenuItem = style({
  color: '#606266',
  ':hover': {
    backgroundColor: '#f5f7fa',
    color: '#409eff',
  }
})

export const sidebarMenuItemActive = style({
  backgroundColor: '#ecf5ff',
  color: '#409eff',
  borderRight: '3px solid #409eff',
  ':hover': {
    backgroundColor: '#ecf5ff',
    color: '#409eff',
  }
})

export const contentContainer = style({
  padding: '20px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
})

export const searchContainer = style({
  background: '#fff',
  padding: '20px',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
})

export const tableContainer = style({
  flex: 1,
  background: '#fff',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
})

export const statusTagSuccess = style({
  backgroundColor: '#f0f9ff',
  color: '#67c23a',
  borderColor: '#b3e19d',
})

export const statusTagWarning = style({
  backgroundColor: '#fdf6ec',
  color: '#e6a23c',
  borderColor: '#f5dab1',
})

export const statusTagDanger = style({
  backgroundColor: '#fef0f0',
  color: '#f56c6c',
  borderColor: '#fbc4c4',
})
