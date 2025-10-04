const nbsp = "\u00a0";
const stdout_size = 10;
let stdin = null;
let stdout = null;
let stdhelp = null;

let im = null;
// let book = null;
let certain = null;
let uncertain = null;
let pattern = /^$/;
let words_for_ch = new Object();
let words_count_for_ch = new Object();

let lessons;
let lesson = null;
let lesson_index = null;
let text = null;
let text_index = null;

const cookie_name = "yatt";
const cookie = new Cookie(cookie_name);

let ifdvorak = false;
let help_style = "dothelp";
let helps = new Array();
let repeat_mode = false;
let ifkana = false;
const kanachars = `
々ー
ぁあぃいぅうぇえぉお かがきぎくぐけげこご さざしじすずせぜそぞ
ただちぢっつづてでとど なにぬねの はばぱひびぴふぶぷへべぺほぼぽ
まみむめも ゃやゅゆょよ らりるれろ ゎわゐゑを ん
ァアィイゥウェエォオ カガキギクグケゲコゴ サザシジスズセゼソゾ
タダチヂッツヅテデトド ナニヌネノ ハバパヒビピフブプヘベペホボポ
マミムメモ ャヤュユョヨ ラリルレロ ヮワヰヱヲ ン ヴヵヶ
`.trim().split(/\s*/);
let certain_chars = null;

let prompting = false;

let time = null;                // total time
let stall = null;               // strokes all
let stcor = null;               // strokes correct
let sterr = null;               // strokes error
let stquest = null;             // strokes question
let lstime = null;              // lesson time
let lstimebeg = null;           // lesson time begin
let lstimeend = null;           // lesson time end
let lsstall = null;             // lesson strokes all
let lsstcor = null;             // lesson strokes corrrect
let lssterr = null;             // lesson strokes error
let lsstquest = null;           // lesson strokes question
let lschweak = new Array();     // lesson chars weak
const lschtypo = new Array();   // lesson chars typo

// YATT
function make_pattern() {
    const str = certain_chars.concat(uncertain.chars).join('');
    pattern = new RegExp(`^[${RegExp.escape(str)}]+$`);
}

function read_words() {
    words_for_ch = new Object();
    words_count_for_ch = new Object();
    for (const word of words) {
        if (!pattern.test(word)) {continue;}
        word.split('').forEach((ch) => {
            if (words_for_ch[ch] === undefined) { words_for_ch[ch] = new Array; }
            words_for_ch[ch].push(word);
            if (words_count_for_ch[ch] === undefined) { words_count_for_ch[ch] = 0; }
            words_count_for_ch[ch] += 1;
        });
    }
}

function score(word, ch, used) {
    let score = 0;
    score -= Math.abs(2 - word.length); // 2 字熟語を優先
    score += word.split('').UNIQUED().filter((c0) => {
            return c0 !== ch && !used[c0] && !certain_chars.includes(c0);
        }).length;
    return score;
}

function stat(word_array) {
    let count = new Object;
    word_array.forEach((word) => {
        word.split('').forEach((ch) => {
            if (count[ch] === undefined) { count[ch] = 0; }
            count[ch] += 1;
        });
    });
    return count;
}

function reduce(word_array) {
    while(true) {
        const count = stat(word_array);
        let chs = "";
        for (const ch in count) { if (2 <= count[ch]) {chs += ch; } }
        const re = new RegExp(`^[${RegExp.escape(certain_chars.join("") + chs)}]+$`);
        const word = word_array.filter((w) => re.test(w)).SAMPLE();
        if (word === undefined) { return word_array; }
        word_array = word_array.filter((w) => w != word);
    }
}

function check(word_array) {
    const count = stat(word_array);
    let chs = "";
    for (const ch in count) { if (count[ch] === undefined) { chs += ch; } }
    console.log("check: " + (chs === "" ? "OK" : `FAILED: ${chs}`));
}

function yatt(rand_seed = 0) {
    // srand(rand_seed);
    // XXX: JS に srand はない…
    // - JavaScriptで再現性のある乱数を生成する + 指定した範囲の乱数を生成する
    // - https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/
    //
    let word_array = new Array;
    let used = new Object;
    //
    make_pattern();
    read_words();
    //
    // 非破壊的にソート
    const chars = Array.from(uncertain.chars).sort((a, b) => {
        const count_a = words_count_for_ch[a] || 0;
        const count_b = words_count_for_ch[b] || 0;
        return count_a - count_b;
    });
    //
    chars.forEach((ch) => {
        if (used[ch] !== undefined) { return; }
        const words = words_for_ch[ch] || [ch];
        const word = words.SHUFFLED().sort((a, b) => {
            return score(b, ch, used) - score(a, ch, used);
        })[0];
        //
        word_array.push(word);
        word.split('').forEach((ch) => { used[ch] = true; });
    });
    word_array = reduce(word_array);
    // this.check(word_array);
    return word_array;
}

