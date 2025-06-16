import { style } from '@vanilla-extract/css'

export const page = style({
    //flex
    display: "flex",
    flexDirection: "column",
    gap: "10px",
})
export const jobs = style({
})
export const jobs_title = style({
    margin: "10px",
    fontSize: "25px",
    fontWeight: 700,
})
export const jobs_title_line = style({
    height: "2px",
    width: "200px",
    marginLeft: "10px",
    background: "#004EA1",
})
export const job_cards = style({
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    height: "500px",
    marginTop: "20px",
    overflowY: "hidden",
    overflowX: "auto",
})
export const job_card = style({
    width: "35vw",
    flexShrink: 0,
})
export const news = style({
})
export const news_title = style({
    margin: "10px",
    fontSize: "25px",
    fontWeight: 700,
})
export const news_title_line = style({
    height: "2px",
    width: "200px",
    marginLeft: "10px",
    background: "#004EA1",
})
export const news_cards = style({
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
})

export const card = style({
    flex: 1,
    height: '100%',
})
export const card_content = style({
    //flex
    display: "flex",
    flexDirection: "column",
    gap: "10px",
})