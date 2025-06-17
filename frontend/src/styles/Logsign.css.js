import { style } from '@vanilla-extract/css';
import '@fontsource-variable/nunito-sans';
// Supports weights 100-900
import '@fontsource-variable/roboto-slab';


export const logsign = style({
    backgroundColor: 'white',
    minWidth: '300px',
    padding: '20px',
    margin: '20px',
    borderRadius: '15px',
    boxShadow: '0px 8px 20px black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
})

export const label = style({
    fontFamily: 'Roboto Slab Variable',
    fontSize: '16px',
    fontWeight: '600',
    color: 'hsl(0,5%,40%)',
    marginTop: '15px',
    marginBottom: '5px',
})

export const input_field = style({
    border: '2px solid hsl(0,0%,90%)',
    borderRadius: '5px',
    height: '1.8em',
})

export const logsignbutton = style({
    marginTop: '20px',
    marginBottom: '5px',
    height: '2em',
    backgroundColor: 'hsl(40,100%,80%)',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0px 2px 5px 1px hsl(0,0%,70%)',
    ':active': {
        boxShadow: '0px 1px 10px 1px hsl(0,0%,90%)'
    },
    cursor: 'pointer',
    fontFamily: 'Roboto Slab Variable',
    color: 'hsl(0,20%,30%)',
    fontSize: '15px',
    fontWeight: '600',
})

export const logsign_disabled_button = style({
    marginTop: '15px',
    marginBottom: '5px',
    height: '2em',
    backgroundColor: 'hsl(40,40%,80%)',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0px 1px 10px 1px hsl(0,0%,90%)',
    cursor: 'pointer',
    fontFamily: 'Roboto Slab Variable',
    color: 'hsl(0,20%,30%)',
    fontSize: '15px',
    fontWeight: '600',
})

export const newuserstyle = style({
    position: 'relative',
    left: '0%',
    color: 'hsl(0,5%,40%)',
    backgroundColor: 'hsl(0,5%,90%)',
    width: 'fit-content',
    padding: '5px 10px 5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'Roboto Slab Variable',
    fontWeight: '600',
    fontSize: '15px',
})

export const very_light_text = style({
    fontFamily: 'Roboto Slab Variable',
    color: 'hsl(0,0%,80%)',
    fontSize: '12px',
    fontWeight: '300',
    marginTop: '2px',
})

export const logsign_action_failure = style({
    fontFamily: 'Roboto Slab Variable',
    color: 'hsl(0,0%,30%)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '2px',
    position: 'relative',
    left: '0%',
})