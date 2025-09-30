function dothelp(st = "") {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    //
    canvas.width = 100;
    canvas.height = 40;
    //
    // ctx.fillStyle = "#F5F5F5";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    //
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 10; i++) {
            if (0 < j && i !== 4 && i !== 5) {
                put_dot(ctx, i, j);
            }
        }
    }
    //
    const [deprefixed, prefix] = im.deprefix(st);
    const keys = deprefixed.split("").map((s) => "1234567890qwertyuiopasdfghjkl;zxcvbnm,./".indexOf(s)); // array of 0..39 or -1
    const kbd = new Array(40);
    let ifw = false;
    let st1 = put_st1;
    let st2 = put_st2;
    let st3 = put_st3;
    let st4 = put_st4;
    let stw = put_stw;
    let stx = put_stx;
    switch (prefix) {
    case "■": st1 = put_sta1; st2 = put_sta2; stw = put_staw; break;
    case "▲": st1 = put_str; stw = put_str; break;
    case "▽": st1 = put_stl; stw = put_stl; break;
    case "☆": st1 = put_stwhite; stw = put_stwhite; break;
    case "★": st1 = put_stblack; stw = put_stblack; break;
    default: break;
    }
    keys.forEach((k, n) => {
        if (k < 0) { return; }
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
    kbd.forEach((fn, n) => { if (fn) { fn(ctx, n); } });
    //
    return canvas;
}

function put_dot(ctx, i, j) {
    const x = i * 10 + 5 - 1;
    const y = j * 10 + 5 - 1;
    ctx.fillStyle = "#424242";
    ctx.fillRect(x, y, 2, 2);
}

function put_st1(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 - 0.25;
    ctx.fillStyle = "#424242";
    ctx.strokeStyle = "#424242";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function put_st2(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 - 0.25;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#424242";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function put_st3(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5 + 1.5;
    const r = 4;
    const t = 2 * Math.PI / 3;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#424242";
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

function put_st4(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 - 0.25;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#424242";
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x - r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function put_stw(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 - 0.25;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#424242";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    //
    const r_inner = 2 - 0.75;
    ctx.fillStyle = "#424242";
    ctx.beginPath();
    ctx.arc(x, y, r_inner, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function put_stx(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.5;
    const s = 4 - 2.25;
    const t = 2 * Math.PI / 5;
    const u = Math.PI / 5;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#424242";
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

function put_sta1(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.95;
    const t = 2 * Math.PI / 4;
    ctx.fillStyle = "#424242";
    ctx.strokeStyle = "#424242";
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

function put_sta2(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.95;
    const t = 2 * Math.PI / 4;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#424242";
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

function put_staw(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.95;
    const t = 2 * Math.PI / 4;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#424242";
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

function put_stl(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5 - 0.5;
    const r = 4;
    const t = 2 * Math.PI / 3;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#424242";
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

function put_str(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5 + 1.5;
    const r = 4;
    const t = 2 * Math.PI / 3;
    ctx.fillStyle = "#424242";
    ctx.strokeStyle = "#424242";
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

function put_stwhite(ctx, k) {
    put_stx(ctx, k);
}

function put_stblack(ctx, k) {
    const i = k % 10; const x = i * 10 + 5;
    const j = Math.floor(k / 10); const y = j * 10 + 5;
    const r = 4 + 0.5;
    const s = 4 - 2.25;
    const t = 2 * Math.PI / 5;
    const u = Math.PI / 5;
    ctx.fillStyle = "#424242";
    ctx.strokeStyle = "#424242";
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