/*
function do_yatt() {
    const nlines = 4;           // 1 レッスンあたりの行数
    const nwords = 6;           // 1 行あたりの語数
    let text = "";
    let line = 0;
    const word_array = yatt();
    const array = word_array.SHUFFLED();
    while (0 < array.length) {
        const words = new Array();
        [...Array(nwords)].map(() => words.push(array.shift()));
        text += words.filter((w) => w !== undefined).join(' ') + "\n";
        line += 1;
        if (0 < array.length && line % nlines === 0) { text += "\n"; }
    }
    // return text;
    // XXX
    const a = text.replace(/\n+$/, '') // XXX
          .split(/\n\n/);
    let i = 0;
    return a.map((lesson) => {
        i += 1;
        const text = lesson.split(/\n+/);
        return {name: `Lesson ${i}`, chars: "", text: text};
    });
}
*/

// - [Javascript] 一次元配列の要素をｎ個ずつに分割した新しい二次元配列を返す #JavaScript - Qiita
// - https://qiita.com/STSHISHO/items/e50b239927605114742d
// const chunk = (a, n) => a.flatMap((_, i, a) => i % n ? [] : [a.slice(i, i + n)]);
Array.prototype.CHUNK = function(n) {
    return this.flatMap((_, i, a) => i % n ? [] : [a.slice(i, i + n)]);
}

function do_yatt() {
    const nlines = 4;           // 1 レッスンあたりの行数
    const nwords = 6;           // 1 行あたりの語数
    return yatt().SHUFFLED().CHUNK(nwords).CHUNK(nlines).map((lesson, i) => ({name: `Lesson ${i + 1}`, chars: "", text: lesson.map((a) => a.join(' '))}));
}
// /YATT

function make_span(a, classList = []) {
    const span = document.createElement("span");
    for (const e of a) {
        const str = e.shift();
        const s = document.createElement("span");
        s.textContent = str;
        if (0 < e.length) { s.classList.add(...e); }
        span.appendChild(s);
    }
    if (0 < classList.length) { span.classList.add(...classList); }
    return span;
}

function make_help(ch, st) {
    const st_external = ifdvorak ? todvorak(st) : st;
    if (help_style === "dothelp") {
        const span = document.createElement("span");
        let s = document.createElement("span");
        s.textContent = ch;
        s.classList.add("ch");
        span.appendChild(s);
        s = document.createElement("span");
        s.classList.add("stroke");
        // XXX
        if (ch === st_external) { s.classList.add("outset"); }
        //
        s.title = st_external;
        s.appendChild(dothelp(st));
        span.appendChild(s);
        span.classList.add("help", "dothelp");
        return span;
    }
    // XXX
    if (ch === st_external) { return make_span([[ch, "ch"], [st_external, "stroke", "outset"]], ["help"]); }
    //
    return make_span([[ch, "ch"], [st_external, "stroke"]], ["help"]);
}

function do_help(append = false) {
    // clear help
    if (!append) {
        while (stdhelp.firstChild) { stdhelp.removeChild(stdhelp.firstChild); }
    }
    //
    for (const elm of helps) {
        if (elm[0] === " ") { continue; }
        stdhelp.appendChild(make_help(elm[0], elm[1]));
    }
    //
    // empty help
    if (!stdhelp.firstChild) { stdhelp.appendChild(make_span([[nbsp]])); }
}

function do_input_text(str, s) {
    lstimeend = (new Date()).getTime();
    lstime += lstimeend - lstimebeg;
    //
    // const r = im.encode2(str, ifdvorak);
    const r = im.encode2(ifdvorak ? fromdvorak(str) : str);
    //
    const m = lcs.match(r, s);
    lsstall += m.stall;
    lsstcor += m.stcor;
    lssterr += m.sterr;
    lsstquest += m.stquest;
    //
    return m;
}

