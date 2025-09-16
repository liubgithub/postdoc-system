import { style } from '@vanilla-extract/css'


export const page = style({
    //flex
    display: "flex",
    flexDirection: "column",
    gap: "10px",
})
export const jobs = style({
    background: `url(${import.meta.env.BASE_URL}logos/news_bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
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

export const part = style({
    display: "flex",
    gap:'50px',
    padding: '0 100px'
})

export const part2 = style({
    background: `url(${import.meta.env.BASE_URL}logos/news_bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '0 100px' 
})

export const part3 = style({
    // width:'1200px',
    marginTop:'60px',
    display: 'flex',
    gap: '20px',
    padding: '0 100px'
})

export const part3left = style({
    width: '773px',
    flex: '1'
})

export const part3right = style({
    width: '407px',
    flexShrink: 0
})