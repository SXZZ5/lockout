import { useState } from "react";

export default function Logsign() {
    const [status, setStatus] = useState("Welcome.");
    var style = {
        "width": "200px"
    }
    return <div id="LOGSIGN" style={style}>
        Email:
        <div
            id="emailfield"
            contentEditable="true"
            style={{
                "border": "solid 2px thistle",
                "borderRadius": "5px"

            }}></div>
        Password:
        <div
            id="passwordfield"
            contentEditable="true"
            style={{
                "border": "solid 2px thistle",
                "borderRadius": "5px"

            }}></div>
        <button onClick={()=>clickLogin(setStatus)}>
            Login
        </button>
        <div id="Login_statusinfo">
            {status}
        </div>
    </div>
}

function clickLogin(setStatus) {
    const email = document.getElementById("emailfield").innerText;
    const password = document.getElementById("passwordfield").innerText;

    console.log(email, password);
    console.log(JSON.stringify({
        email: email,
        password: password,
    }))

    const endpoint = "https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/login"

    fetch(endpoint, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            email: email,
            password: password,
        })
    }).then((response) => {
        console.log(response.status);
        if(response.ok) {
            localStorage.setItem("email", email);
            alert("Login succesful")
        } else {
            alert("Login failed")
        }
        return response.text();
    }).then((textstring) => {
        console.log(textstring);
        setStatus(textstring);
    })

}