function do_result(res) {
    const e = new Array();
    const acorr = new Array();
    const aerr = new Array();
    const atypo = new Array();
    for (const a of res) {
        if (a[0]) {
            // correct
            e.push([a[1]]);
            acorr.push(a[1]);
        } else {
            // typo
            e.push([a[2], "err"]);
            for (const a1 of a[1]) {
                atypo.push(a1);
                aerr.push(a1[0]);
            }
        }
    }
    //
    lschweak = lschweak.filter((ch) => !acorr.includes(ch));
    aerr.forEach((ch) => {
        if (!lschweak.includes(ch)) { lschweak.push(ch); }
    });
    //
    for (const typo of atypo) { lschtypo.push(typo); }
    helps = atypo;
    do_help();
    //
    pute(make_span(e, ["usr"]));
    //
    if (0 < aerr.length) {
        const e = aerr.map((ch) => [ch, "err"]);
        e.unshift(["[まちがえた文字] "]);
        pute(make_span(e), ["message"]);
    }
}

function truncate() {
    while (stdout_size < stdout.childElementCount) {
        stdout.removeChild(stdout.firstChild);
    }
}

function pute(elm, classList = []) {
    const div = document.createElement("div");
    if (0 < classList.length) { div.classList.add(...classList); }
    div.appendChild(elm);
    //
    const span = document.createElement("span");
    span.textContent = nbsp;
    div.appendChild(span);
    //
    stdout.appendChild(div);
    truncate();
}

function puts(str = "", classList = []) {
    const div = document.createElement("div");
    div.textContent = str;
    div.textContent += nbsp;
    //
    if (0 < classList.length) { div.classList.add(...classList); }
    //
    stdout.appendChild(div);
    truncate();
}

function putm(str = "") {
    puts(str, ["message"]);
}

function clear() {
    while (stdout.firstChild) { stdout.removeChild(stdout.firstChild); }
    for (let i = 0; i < stdout_size; i++) { puts(); }
    truncate();
}

function do_reset() {
    time = 0;
    stall = 0;
    stcor = 0;
    sterr = 0;
    stquest = 0;
    lschweak.CLEAR();
    lschtypo.CLEAR();
    // prompting = false;
}

function do_lsreset() {
    lstime = 0;
    lsstall = 0;
    lsstcor = 0;
    lssterr = 0;
    lsstquest = 0;
    lschtypo.CLEAR();
    prompting = false;
}

function do_score(ms, nraw, stcor, sterr, stquest) {
    pute(make_span([["[総打鍵成績] 毎打鍵 "],
                    [Math.floor(ms / nraw), "usr"],
                    [" ミリ秒、毎分 "],
                    [Math.floor(nraw / ms * 60000), "usr"],
                    [" 打鍵"]]),
         ["message"]);
    pute(make_span([["[実打鍵成績] 毎打鍵 "],
                    [Math.floor(ms / stcor), "usr"],
                    [" ミリ秒、毎分 "],
                    [Math.floor(stcor / ms * 60000), "usr"],
                    [" 打鍵"]]),
         ["message"]);
    pute(make_span([["エラーレート "],
                    [Math.floor(sterr / stquest * 1000) / 10, "err"],
                    [" %"]]),
         ["message"]);
}

