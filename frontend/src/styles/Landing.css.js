import { style } from '@vanilla-extract/css';
import '@fontsource-variable/frank-ruhl-libre';
import '@fontsource-variable/nunito-sans';

export const landingstyle = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '.dot1': {
        minHeight: '1px',
        minWidth: '1px',
        height: '1px',
        width: '1px',
        backgroundColor: 'hsl(229,100%,50%)',
        position: 'relative',
        top: '120px',
        left: '-15%',
        zIndex: '-10',
        boxShadow: '1px 1px 1500px 200px hsl(210,100%,75%)',
    },

    '.dot2': {
        minHeight: '1px',
        minWidth: '1px',
        height: '1px',
        width: '1px',
        backgroundColor: 'hsl(313,100%,50%)',
        position: 'relative',
        top: '-40px',
        left: '16%',
        boxShadow: '1px 1px 1500px 200px hsla(313,100%,50%,70%)',
        zIndex: '-10',
    },
})

export const herostyle = style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    minHeight: '200px',
    margin: '20px',
})

export const bigtext = style({
    fontFamily: 'Frank Ruhl Libre Variable',
    fontWeight: '600',
    fontSize: '72px',
    color: 'hsl(0,10%,25%)',
    position: 'relative',
    left: '-10%',
})

export const smalltext = style({
    fontFamily: 'Nunito Sans Variable',
    fontWeight: '400',
    fontSize: '28px',
    color: 'hsl(0,10%,40%)',
    position: 'relative',
    left: '-10%',
})

