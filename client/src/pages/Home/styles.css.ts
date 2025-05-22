import { style } from '@vanilla-extract/css'

export const page = style({
    //flex
    display: "flex",
    gap: "10px",
    //size
    width: "100%",
})
export const card = style({
    flex: 1,
    width: '100%', 
})
export const card_content = style({
    //flex
    display: "flex",
    flexDirection: "column",
    gap: "10px",
})