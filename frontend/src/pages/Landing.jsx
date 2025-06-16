import { createSignal } from "solid-js"
import { bigtext, Herostyle, input_field, logsign } from "../styles.css"

export default function Landing() {
    return <>
        <Hero/>
        <LogSign />
    </>
}

function Hero() {
    return <div class={Herostyle}>
        <div class={bigtext}>LOCKOUT</div>
        <div class="smalltext">Manage Passwords </div>
        <div class="smalltext">Lock yourself out of distractions</div>
    </div>
}

function LogSign() {
    const [status, setStatus] = createSignal("Welcome");
    return <div id="LOGSIGN" class={logsign}>
        Email:
        <input
            type="text"
            id="emailfield"
            class={input_field} />
        Password:
        <input
            type="text"
            id="passwordfield"
            class={input_field} />
        <button onClick={ async () => setStatus(await clickLogin()) }>
            Login
        </button>
        <div id="Login_statusinfo">
            {status()}
        </div>
    </div>
}

async function clickLogin() {
    const email = document.getElementById("emailfield").value
    const password = document.getElementById("passwordfield").value

    const endpoint = "https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/login"
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        if (!response.ok) throw (response.statusText)
        const rbody = await response.text()
        if(response.ok) 
            localStorage.setItem("email", email)
        return rbody
    } catch (err) {
        console.log("Something went wrong", err)
    }
}

