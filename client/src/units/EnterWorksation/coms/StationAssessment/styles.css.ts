import { style } from '@vanilla-extract/css'

export const formContainer = style({
    padding: '20px',
    fontFamily: '"SimSun", "STSong", "serif"',
})

export const header = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    selectors: {
        '& h1': {
            fontSize: '24px',
            textAlign: 'center',
            flexGrow: 1,
        }
    }
})

export const formSection = style({
    border: '1px solid black',
    marginBottom: '-1px',
})

export const title = style({
    padding: '10px',
    fontWeight: 'bold',
    borderBottom: '1px solid black',
    backgroundColor: '#f2f2f2',
})

export const content = style({
    padding: '20px',
    selectors: {
        '& p': {
            margin: '0 0 10px 0',
        }
    }
})

export const para = style({
    height: '60px',
})

export const signature = style({
    textAlign: 'right',
})

export const voteInput = style({
    width: '60px',
    margin: '0 10px',
}) 