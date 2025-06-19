import { style } from '@vanilla-extract/css';
import '@fontsource-variable/frank-ruhl-libre';
import '@fontsource-variable/nunito-sans';
import '@fontsource-variable/roboto-slab';

export const inputdescrstyle = style({
    border: '2px solid hsl(0,0%,90%)',
    borderRadius: '4px',
    marginTop: '10px', marginBottom: '10px',
    height: '1.5em',
})

export const genbuttons = style({
    minHeight: '40px',
    minWidth: '80px',
    backgroundColor: 'hsl(40,100%,90%)',
    cursor: 'pointer',
    fontFamily: 'Roboto Slab Variable',
    color: 'hsl(0,20%,30%)',
    fontSize: '16px',
    fontWeight: '500',
    marginRight: '5px',
    marginBottom: '10px',
    marginTop: '10px',
    border: 'none',
    borderRadius: '5px',
    boxShadow: ['0px 0px 0px 1px rgba(0,0,0,0.16)',
        '0px 1px 1px -0.5px rgba(0,0,0,0.16)',
        '0px 3px 3px -1.5px rgba(0,0,0,0.16)',
        '0px 6px 6px -3px rgba(0,0,0,0.16)',
        '0px 12px 12px -6px rgba(0,0,0,0.16)',
        '0px 24px 24px -12px rgba(0,0,0,0.16)'].join(', '),
    ':active': {
        boxShadow: 'none',
    },
})

export const container = style({
    position: 'relative',
    left: '-80%',
})

export const pwdchar = style({
    marginTop: '10px',
    fontFamily: 'Frank Ruhl Libre Variable',
    fontSize: '40px',
    fontWeight: '600',
    color: 'hsl(0,0%,20%)'
})