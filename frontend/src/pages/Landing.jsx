import { createSignal } from "solid-js"
import { bigtext, herostyle, landingstyle, smalltext } from "../styles/Landing.css"
import { input_field, label, logsign, logsignbutton, logsign_disabled_button, newuserstyle, very_light_text, logsign_action_failure } from "../styles/Logsign.css"

export default function Landing() {
    return (

        <div id="LANDING_container" class={landingstyle}>
            <div class="dot1"></div>
            <Hero />
            <LogSign />
            <div class="dot2"></div>
        </div>

    )
}

function Hero() {
    return <div class={herostyle}>
        <div class={bigtext}>LOCKOUT</div>
        <div class={smalltext}>Manage Passwords </div>
        <div class={smalltext}>Lock yourself out of distractions</div>
    </div>
}

function LogSign() {
    const [status, setStatus] = createSignal(200);
    const [hasaccount, setHasaccount] = createSignal(true);
    const [pwdsmatch, setPwdsmatch] = createSignal(true)
    const [tried, setTried] = createSignal(false)

    return (
        <>
            <div class={logsign_action_failure}>
                <Show when={tried() == true && status() !== 200} fallback={null}>
                    {hasaccount() ? "Incorrect credentials" : "User already exists"}
                </Show>
            </div>
            <div id="LOGSIGN" class={logsign}>
                <div class={newuserstyle}
                    onClick={() => setHasaccount(!hasaccount())}>
                    <Show when={hasaccount() == false} fallback={"New User ?"}>
                        Already have an account ?
                    </Show>
                </div>
                <div class={label}>Email</div>
                <input
                    type="text"
                    id="emailfield"
                    class={input_field} />
                <div class={label}>Password</div>
                <input
                    type="password"
                    id="passwordfield"
                    class={input_field}
                    onKeyUp={() => {
                        if (tried()) setTried(false)
                    }} />
                <Show when={hasaccount() == false} fallback={null}>
                    <div class={label}> Enter password again</div>
                    <input
                        style={{ borderColor: pwdsmatch() }}
                        type="password"
                        id="password_renter_field"
                        class={input_field}
                        onKeyUp={() => {
                            if (!checkEqualPasswords()) {
                                console.log("pwds don't match", pwdsmatch())
                                setPwdsmatch(false)
                            } else {
                                console.log("pwds match", pwdsmatch())
                                setPwdsmatch(true)
                            }
                            if (tried()) setTried(false)
                        }} />
                </Show>
                <Show when={hasaccount() == true}>
                    <button class={logsignbutton} onClick={async () => {
                        setTried(true)
                        try {
                            setStatus(await request_login())
                        } catch (err) {
                            setStatus(400)
                        }
                    }}>
                        Login
                    </button>
                </Show>
                <Show when={hasaccount() == false}>
                    <Show when={pwdsmatch() == true}>
                        <button class={logsignbutton} onClick={async () => {
                            setTried(true)
                            setStatus(await request_signup())
                        }}>
                            Signup
                        </button>
                    </Show>
                    <Show when={pwdsmatch() == false}>
                        <div class={very_light_text}>Passwords don't match</div>
                        <button class={logsign_disabled_button}>
                            Signup
                        </button>
                    </Show>

                </Show>
            </div>
        </>
    )
}

async function request_signup() {
    if (!checkEqualPasswords()) return
    const email = document.getElementById("emailfield").value
    const password = document.getElementById("passwordfield").value
    const endpoint = "https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/signup"
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
        if (response.ok)
            localStorage.setItem("email", email)
        return response.status
    } catch (err) {
        console.log("Something went wrong", err)
    }
}

async function request_login() {
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
        if (response.ok)
            localStorage.setItem("email", email)
        return rbody
    } catch (err) {
        console.log("Something went wrong", err)
    }
}

function checkEqualPasswords() {
    const email = document.getElementById("emailfield").value
    const password = document.getElementById("passwordfield").value
    const password2 = document.getElementById("password_renter_field").value
    return (password === password2)
}