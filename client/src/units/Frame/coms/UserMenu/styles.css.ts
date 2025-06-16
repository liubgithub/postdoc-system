import { style } from '@vanilla-extract/css'

export const info = style({
    //flex
    display: 'flex',
    flexWrap: "nowrap",
    //visual
    padding: "10px",
    borderRadius: "5px",
    // extra
    selectors: {
        '&:hover': {
            backgroundColor: '#DDDDDD', // hover 时的背景色
        },
    },
})
export const info_icon = style({
    alignSelf: "center",
    paddingRight: "5px",
})

export const btngroup = style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})