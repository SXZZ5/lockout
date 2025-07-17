import { createSignal, Index, Show, createResource, Switch, createEffect } from "solid-js"
import AddSecret from "./pwdobfsct";
import { homepage_container, tabstyle, bluesplash, pinksplash, tabstyle_active } from "../styles/Homepage.css";
import { useNavigate } from "@solidjs/router";
import { buttonstyle, secret_box } from "../styles/Secretcard.css";
import "../styles/spinner.css"

const BE_URL_1 = "https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws"
const BE_URL_2 = "https://pp2thp4tbfzcjhrspqniyrzorq0vdbtb.lambda-url.ap-south-1.on.aws"

export const [refetchTrigger, setRefetchTrigger] = createSignal(0)
const [activetab, setActivetab] = createSignal(0)

export default function Homepage() {
    return (
        <div class={homepage_container}>
            <div>
                <div class={bluesplash} />
                <Show when={activetab() == 0}>
                    <div class={tabstyle_active} onClick={() => setActivetab(0)}>My Secrets</div>
                    <div class={tabstyle} onClick={() => setActivetab(1)}>Add Secrets</div>
                </Show>
                <Show when={activetab() == 1}>
                    <div class={tabstyle} onClick={() => setActivetab(0)}>My Secrets</div>
                    <div class={tabstyle_active} onClick={() => setActivetab(1)}>Add Secrets</div>
                </Show>

            </div>
            <div>
                <Switch>
                    <Match when={activetab() == 0}>
                        <MySecrets />
                    </Match>
                    <Match when={activetab() == 1}>
                        <AddSecret />
                    </Match>
                </Switch>
            </div>
        </div>
    )
}

function MySecrets() {
    const [info] = createResource(refetchTrigger, request_getinfo)
    const navigate = useNavigate()
    createEffect(() => {
        if (info.error) {
            alert("Session expired");
            navigate("/", { replace: true })
        }
    })
    return <div id="MyPasswords">
        <Show when={info.loading}>
            <div class='spinner'></div>
        </Show>
        {/* <button onClick={async () => setInfo(await request_getinfo())}>
            Getinfo
        </button> */}
        <div class={pinksplash} />
        <Show when={info.state == 'ready' && info().length > 0}>
            <Index each={info()} >
                {(item, index) => {
                    console.log(item());
                    return <Secret information={item()} />
                }}
            </Index>
        </Show>
    </div>
}

async function request_getinfo() {
    console.log(localStorage.getItem("email"));
    try {
        const response = await fetch(
            `${BE_URL_2}/getinfo`, {
            method: "POST",
            body: JSON.stringify({
                "email": localStorage.getItem("email"),
            }),
            credentials: "include",
        });
        const rbody = await response.json();
        return rbody.userdata;
    } catch (err) {
        throw new Error("Couldn't get user info", err)
    }
}

function Secret({ information, key }) {

    return <div class={secret_box}>
        <h3>{information.description}</h3>
        <br></br>
        Last change on {(new Date(information.epochTime)).toString()}
        <br></br>
        {information.cooldownHours} hours cooldown
        <br></br>
        Your secret is {information.pwdhash}
        <br></br>
        Obfuscated version was {`{${information.obfuscated}}`}
        <br></br>

        <button class={buttonstyle} onClick={() => request_update(information.description, "reveal")}>
            Register reveal request
        </button>
        <button class={buttonstyle} onClick={(event) => {
            var response = prompt(`Do you really want to delete ${information.description} ? (Y/N)`)
            response = response.toLowerCase()
            if (response[0] == 'y')
                response = prompt(`Type "${information.description}" below to confirm.`)
            if (response === information.description)
                request_update(information.description, "delete")
            else
                alert("delete request omitted.")
        }}>
            Request deletion
        </button>
    </div>
}

function request_update(description, action_clause) {
    fetch(`${BE_URL_2}/updates`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            email: localStorage.getItem("email"),
            action: {
                "clause": action_clause,
                "description": description
            }
        })
    }).then((response) => {
        if (response.ok) {
            alert(action_clause + " request successful");
            console.log(response.status);
            setRefetchTrigger((prev) => prev + 1)
        }
    })
}

