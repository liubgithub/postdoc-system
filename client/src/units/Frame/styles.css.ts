import { style, globalStyle } from '@vanilla-extract/css'

const header_hight = 100

export const frame = style({
    width: "100%",
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
})

export const image = style({
    marginRight: '1rem',
})

export const header = style({
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    paddingLeft:'200px',
    flexWrap: "nowrap",
    alignItems: 'center',
    height: `${header_hight}px`,
    background: "var(--el-bg-color)",
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
})

export const header_left = style({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
})

export const header_left_title = style({
    fontSize: "2.4rem",
    fontWeight: 500,
    marginLeft: '1rem',
    color: '#920000',
})

export const header_right = style({
    marginRight: '2rem',
})

export const main = style({
    height: `calc(100vh - ${header_hight}px)`,
    overflowY: "auto",
})

export const horizontalMenu = style({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height:'70px',
    borderBottom: 'none',
    backgroundColor: 'transparent',
})

// 使用globalStyle替代selectors
globalStyle(`${horizontalMenu} .el-menu--horizontal`, {
    display: 'flex',
    justifyContent: 'center',
    border: 'none',
    width: '100%',
})

globalStyle(`${horizontalMenu} .el-menu-item`, {
    fontSize: '24px',
    fontWeight:'bold',
    lineHeight: '60px',
    height: '60px',
    padding: '0 25px',
    color: '#333',
    transition: 'all 0.3s ease',
})

globalStyle(`${horizontalMenu} .el-menu-item:hover`, {
    backgroundColor: '#920000 !important',
    color: '#fff !important',
})

globalStyle(`${horizontalMenu} .el-sub-menu .el-sub-menu__title`, {
    fontSize: '24px',
    fontWeight:'bold',
    lineHeight: '60px',
    height: '60px',
    padding: '0 30px', // 增加左右内边距，使有子菜单的项目更宽
    color: '#333',
    transition: 'all 0.3s ease',
    minWidth: '140px', // 设置最小宽度
})

globalStyle(`${horizontalMenu} .el-sub-menu .el-sub-menu__title:hover`, {
    backgroundColor: ' #920000',
    color: '#fff',
})

// 下拉菜单样式 - 使用更具体的选择器
globalStyle(`.el-popper .el-menu--popup`, {
    backgroundColor: 'rgb(149, 8, 8)', // 下拉菜单背景色
    border: 'none',
    borderRadius: '4px',
    padding: '5px 0',
    minWidth: '140px', // 与父菜单项最小宽度保持一致
    boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
})

globalStyle(`.el-popper .el-menu--popup .el-menu-item`, {
    fontSize: '16px !important',
    justifyContent: 'center',
    lineHeight: '40px !important',
    height: '40px !important',
    padding: '0 20px !important',
    color: '#fff !important',
    backgroundColor: 'rgba(158, 13, 13, 0.8) !important',
    transition: 'all 0.3s ease !important',
    border: 'none !important',
})

globalStyle(`.el-popper .el-menu--popup .el-menu-item:hover`, {
    backgroundColor: 'rgb(184, 44, 44) !important', // hover背景色
    color: '#fff !important',
})

