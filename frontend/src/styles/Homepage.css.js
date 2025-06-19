import { style } from '@vanilla-extract/css';
import '@fontsource-variable/frank-ruhl-libre';
import '@fontsource-variable/nunito-sans';
import '@fontsource-variable/roboto-slab';

export const homepage_container = style({
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%,0%)',
    display: 'flex',
    justifyContent: 'space-between',
    width: '70vw',
})

export const tabstyle = style({
    padding: '40px',
    backgroundColor: 'hsl(200,80%,90%)',
    marginTop: '10px',
    marginBottom: '20px',
    borderRadius: '20px',
    boxShadow: '2px 6px 10px 2px hsl(200,10%,60%)',
    fontFamily: 'Roboto Slab Variable',
    fontWeight: '700',
    fontSize: '20px',
    color: 'hsl(240,50%,20%)',
    cursor: 'pointer',
})


export const tabstyle_active = style({
    padding: '40px',
    backgroundColor: 'hsl(200,80%,90%)',
    marginTop: '10px',
    marginBottom: '20px',
    borderRadius: '20px',
    boxShadow: '2px 6px 10px 2px hsl(200,10%,60%)',
    fontFamily: 'Roboto Slab Variable',
    fontWeight: '700',
    fontSize: '20px',
    color: 'hsl(240,50%,20%)',
    border: '4px solid hsl(200,50%,70%)',
})

export const bluesplash = style({
    height: '1px',
    width: '1px',
    boxShadow: '1px 1px 500px 400px hsl(210,70%,85%)',
    zIndex: '-10',
})

export const pinksplash = style({
    height: '1px',
    width: '1px',
    boxShadow: '1px 1px 1500px 200px hsla(313,90%,80%)',
    position: 'absolute',
    top: '80%',
    left: '60%',
    zIndex: '-10',
})