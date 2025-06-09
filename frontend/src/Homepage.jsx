import { useEffect, useState } from "react";
import PwdCharacter from "./pwdobfsct";
import AddSecret from "./pwdobfsct";
export default function Homepage() {
    const [info, setInfo] = useState([]);

    useEffect(() => {
        console.log(info);
    }, [info])

    const listItems = () => {
        return info.map((e) => {
            return <Secret information={e} key={e.description} />
        })
    }

    return <div id="HOMEPAGE">
        <button onClick={() => request_getinfo(setInfo)}>
            Getinfo
        </button>
        <br></br>
        {info ? listItems() : "information will appear here"}
        <br></br>
        <AddSecret></AddSecret>
    </div>
}

function request_getinfo(setInfo) {
    console.log(localStorage.getItem("email"));
    fetch("https://ftma4qavj6awolg4msi5i7qktm0cjhxk.lambda-url.eu-north-1.on.aws/getinfo", {
        method: "POST",
        body: JSON.stringify({
            "email": localStorage.getItem("email"),
        }),
        credentials: "include",
    }).then((response) => {
        console.log(response.status)
        console.log(response.ok);
        if (response.ok) {
            alert("Info retrieved succesfully")
            return response.json();
        } else {
            alert("Could not retrieve info. Login and try again")
        }
    }).then((response) => {
        if (response) {
            console.log(response)
            setInfo(() => {
                console.log("setting info");
                console.log(response.userdata);
                console.log(response.userdata[0].description);
                return response.userdata;
            })
        }
    })
}

function Secret({ information, key }) {
    return <div className="SECRETS" style={{
        "border": "solid 1px thistle",
        "borderRadius": "8px",
        "margin": "10px",
        "padding": "4px",
        "boxShadow": "2px 4px 5px -1px rgba(0,0,0,0.9)"
    }}>
        <h3>Description: {information.description}</h3>
        <br></br>
        Time: {(new Date(information.epochTime)).toString()},
        <br></br>
        Cooldown Hours: {information.cooldownHours},
        <br></br>
        secret: {information.pwdhash}
        <br></br>

        <button onClick={() => update_request(information.description, "reveal")}>
            Register reveal request
        </button>
        <button onClick={() => {
            var response = prompt(`Do you really want to delete ${information.description} ? (Y/N)`)
            response = response.toLowerCase()
            if (response[0] == 'y')
                update_request(information.description, "delete")
            else
                alert("delete request omitted.")
        }}>
            Request deletion
        </button>
    </div>
}

function update_request(description, action_clause) {
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

