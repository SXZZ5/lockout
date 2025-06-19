import { createSignal } from "solid-js";
import { pwdObfuscated, generatePwd } from "../passwords";
import { container, genbuttons, indextellerstyle, inputdescrstyle, pwdchar } from "../styles/Addsecrets.css";
import backspaceIcon from "../assets/icons8-backspace-50.png"

const [fullpwdseq, setFullpwdseq] = createSignal(String());
const [backendstored, setBackendstored] = createSignal(false);
const [showing, setShowing] = createSignal(false);

export default function AddSecret() {

    return <>
        <div class={container}>
            <input class={inputdescrstyle} type="text" placeholder="Enter descriptor" id="NewPwdDescription"></input>
            <br />
            <button class={genbuttons} onClick={() => {
                if (document.getElementById("NewPwdDescription").value == null) {
                    alert("enter a description first")
                    return;
                }
                const { fullseq, pwd } = pwdObfuscated();
                console.log(fullseq, pwd);
                setFullpwdseq(fullseq)
                request_add(pwd, fullseq)
            }}>
                Pin
            </button>
            <button class={genbuttons} onClick={() => {
                if (document.getElementById("NewPwdDescription").value == null) {
                    alert("enter a description first")
                    return
                }
                const pwd = generatePwd();
                const fullseq = pwd;
                console.log(fullseq, pwd);
                setFullpwdseq(fullseq)
                request_add(pwd, fullseq)
            }}>
                Password
            </button>
            <br></br>
            <button class={genbuttons} onClick={() => setShowing(!showing())}>
                Start Entering
            </button>
            <br></br>
        </div>

        <Show when={showing() == true && backendstored() == true} fallback={null}>
            <PwdCharacter />
        </Show>
    </>
}

// description -> click add button -> PwdObfuscate() + send_to_backend -> start showing -> render pwdcreate 

export function PwdCharacter() {
    const [index, setIndex] = createSignal(0)
    const [char, setChar] = createSignal(String());
    function nextClick() {
        setIndex(index() + 1)
        if (index() >= fullpwdseq().length) {
            if (char() === "Finished") {
                setChar(null);
                setShowing(false);
            } else {
                setChar("Finished")
            }
            console.log(char())
            return;
        }
        console.log(index())
        console.log(fullpwdseq().at(index() - 1))
        setChar(fullpwdseq().at(index() - 1))
    }
    return <div class={pwdchar}>
        <Show when={char() != null} fallback={null}>
            <Show when={char() === '-'} fallback={char()}>
                <img src={backspaceIcon} height={38} width={40}/>
            </Show>
            <br/>
        </Show>
        <br />
        <div>
            <button class={genbuttons} onClick={nextClick}>
                {char() === "Finished" ? "Done" : "Next"}
            </button>
            <span class={indextellerstyle}> {`${index()}/${fullpwdseq().length}`}</span>
        </div>
    </div>
}

async function request_add(pwd, fullseq) {
    const response = await fetch("https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/updates",
        {
            "method": "POST",
            credentials: "include",
            body: JSON.stringify({
                "email": localStorage.getItem("email"),
                "action": {
                    "clause": "create",
                    "description": document.getElementById("NewPwdDescription").value,
                    "zkpwdhash": pwd,
                    "obfuscated": fullseq,
                }
            })
        }
    )
    
    if(response.ok) {
        alert("Secret stored. You can start entering now");
        setBackendstored(true);
        return;
    } else {
        setBackendstored(false);
        alert("Could not store secret. Login and try again. This descriptor already exists")
    }
}
