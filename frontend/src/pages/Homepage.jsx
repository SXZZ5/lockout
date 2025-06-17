import { createSignal, Index, Show, createResource, Switch, createEffect } from "solid-js"
import { secret_box } from "../styles/Landing.css";
import AddSecret from "./pwdobfsct";
import { homepage_container, tabstyle, bluesplash, pinksplash, tabstyle_active } from "../styles/Homepage.css";
import { useNavigate } from "@solidjs/router";

export const [refetchTrigger, setRefetchTrigger] = createSignal(0)
const [activetab, setActivetab] = createSignal(0)

export default function Homepage() {
    return (
        <div class={homepage_container}>
            <div>
                <div class={bluesplash}/>
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
    const [info] = createResource(refetchTrigger(), request_getinfo)
    const navigate = useNavigate()
    createEffect(() => {
        if(info.error) {
            navigate("/", {replace:true})
        }
    })
    return <div id="MyPasswords">
        <Show when={info.loading}>
            Loading ...
        </Show>
        {/* <button onClick={async () => setInfo(await request_getinfo())}>
            Getinfo
        </button> */}
        <div class={pinksplash}/>
        <Show when={info.state == 'ready' && info().length > 0} fallback={<div>information will appear here</div>}>
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
            "https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/getinfo", {
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
        <h3>Description: {information.description}</h3>
        <br></br>
        Time: {(new Date(information.epochTime)).toString()},
        <br></br>
        Cooldown Hours: {information.cooldownHours},
        <br></br>
        secret: {information.pwdhash}
        <br></br>
        obfuscated: {information.obfuscated}
        <br></br>

        <button onClick={() => request_update(information.description, "reveal")}>
            Register reveal request
        </button>
        <button onClick={() => {
            var response = prompt(`Do you really want to delete ${information.description} ? (Y/N)`)
            response = response.toLowerCase()
            if (response[0] == 'y')
                request_update(information.description, "delete")
            else
                alert("delete request omitted.")
        }}>
            Request deletion
        </button>
    </div>
}

function request_update(description, action_clause) {
    fetch("https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/updates", {
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
            alert(action_clause + "request successful");
            console.log(response.status);
        }
    })
}

