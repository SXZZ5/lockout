import { createSignal } from "solid-js";
import { genBalSeq, generatePin, generatePwd } from "../passwords";
import random from "random"

const [fullpwdseq, setFullpwdseq] = createSignal(String());
const [backendstored, setBackendstored] = createSignal(false);

export default function AddSecret() {
    const [showing, setShowing] = createSignal(false);

    return <>
        <input type="text" placeholder="Enter descriptor" id="NewPwdDescription"></input>
        <button onClick={() => {
            if (document.getElementById("NewPwdDescription").value == null) {
                alert("enter a description first")
                return;
            }
            const { fullseq, pwd } = PwdObfuscated();
            console.log(fullseq, pwd);
            setFullpwdseq(fullseq)
            request_add(pwd, fullseq)
        }}>
            Add Pin secret
        </button>
        <button onClick={() => {
            if (document.getElementById("NewPwdDescription").value == null) {
                alert("enter a description first")
                return
            }
            const pwd = generatePwd();
            const fullseq = pwd;
            console.log(fullseq, pwd);
            fullpwdseq.current = fullseq;
            request_add(pwd, fullseq)
        }}>
            Add Password secret
        </button>
        <br></br>
        <button onClick={() => setShowing(!showing())}>
            Start Entering (again ?)
        </button>
        <br></br>
        <Show when={showing() == true && backendstored() == true} fallback={"no showing"}>
            <PwdCharacter/>
        </Show>
    </>
}

// description -> click add button -> PwdObfuscate() + send_to_backend -> start showing -> render pwdcreate 

export function PwdCharacter() {
    const [index, setIndex] = createSignal(0)
    const [char, setChar] = createSignal();
    function nextClick() {
        setIndex(index() + 1)
        if (index() >= pwdseq.length) {
            setChar("Finished")
        }
        console.log(index())
        console.log(pwdseq().at(index() - 1))
        setChar(fullpwdseq().at(index() - 1))
    }
    return <div id="PWDCHAR" style={{
        "marginTop": "10px",
    }}>
        <Show when={char() != null} fallback={null}>
            <h1>char()</h1>
        </Show>
        <button onClick={nextClick}> Next</button>
    </div>
}

export function PwdObfuscated() {
    let digcount = 4
    let pwd = generatePin(digcount).toString()
    console.log("EXECUTING")
    // console.log(pwd);
    let fullseq = "";
    for (let i = 1; i <= digcount; ++i) {
        let str = genBalSeq(10, digcount - i + 1);
        console.log(str)
        let old = null;
        for (let j = 1; j <= str.length; ++j) if (str[j - 1] == '-') {
            fullseq += str[j - 1];
            old = null;
        } else {
            const tmpchar = genUnique(old).toString();
            old = tmpchar;
            fullseq += tmpchar;
        }
        fullseq += pwd[i - 1];
    }
    // console.log(fullseq)
    // console.log("line 41: " + fullseq);
    return { fullseq, pwd }
}

function request_add(pwd, fullseq) {
    fetch("https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/updates",
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
    ).then((response) => {
        if (response.ok) {
            setBackendstored(true)
            alert("Secret stored. You can start entering now")
        } else {
            setBackendstored(false)
            alert("Could not store secret. Login and try again")
        }
    }).catch(() => setBackendstored(false))
}

function genUnique(old) {
    let cur = old;
    while (cur == old) {
        cur = random.int(0, 9)
    }
    return cur
}