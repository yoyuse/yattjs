// yatt cookie format
//   yatt= im=t:certain=certain-empty:uncertain=uncertain-t: ;
//   expires= Wed, 08-Jun-2005 15:56:25 GMT

function Cookie(name) {
    this.name = name;
    this.content = new Map();
    return this;
}

Cookie.prototype.read = function() {
    const ck = document.cookie;
    const re = new RegExp(this.name + "=([^;]+);"); // XXX escape name?
    let m = (ck + ';').match(re);
    this.content.clear();
    if (m) {
        const a = decodeURIComponent(m[1]).split(':');
        for (let i = 0; i < a.length; i++) {
            if (a[i] == '') { continue; } // such as last case?
            m = a[i].match(/([^=]+)=(.*)/);
            if (m) {
                this.content.set(m[1], m[2]);
            }
        }
    }
    return this;
}

Cookie.prototype.set = function(key, val) {
    this.content.set(key, val);
    return this;
}

Cookie.prototype.get = function(key) {
    return this.content.get(key);
}

Cookie.prototype.write = function() {
    let s = '';
    for (const [key, val] of this.content) { s += `${key}=${val}:`; }
    s = this.name + '=' + encodeURIComponent(s) + ';';
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1); // expires to 1 year
    s += 'expires=' + d.toGMTString() + ';';
    document.cookie = s;
}

Cookie.prototype.remove = function() {
    const d = new Date();
    d.setTime(0);                       // 1970-01-01 00:00:00
    const s = this.name + '=;expires=' + d.toGMTString() + ';';
    document.cookie = s;
}

Cookie.prototype.showcontent = function() {
    let s = '';
    for (const [key, val] of this.content) { s += `${key}=${val}:`}
    return s;
}
