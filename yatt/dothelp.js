function DotHelp() {
    this.black = "#424242";
    this.white = "#FFFFFF";
    return this;
}

DotHelp.prototype.draw = function(st = "") {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    //
    // - Window: devicePixelRatio プロパティ - Web API | MDN
    // - https://developer.mozilla.org/ja/docs/Web/API/Window/devicePixelRatio
    const width = 100;
    const height = 40;
    //
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    //
    const scale = window.devicePixelRatio;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    //
    ctx.scale(scale, scale);
    //
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 10; i++) {
            if (0 < j && i !== 4 && i !== 5) {
                this.dot(ctx, i, j);
            }
        }
    }
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
    //
    // kbd.forEach((fn, k) => { if (fn) { fn(ctx, k); } });
    kbd.forEach((fn, k) => { if (fn) { this.fn = fn; this.fn(ctx, k); } });
    //
    return canvas;
}

DotHelp.prototype.dot = function(ctx, i, j) {
    const x = i * 10 + 5 - 1;
    const y = j * 10 + 5 - 1;
    ctx.fillStyle = this.black;
    ctx.fillRect(x, y, 2, 2);
}

DotHelp.prototype.st1 = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 - 0.25;
    ctx.fillStyle = this.black;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.st2 = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 - 0.25;
    ctx.fillStyle = this.white;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.st3 = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5 + 1.5;
    const r = 4;
    const t = 2 * Math.PI / 3;
    ctx.fillStyle = this.white;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    for (let n = 0; n < 3; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.st4 = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 - 0.25;
    ctx.fillStyle = this.white;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x - r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.stw = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 - 0.25;
    ctx.fillStyle = this.white;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    //
    const r_inner = 2 - 0.75;
    ctx.fillStyle = this.black;
    ctx.beginPath();
    ctx.arc(x, y, r_inner, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.stx = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.5;
    const s = 4 - 2.25;
    const t = 2 * Math.PI / 5;
    const u = Math.PI / 5;
    ctx.fillStyle = this.white;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    for (let n = 0; n < 5; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
        const x2 = s * Math.cos(t * n + u - Math.PI / 2) + x;
        const y2 = s * Math.sin(t * n + u - Math.PI / 2) + y;
        ctx.lineTo(x2, y2);
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.sta1 = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.95;
    const t = 2 * Math.PI / 4;
    ctx.fillStyle = this.black;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    for (let n = 0; n < 4; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 4) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 4) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.sta2 = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.95;
    const t = 2 * Math.PI / 4;
    ctx.fillStyle = this.white;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    for (let n = 0; n < 4; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 4) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 4) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.staw = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.95;
    const t = 2 * Math.PI / 4;
    ctx.fillStyle = this.white;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    for (let n = 0; n < 4; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 4) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 4) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    //
    const r_inner = 2 + 0.12;
    ctx.beginPath();
    for (let n = 0; n < 4; n++) {
        const x1 = r_inner * Math.cos(t * n - Math.PI / 4) + x;
        const y1 = r_inner * Math.sin(t * n - Math.PI / 4) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.stl = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5 - 0.5;
    const r = 4;
    const t = 2 * Math.PI / 3;
    ctx.fillStyle = this.white;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    for (let n = 0; n < 3; n++) {
        const x1 = r * Math.cos(t * n + Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n + Math.PI / 2) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.str = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5 + 1.5;
    const r = 4;
    const t = 2 * Math.PI / 3;
    ctx.fillStyle = this.black;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    for (let n = 0; n < 3; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

DotHelp.prototype.stwhite = function(ctx, k) {
    this.stx(ctx, k);
    // DotHelp.prototype.stx(ctx, k);
}

DotHelp.prototype.stblack = function(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.5;
    const s = 4 - 2.25;
    const t = 2 * Math.PI / 5;
    const u = Math.PI / 5;
    ctx.fillStyle = this.black;
    ctx.strokeStyle = this.black;
    ctx.beginPath();
    for (let n = 0; n < 5; n++) {
        const x1 = r * Math.cos(t * n - Math.PI / 2) + x;
        const y1 = r * Math.sin(t * n - Math.PI / 2) + y;
        if (n === 0) { ctx.moveTo(x1, y1); }
        else { ctx.lineTo(x1, y1); }
        const x2 = s * Math.cos(t * n + u - Math.PI / 2) + x;
        const y2 = s * Math.sin(t * n + u - Math.PI / 2) + y;
        ctx.lineTo(x2, y2);
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}
