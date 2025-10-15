function DotHelp() {
    this.ns = "http://www.w3.org/2000/svg";
    this.black = "#424242";
    this.white = "#FFFFFF";
    return this;
}

DotHelp.prototype.draw = function(st = "") {
    const svg = this.base();
    //
    const [deprefixed, prefix] = im.deprefix(st);
    const keys = deprefixed.split("").map((s) => kbdqwerty.indexOf(s)); // array of 0..39 or -1
    const kbd = new Array(40);
    let ifw = false;
    let st1 = this.st1;
    let st2 = this.st2;
    let st3 = this.st3;
    let st4 = this.st4;
    let stw = this.stw;
    let stx = this.stx;
    switch (prefix) {
    case "■": st1 = this.sta1; st2 = this.sta2; stw = this.staw; break;
    case "▲": st1 = this.str; stw = this.str; break;
    case "▽": st1 = this.stl; stw = this.stl; break;
    case "☆": st1 = this.stwhite; stw = this.stwhite; break;
    case "★": st1 = this.stblack; stw = this.stblack; break;
    default: break;
    }
    keys.forEach((k, n) => {
        if (k < 0 || 40 <= k) { return; }
        if (kbd[k] !== undefined) {
            if (ifw) { kbd[k] = stx; }
            else { ifw = true; kbd[k] = stw; }
        } else {
            switch (n) {
            case 0: kbd[k] = st1; break;
            case 1: kbd[k] = st2; break;
            case 2: kbd[k] = st3; break;
            default: kbd[k] = st4; break;
            }
        }
    });
    // kbd.forEach((fn, k) => { if (fn) { svg.appendChild(fn(k)); } });
    kbd.forEach((fn, k) => { if (fn) { this.fn = fn; svg.appendChild(this.fn(k)); } });
    return svg;
}

DotHelp.prototype.xy = function(k, d = {x: 0, y: 0}) {
    const i = k % 10;
    const j = Math.floor(k / 10);
    return [i * 10 + 5 + d.x, j * 10 + 5 + d.y];
}

DotHelp.prototype.base = function() {
    const svg = document.createElementNS(this.ns, "svg");
    svg.setAttributeNS(null, "viewBox", "0 0 100 40");
    svg.setAttributeNS(null, "width", "100");
    svg.setAttributeNS(null, "height", "40");
    for (let k = 0; k < 40; k++) {
        const i = k % 10;
        const j = Math.floor(k / 10);
        if (j === 0 || i === 4 || i === 5) { continue; }
        const [x, y] = this.xy(k);
        const dot = document.createElementNS(this.ns, "rect");
        dot.setAttributeNS(null, "x", x - 1);
        dot.setAttributeNS(null, "y", y - 1);
        dot.setAttributeNS(null, "width", 2);
        dot.setAttributeNS(null, "height", 2);
        dot.setAttributeNS(null, "fill", this.black);
        svg.appendChild(dot);
    }
    return svg;
}

