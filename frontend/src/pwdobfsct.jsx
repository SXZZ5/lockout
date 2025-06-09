import { useState, useRef } from "react";
import { genBalSeq, generatePin } from "./passwords";
import random from "random"
export default function AddSecret() {
    const [showing, setShowing] = useState(false);
    const [backendstored, setBackendstored] = useState(false);
    const fullpwdseq = useRef(null);
    return <>
        <input type="text" placeholder="Enter descriptor" id="NewPwdDescription"></input>
        <button onClick={() => {
            if(document.getElementById("NewPwdDescription").value == null) {
                alert("enter a description first")
                return
            }
            const {fullseq, pwd}= PwdObfuscated();
            console.log(fullseq, pwd);
            fullpwdseq.current = fullseq;
            request_add(pwd,setBackendstored)
        }}>
            Add secret
        </button>
        <br></br>
        <button onClick={() => setShowing((prev) => !prev)}>
            Start Entering (again ?)
        </button>
        <br></br>
        {((showing == true) && (backendstored == true)) ? <PwdCharacter fullseq={fullpwdseq.current}/> : "not showing"}
    </>
}

// description -> click add button -> PwdObfuscate() + send_to_backend -> start showing -> render pwdcreate 

export function PwdCharacter({fullseq}) {
    // const pwdseq = useRef("lund");
    const pwdseq = useRef(fullseq);
    console.log(pwdseq);
    const index = useRef(0);
    const [char, setChar] = useState();
    function nextClick() {
        index.current = index.current + 1;
        if (index.current >= pwdseq.length) {
            setChar(() => ("Finished"))
        }
        console.log(index.current)
        console.log(pwdseq.current.at(index.current-1))
        setChar((prev) => pwdseq.current.at(index.current - 1))
    }
    return <div id="PWDCHAR" style={{
        "marginTop": "10px",
    }}>
        {char ? <h1>{char}</h1> : null}
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
        let str = genBalSeq(10,digcount-i+1);
        console.log(str)
        let old = null;
        for (let j = 1; j <= str.length; ++j) if(str[j-1] == '-') {
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
    return {fullseq, pwd}
}

function request_add(pwd, setBackendstored) {
    fetch("https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/updates",
        {
            "method" : "POST",
            credentials: "include",
            body: JSON.stringify({
                "email": localStorage.getItem("email"),
                "action": {
                    "clause": "create",
                    "description": document.getElementById("NewPwdDescription").value,
                    "zkpwdhash": pwd,
                }
            })
        }
    ).then((response) => {
        if(response.ok) {
            setBackendstored(() => true)
            alert("Secret stored. You can start entering now")
        } else {
            setBackendstored(() => false)
            alert("Could not store secret. Login and try again")
        }
    }).catch(() => setBackendstored(() => false))
}

function genUnique(old) {
    let cur = old;
    while(cur == old) {
        cur = random.int(0,9)
    }
    return cur
}