const kbdqwerty =
      "1234567890qwertyuiopasdfghjkl;zxcvbnm,./-=\\`[]'" +
      '!@#$%^&*()QWERTYUIOPASDFGHJKL:ZXCVBNM<>?_+|~{}"';
const kbddvorak =
      "1234567890',.pyfgcrlaoeuidhtns;qjkxbmwvz[]\\`/=-" +
      '!@#$%^&*()"<>PYFGCRLAOEUIDHTNS:QJKXBMWVZ{}|~?+_';


const todvorakmap = new Object();
const fromdvorakmap = new Object();

for (let k = 0; k < kbdqwerty.length; k++) {
    todvorakmap[kbdqwerty[k]] = kbddvorak[k];
    fromdvorakmap[kbddvorak[k]] = kbdqwerty[k];
}

function todvorak(str) {
    return str.split('').map((ch) => todvorakmap[ch] ?? ch).join('')
}

function fromdvorak(str) {
    return str.split('').map((ch) => fromdvorakmap[ch] ?? ch).join('')
}