DotHelp.prototype.st1 = function(k) {
    const [x, y] = this.xy(k);
    const r = 4 - 0.25;
    const dot = document.createElementNS(this.ns, "circle");
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.setAttributeNS(null, "r", r);
    dot.setAttributeNS(null, "fill", this.black);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.st2 = function(k) {
    const [x, y] = this.xy(k);
    const r = 4 - 0.25;
    const dot = document.createElementNS(this.ns, "circle");
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.setAttributeNS(null, "r", r);
    dot.setAttributeNS(null, "fill", this.white);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.st3 = function(k) {
    const [x, y] = this.xy(k, {x: 0, y: 1.5});
    let points = new Array();
    const r = 4;
    const t = 2 * Math.PI / 3;
    for (let n = 0; n < 3; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        points.push(x1);
        points.push(y1);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.white);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.st4 = function(k) {
    const [x, y] = this.xy(k);
    let points = new Array();
    const r = 4 - 0.25;
    const t = 2 * Math.PI / 4;
    for (let n = 0; n < 4; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        points.push(x1);
        points.push(y1);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.white);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.stw = function(k) {
    const [x, y] = this.xy(k);
    const r = 4 - 0.25;
    const s = 2 - 0.75;
    const dot = document.createElementNS(this.ns, "circle");
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.setAttributeNS(null, "r", r);
    dot.setAttributeNS(null, "fill", this.white);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    const dot2 = document.createElementNS(this.ns, "circle");
    dot2.setAttributeNS(null, "cx", x);
    dot2.setAttributeNS(null, "cy", y);
    dot2.setAttributeNS(null, "r", s);
    dot2.setAttributeNS(null, "fill", this.black);
    dot2.setAttributeNS(null, "stroke", this.black);
    dot2.setAttributeNS(null, "stroke-width", "1");
    const g = document.createElementNS(this.ns, "g");
    g.appendChild(dot);
    g.appendChild(dot2)
    return g;
}

DotHelp.prototype.stx = function(k) {
    const [x, y] = this.xy(k);
    let points = new Array();
    const r = 4 + 0.5;
    const s = 4 - 2.25;
    const t = 2 * Math.PI / 5;
    const u = Math.PI / 5;
    for (let n = 0; n < 5; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        points.push(x1);
        points.push(y1);
        const x2 = s * Math.cos(t * n + u - Math.PI / 2) + x;
        const y2 = s * Math.sin(t * n + u - Math.PI / 2) + y;
        points.push(x2);
        points.push(y2);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.white);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.sta1 = function(k) {
    const [x, y] = this.xy(k);
    let points = new Array();
    const r = 4 + 0.95;
    const t = 2 * Math.PI / 4;
    for (let n = 0; n < 4; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 4) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 4) + y;
        points.push(x1);
        points.push(y1);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.black);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.sta2 = function(k) {
    const [x, y] = this.xy(k);
    let points = new Array();
    const r = 4 + 0.95;
    const t = 2 * Math.PI / 4;
    for (let n = 0; n < 4; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 4) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 4) + y;
        points.push(x1);
        points.push(y1);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.white);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.staw = function(k) {
    const [x, y] = this.xy(k);
    let points = new Array();
    const r = 4 + 0.95;
    const s = 2 + 0.12;
    const t = 2 * Math.PI / 4;
    for (let n = 0; n < 4; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 4) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 4) + y;
        points.push(x1);
        points.push(y1);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.white);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    //
    points.length = 0;
    for (let n = 0; n < 4; n++) {
        const x1 = s * Math.cos(t * n - Math.PI / 4) + x;
        const y1 = s * Math.sin(t * n - Math.PI / 4) + y;
        points.push(x1);
        points.push(y1);
    }
    const dot2 = document.createElementNS(this.ns, "polygon");
    dot2.setAttributeNS(null, "points", points.join(" "));
    dot2.setAttributeNS(null, "fill", this.white);
    dot2.setAttributeNS(null, "stroke", this.black);
    dot2.setAttributeNS(null, "stroke-width", "1");
    const g = document.createElementNS(this.ns, "g");
    //
    g.appendChild(dot);
    g.appendChild(dot2)
    return g;
}

DotHelp.prototype.stl = function(k) {
    const [x, y] = this.xy(k, {x: 0, y: -0.5});
    let points = new Array();
    const r = 4;
    const t = 2 * Math.PI / 3;
    for (let n = 0; n < 3; n++) {
        const x1 = r * Math.cos(t * n + Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n + Math.PI / 2) + y;
        points.push(x1);
        points.push(y1);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.white);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.str = function(k) {
    const [x, y] = this.xy(k, {x: 0, y: 1.5});
    let points = new Array();
    const r = 4;
    const t = 2 * Math.PI / 3;
    for (let n = 0; n < 3; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        points.push(x1);
        points.push(y1);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.black);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}

DotHelp.prototype.stwhite = function(k) {
    return this.stx(k);
}

DotHelp.prototype.stblack = function(k) {
    const [x, y] = this.xy(k);
    let points = new Array();
    const r = 4 + 0.5;
    const s = 4 - 2.25;
    const t = 2 * Math.PI / 5;
    const u = Math.PI / 5;
    for (let n = 0; n < 5; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        points.push(x1);
        points.push(y1);
        const x2 = s * Math.cos(t * n + u - Math.PI / 2) + x;
        const y2 = s * Math.sin(t * n + u - Math.PI / 2) + y;
        points.push(x2);
        points.push(y2);
    }
    const dot = document.createElementNS(this.ns, "polygon");
    dot.setAttributeNS(null, "points", points.join(" "));
    dot.setAttributeNS(null, "fill", this.black);
    dot.setAttributeNS(null, "stroke", this.black);
    dot.setAttributeNS(null, "stroke-width", "1");
    return dot;
}
