import { style } from '@vanilla-extract/css'

const header_hight = 60

export const frame = style({
    width: "100%",
    height: "100%",
    display: 'flex',
    flexDirection: 'row',
    // overflow: "hidden",
})

export const image = style({
    backgroundColor: '#1473ef',
    marginRight: '1rem',
})
export const header = style({
    //position
    position: 'sticky',
    top: 0,
    zIndex: 100,
    //flex
    display: 'flex',
    flexWrap: "nowrap",
    // justifyContent: "space-between",
    alignItems: 'center',
    //size
    height: `${header_hight}px`,
    //visual
    background: "var(--el-bg-color)",
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
})
export const header_left = style({
})
export const header_left_title = style({
    fontSize: "2rem",
    fontWeight: 500,
})
export const header_right = style({
})

export const aside = style({
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0',
    boxShadow: '1px 0 5px rgba(0, 0, 0, 0.1)',
})

export const main = style({
    height: `calc(100vh - ${header_hight}px)`,
    overflowY: "auto",
})