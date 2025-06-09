function deriveKey() {
    // get user password and derive a key from it. 
    const masterpwd = prompt("Enter master password");
    masterpwd.normalize();
    const encoder = new TextEncoder();
    const data = encoder.encode(masterpwd);
    window.crypto.subtle.digest("SHA-256", data).then((result) => {
        console.log(result);
        alert(result)
    }).catch((error) => {
        console.log("error" + error);
    })
}

export { deriveKey }