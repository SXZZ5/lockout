import { createSignal, Index, Show, createResource } from "solid-js"
import { secret_box } from "../styles/Landing.css";
import AddSecret from "./pwdobfsct";

export const [refetchTrigger, setRefetchTrigger] = createSignal(0)

export default function Homepage() {
    const [info] = createResource(refetchTrigger(), request_getinfo)

    return <div id="HOMEPAGE">
        <Show when={info.loading}>
            Loading ...
        </Show>
        {/* <button onClick={async () => setInfo(await request_getinfo())}>
            Getinfo
        </button> */}
        <Show when={info.state == 'ready' && info().length > 0} fallback={<div>information will appear here</div>}>
            <Index each={info()} >
                {(item, index) => {
                    console.log(item());
                    return <Secret information={item()} />
                }}
            </Index>
        </Show>
        <br></br>
        <AddSecret></AddSecret>
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

