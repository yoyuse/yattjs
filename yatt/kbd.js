const kbdqwerty =
      "1234567890qwertyuiopasdfghjkl;zxcvbnm,./-=\\`[]'" +
      '!@#$%^&*()QWERTYUIOPASDFGHJKL:ZXCVBNM<>?_+|~{}"';
const kbddvorak =
      "1234567890',.pyfgcrlaoeuidhtns;qjkxbmwvz[]\\`/=-" +
      '!@#$%^&*()"<>PYFGCRLAOEUIDHTNS:QJKXBMWVZ{}|~?+_';


const todvorakmap = new Map();
const fromdvorakmap = new Map();

for (let k = 0; k < kbdqwerty.length; k++) {
    todvorakmap.set(kbdqwerty[k], kbddvorak[k]);
    fromdvorakmap.set(kbddvorak[k], kbdqwerty[k]);
}

function todvorak(str) {
    return str.split('').map((ch) => todvorakmap.get(ch) ?? ch).join('')
}

function fromdvorak(str) {
    return str.split('').map((ch) => fromdvorakmap.get(ch) ?? ch).join('')
}
