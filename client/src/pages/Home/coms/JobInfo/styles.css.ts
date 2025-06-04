import { style } from '@vanilla-extract/css'

export const info = style({
    height: "400px",
    overflow: "auto",
    textWrap: "wrap",
    selectors: {
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
})