import { style } from '@vanilla-extract/css';
import '@fontsource-variable/frank-ruhl-libre';

export const button_style = style({
    padding: 10,
    border: "2px solid black"
})

export const logsign = style({
    width: 200,
})

export const input_field = style({
    border: "solid 2px thistle",
    borderRadius: "5px"

})

export const secret_box = style({
    "border": "solid 1px thistle",
    "borderRadius": "8px",
    "margin": "10px",
    "padding": "4px",
    "boxShadow": "2px 4px 5px -1px rgba(0,0,0,0.9)"
})

//----------------------------------------------------------------
export const Herostyle = style({
})

export const bigtext = style({
    fontFamily : 'Frank Ruhl Libre Variable',
    fontWeight : '700'
})