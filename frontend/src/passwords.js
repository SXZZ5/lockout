import random from "random";
function generatePin(pinlen = 4) {
    const minlim = 10 ** (pinlen - 1);
    const maxlim = (10 ** pinlen) - 1;
    return random.int(minlim, maxlim)
}

function generatePwd(pwdlen = 30){
    var res = "";
    for(let i=1; i<=pwdlen; ++i){
        res += String.fromCharCode(random.int(97,122));
    }
    return res;
}

function genBalSeq(fixedlen, maxallowedlen) {
    console.assert(fixedlen % 2 == 0)
    let sum = 0, rounds = 1;
    let str = "";
    while (rounds <= fixedlen) {
        if (rounds === 1) {
            console.assert(sum === 0);
        }
        const val = random.boolean()
        if (val) {
            
            if (sum === maxallowedlen) {
                str += "-";
                sum -= 1;
            } else {
                str += "+";
                sum += 1;
            }
        }
        else {
            if (sum === 0) continue;
            str += "-";
            sum -= 1;
        }
        if (sum >= (fixedlen - rounds)) break;
        rounds++;
    }
    console.log("genBalSeq: after while loop", str)

    for (let i = 1; i <= (fixedlen - rounds); ++i) {
        const val = random.boolean();
        if (val) {
            str += "-";
        } else {
            let newstr = "";
            let stack = [];
            for (let j = 1; j <= str.length; ++j) if (str[j - 1] == '+') {
                stack.push(j);
            } else {
                stack.pop();
            }

            const lim = stack.at(stack.length - 1);
            for (let j = 1; j <= str.length; ++j) {
                newstr += str[j - 1];
                if (j == lim) newstr += "-";
            }
            str = newstr;
        }
    }
    console.log("genBalSeq: after for loop: ", str);

    let validatesum = 0;
    let okay = true;
    for (let i = 1; i <= str.length; ++i) {
        if (str[i - 1] == '+') validatesum += 1;
        else validatesum -= 1;
        okay = okay && (validatesum >= 0);
    }
    okay = okay && (validatesum == 0);
    if (!okay) {
        alert("DONT'T USE THE APP and THIS PWD. INFORM ADMIN IMMEDIATELY")
        return null;
    } else {
        return str;
    }
}

function pwdObfuscated() {
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


function genUnique(old) {
    let cur = old;
    while (cur == old) {
        cur = random.int(0, 9)
    }
    return cur
}

export { generatePin, genBalSeq, generatePwd, pwdObfuscated as PwdObfuscated }