window.addEventListener("load", (event) => {
    const selectim = document.getElementById("selectim");
    const checkdvorak = document.getElementById("checkdvorak");
    const checkdothelp = document.getElementById("checkdothelp");
    const checkecho = document.getElementById("checkecho");
    const selectcertain = document.getElementById("selectcertain");
    const selectuncertain = document.getElementById("selectuncertain");
    const selectlesson = document.getElementById("selectlesson");
    const checkkana = document.getElementById("checkkana");
    stdout = document.getElementById("stdout");
    stdin = document.getElementById("stdin");
    stdhelp = document.getElementById("stdhelp");
    const buttonhint = document.getElementById("buttonhint");
    //
    cookie.read();
    //
    const cookie_im = cookie.get("im");
    const cookie_certain = cookie.get("certain");
    const cookie_uncertain = cookie.get("uncertain");
    ifdvorak = cookie.get("dvorak") === "true";
    help_style = (cookie.get("help") ?? "dothelp") === "dothelp" ? "dothelp" : "";
    const echo_mode = cookie.get("echo") === "true";
    repeat_mode = cookie.get("repeat") === "true";
    checkdvorak.checked = ifdvorak;
    checkdothelp.checked = help_style === "dothelp";
    checkecho.checked = echo_mode;
    checkrepeat.checked = repeat_mode;
    ifkana = cookie.get("kana") === "true";
    checkkana.checked = ifkana;
    //
    selectim.addEventListener("change", (event) => {
        const index = selectim.selectedIndex;
        im = ims[index];
        cookie.set("im", im.id);
        cookie.write();
        // ヒント (ヘルプ) を描画し直す
        helps = helps.map((h) => im.encode2(h[0])[0]);
        do_help();
        stdin.focus();
    });
    //
    const make_lessons = () => {
        while (selectlesson.firstChild) { selectlesson.removeChild(selectlesson.firstChild); }
        let i = 0;
        lessons = do_yatt();
        for (const ls of lessons) {
            const option = document.createElement("option");
            option.value = i; i += 1;
            option.text = `${ls.name}. ${ls.text[0]}`;
            selectlesson.appendChild(option);
        }
        // XXX
        if (lessons.length === 0) {
            const option = document.createElement("option");
            option.value = i; i += 1;
            option.text = "レッスンはありません";
            selectlesson.appendChild(option);
        }
        //
        selectlesson.selectedIndex = 0;
        selectlesson.dispatchEvent(new Event("change"));
    };
    //
    selectcertain.addEventListener("change", (event) => {
        const index = selectcertain.selectedIndex;
        certain = certains[index];
        cookie.set("certain", certain.id);
        cookie.write();
        //
        certain_chars = ifkana ? certain.chars.concat(kanachars) : certain.chars;
        if (certain && uncertain) { make_lessons(); }
    });
    //
    selectuncertain.addEventListener("change", (event) => {
        const index = selectuncertain.selectedIndex;
        uncertain = uncertains[index];
        cookie.set("uncertain", uncertain.id);
        cookie.write();
        //
        if (certain && uncertain) { make_lessons(); }
    });
    //
    selectlesson.addEventListener("change", (event) => {
        // XXX
        if (lessons.length === 0) {
            clear();
            putm();
            putm("レッスンはありません");
            putm();
            //
            stdin.focus();
            do_lsreset();
            return;
        }
        //
        const index = selectlesson.selectedIndex;
        lesson = lessons[index];
        lesson_index = index;
        text_index = null;
        text = null;
        helps = lesson.chars.split("").map((ch) => im.encode2(ch)[0]);
        do_help();
        clear();
        const ls = lessons[selectlesson.selectedIndex];
        putm();
        putm(`${ls.name}. ${ls.text[0]}`);
        putm();
        putm("リターンキーで開始");
        //
        stdin.focus();
        do_lsreset();
    });
    //
    for (const im of ims) {
        const option = document.createElement("option");
        option.value = im.id;
        option.text = im.title;
        selectim.appendChild(option);
        if (im.id === cookie_im) { option.selected = true; }
    }
    selectim.dispatchEvent(new Event("change"));
    //
    const certains = charsets.filter((cs) => cs.option.certain);
    const uncertains = charsets.filter((cs) => cs.option.uncertain);
    //
    for (const cer of certains) {
        const option = document.createElement("option");
        option.value = cer.id;
        option.text = cer.title;
        selectcertain.appendChild(option);
        if (cer.id === cookie_certain) { option.selected = true; }
    }
    selectcertain.dispatchEvent(new Event("change"));
    //
    for (const unc of uncertains) {
        const option = document.createElement("option");
        option.value = unc.id;
        option.text = unc.title;
        selectuncertain.appendChild(option);
        if (unc.id === cookie_uncertain) { option.selected = true; }
    }
    selectuncertain.dispatchEvent(new Event("change"));
    //
    stdin.addEventListener("keyup", (event) => {
        const input = stdin.value;
        // XXX
        if (lessons.length === 0) {
            stdin.value = "";
            return;
        }
        //
        if (!prompting && input === "" && text_index === null && text === null && event.key === "Enter" && event.shiftKey) {
            // XXX: レッスン開始時に Shift+Return 空打ちで prompting に (ad hoc)
            puts();
            putm("もう一度? 次へ(N)/もう一度(A)/前へ(P)/終了(Q)");
            prompting = true;
        }
        if (prompting && event.key === "Enter") {
            stdin.value = "";
        } else if (event.key === "Enter") {
            if (text === null) {
                clear();
                helps.CLEAR();
                do_help();
            } else if (text !== "" && input === "") {
                // XXX: レッスン中に Return 空打ちでスキップ (ad hoc)
                putm("スキップしました");
                puts();
            } else {
                // const res = do_input_text(text, input);
                const res = do_input_text(text, ifdvorak ? fromdvorak(input) : input);
                do_result(res.res);
                if (repeat_mode && res.sterr !== 0) {
                    stdin.value = "";
                    if (lschweak.length === 0) { puts(text); }
                    else {
                        const re = new RegExp("(" + lschweak.map((ch) => RegExp.escape(ch)).join("|") + ")");
                        // > もし separator が括弧 ( ) を含む正規表現であれば、一致した結果が配列に含められます。
                        const a = text.split(re).map((s) => re.test(s) ? [s, "weak"] : [s]);
                        pute(make_span(a));
                    }
                    return;
                } else { puts(); }
            }
            stdin.value = "";
            if (text_index === null) {
                text_index = 0;
            } else if (text_index < lesson.text.length - 1) {
                text_index += 1;
            } else {
                time += lstime;
                stall += lsstall;
                stcor += lsstcor;
                sterr += lssterr;
                stquest += lsstquest;
                do_score(lstime, lsstall, lsstcor, lssterr, lsstquest);
                //
                text_index = null;
                //
                if (0 < lschtypo.length) {
                    const typo = lschtypo.UNIQUED((a, b) => a[0] === b[0] && a[1] === b[1]);
                    // XXX: [この課でまちがえた文字] のヘルプは表示しない
                    // (あるいは [まちがえた文字] とは別に表示する)
                    //
                    const e = typo.map((t) => [t[0], "err"]);
                    e.unshift(["[この課でまちがえた文字] "]);
                    pute(make_span(e), ["message"]);
                }
                //
                puts();
                putm("もう一度? 次へ(N)/もう一度(A)/前へ(P)/終了(Q)");
                prompting = true;
            }
            //
            if (text_index !== null) {
                text = lesson.text[text_index];
                if (lschweak.length === 0) { puts(text); }
                else {
                    const re = new RegExp("(" + lschweak.map((ch) => RegExp.escape(ch)).join("|") + ")");
                    // > もし separator が括弧 ( ) を含む正規表現であれば、一致した結果が配列に含められます。
                    const a = text.split(re).map((s) => re.test(s) ? [s, "weak"] : [s]);
                    pute(make_span(a));
                }
                //
                lstimebeg = (new Date()).getTime();
            } else {
                text = null;
            }
        } else if (prompting && text_index === null) {
            switch (event.key.toLowerCase()) {
            case "n":
            case " ":
                lesson_index = (lesson_index + 1) % lessons.length;
                prompting = false;
                break;
            case "p":
                lesson_index = (lesson_index + lessons.length - 1) % lessons.length;
                prompting = false;
                break;
            case "a":
                prompting = false;
                break;
            case "q":
                // prompting = false;
                puts();
                putm();
                putm("総合成績");
                putm();
                //
                do_score(time, stall, stcor, sterr, stquest);
                //
                pute(make_span([["入力打鍵数 "],
                                [stall, "usr"],
                                [" 打鍵、所要時間 "],
                                [Math.ceil(time / 1000), "usr"],
                                [" 秒"]]),
                    ["message"]);
                puts();
                putm("おつかれさまでした");
                stdin.blur();
                //
                do_reset();
                helps.CLEAR();
                do_help();
                break;
            default:
                break;
            }
            stdin.value = "";
            if (!prompting) {
                selectlesson.selectedIndex = lesson_index;
                selectlesson.dispatchEvent(new Event("change"));
            }
        }
    });
    //
    checkdvorak.addEventListener("change", (event) => {
        ifdvorak = checkdvorak.checked;
        do_help();
        stdin.focus();
        cookie.set("dvorak", ifdvorak);
        cookie.write();
    });
    //
    checkdothelp.addEventListener("change", (event) => {
        help_style = checkdothelp.checked ? "dothelp" : "";
        do_help();
        stdin.focus();
        cookie.set("help", help_style);
        cookie.write();
    });
    //
    checkecho.addEventListener("change", (event) => {
        const color = checkecho.checked ? "FieldText" : "Field";
        stdin.style.color = color;
        stdin.focus();
        cookie.set("echo", checkecho.checked);
        cookie.write();
    });
    //
    checkkana.addEventListener("change", (event) => {
        ifkana = checkkana.checked;
        certain_chars = ifkana ? certain.chars.concat(kanachars) : certain.chars;
        if (certain && uncertain) { make_lessons(); }
        cookie.set("kana", ifkana);
        cookie.write();
    });
    //
    buttonhint.addEventListener("click", (event) => {
        if (text !== null) {
            helps = text.split("").map((ch) => im.encode2(ch)[0]); // XXX
        } else {
            helps = lschtypo.UNIQUED((a, b) => a[0] === b[0] && a[1] === b[1]);
            // stdin.value = "";
        }
        do_help();
        stdin.focus();
    });
    //
    checkrepeat.addEventListener("change", (event) => {
        repeat_mode = checkrepeat.checked;
        stdin.focus();
        cookie.set("repeat", repeat_mode);
        cookie.write();
    });
    //
    checkecho.dispatchEvent(new Event("change"));
    //
    do_reset();
});
