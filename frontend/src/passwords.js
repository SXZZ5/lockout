import random from "random";
function generatePin(pinlen = 4) {
    const minlim = 10 ** (pinlen - 1);
    const maxlim = (10 ** pinlen) - 1;
    return random.int(minlim, maxlim)
}

function generatePwd(pwdlen = 30) {
    var res = "";
    for (let i = 1; i <= pwdlen; ++i) {
        res += String.fromCharCode(random.int(97, 122));
    }
    return res;
}

function genBalSeq(fixedlen, maxallowedlen) {
    console.log("genBalSeq: fixedlen: ", fixedlen, ", maxallowedlen: ", maxallowedlen);
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
        if (validatesum < 0) throw Error("validatesum is less than zero in balseq")
    }

    okay = okay && (validatesum == 0);
    if (validatesum != 0) throw Error("validatesum is not zero at the end of bal-sequence")
    if (!okay) {
        alert("DONT'T USE THE APP and THIS PWD. INFORM ADMIN IMMEDIATELY")
        return null;
    } else {
        return str;
    }
}

function pwdObfuscated(digcount = Number(4)) {
    let pwd = generatePin(digcount).toString()
    console.log("EXECUTING")
    console.log(pwd);
    let fullseq = "";
    let len = 0;
    for (let i = 1; i <= digcount - 1; ++i) {
        let str = genBalSeq(10, digcount - i);
        console.log(str)
        let old = null;
        for (let j = 1; j <= str.length; ++j) if (str[j - 1] == '-') {
            len -= 1;
            fullseq += str[j - 1];
            old = null;
        } else {
            const tmpchar = genUnique(old).toString();
            old = tmpchar;
            fullseq += tmpchar;
            len += 1;
        }
        if (len == 3) {
            fullseq += '-';
            len -= 1;
        }
        fullseq += pwd[i - 1];
        len += 1;
    }
    fullseq += pwd.at(pwd.length - 1);

    try {
        PinUnitTests(fullseq, pwd);
    } catch (err) {
        alert("DONT'T USE THE APP and THIS PWD. INFORM ADMIN IMMEDIATELY")
        console.log(fullseq);
        console.log(err);
        throw Error("App generated bad password")
    }
    return { fullseq, pwd }
}


function genUnique(old) {
    let cur = old;
    while (cur == old) {
        cur = random.int(0, 9)
    }
    return cur
}

function PinUnitTests(fullsequence, pwd, digcount = 4) {
    console.log("digcount type", typeof(digcount))
    let len = 0;
    let resultantstring = ""
    for (let i = 0; i < fullsequence.length; ++i) {
        if (fullsequence[i] === '-') {
            len -= 1;
            resultantstring = resultantstring.slice(0, -1)
        }
        else {
            len += 1;
            resultantstring += fullsequence[i]
        }
        console.log(i, resultantstring, len)
        if (len < 0) {
            throw Error("Length became negative at some point")
        }
        if (i != (fullsequence.length - 1) && len >= digcount) {
            throw Error("Reached full digcount length before last character")
        }
        if (i == (fullsequence.length - 1) && len !== digcount) {
            throw Error("String does not converge to a digcount length")
        }
    }

    if (resultantstring !== pwd.toString()) {
        throw Error("Resultant ofuscated string does not reproduce the password")
    }
}

function stressTest(count) {
    console.log("starting stress test with count: ", count)
    for (let i = 1; i <= count; ++i) {
        console.log("--------------------- TEST: ", i, "-----------------------")
        let pwdgenerated = pwdObfuscated()
        if (!PinUnitTests(pwdgenerated)) {
            console.log("STOPPING... PROGRAM FAILED");
            break;
        }
    }
}

// stressTest(10000)

export { generatePin, genBalSeq, generatePwd, pwdObfuscated }


// 8372--7--735--0-2-3-18-8-4-9-6--4