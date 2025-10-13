const nbsp = "\u00a0";
const stdoutsize = 10;
let stdin;
let stdout;
let stdhelp;

let im;
let certain;
let uncertain;
let pattern;
let wordarrays = new Map();
let wordcounts = new Map();

let lessons;
let lesson;
let lesson_index;
let line;
let line_index;
let reviewlesson;
let ifsessionreview = false;

const cookiename = "yatt";
const cookie = new Cookie(cookiename);

let ifdvorak = false;
let helpstyle = "dothelp";
let helps = new Array();
let repeatmode = false;
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
let certainchars;

let prompting = false;

const totalst = {all: 0, cor: 0, err: 0, que: 0};
const lessonst = {all: 0, cor: 0, err: 0, que: 0};
let totaltime;
let lessontime;
let timebeg;
let timeend;
let weakchars = new Array();
const lessontypo = new Array();
const sessiontypo = new Array();

// YATT
function make_pattern() {
    // const str = certain_chars.concat(uncertain.chars).join('');
    const str = certainchars.concat(uncertain.chars).UNIQUED().join('');
    pattern = new RegExp(`^[${RegExp.escape(str)}]+$`);
}

function read_words() {
    wordarrays.clear();
    wordcounts.clear();
    for (const word of words) {
        if (!pattern.test(word)) { continue; }
        word.split('').forEach((ch) => {
            if (wordarrays.get(ch) === undefined) { wordarrays.set(ch, new Array()); }
            wordarrays.get(ch).push(word);
            wordcounts.set(ch, (wordcounts.get(ch) ?? 0) + 1);
        });
    }
}

function wordscore(word, ch, used) {
    let score = 0;
    score -= Math.abs(2 - word.length); // 2 字熟語を優先
    score += word.split('').UNIQUED().filter((c0) => {
        return c0 !== ch && !used.get(c0) && !certainchars.includes(c0);
    }).length;
    return score;
}

function wordstat(wordset) {
    let count = new Map();
    wordset.forEach((word) => {
        word.split('').forEach((ch) => {
            count.set(ch, (count.get(ch) ?? 0) + 1);
        });
    });
    return count;
}

function wordreduce(wordset) {
    while(true) {
        const count = wordstat(wordset);
        /*
        let chars = new Array();
        for (const [key, val] of count) { if (2 <= val) { chars.push(key); } }
        const re = new RegExp(`^[${RegExp.escape(certainchars.concat(chars).UNIQUED().join(''))}]+$`);
        */
        // これ ↑ は遅い…
        let chs = "";
        for (const [key, val] of count) { if (2 <= val) { chs += key; } }
        const re = new RegExp(`^[${RegExp.escape(certainchars.join('') + chs)}]+$`);
        //
        const word = wordset.filter((w) => re.test(w)).SAMPLE();
        if (word === undefined) { return wordset; }
        wordset = wordset.filter((w) => w !== word);
    }
}

function check(wordset) {
    const count = wordstat(wordset);
    let chs = "";
    for (const [key, val] of count) { if (val === undefined) { chs += key; } }
    console.log("check: " + (chs === "" ? "OK" : `FAILED: ${chs}`));
}

function yatt(rand_seed = 0) {
    // srand(rand_seed);
    // XXX: JS に srand はない…
    // - JavaScriptで再現性のある乱数を生成する + 指定した範囲の乱数を生成する
    // - https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/
    //
    let wordset = new Array();
    let used = new Map();
    //
    make_pattern();
    read_words();
    //
    // 非破壊的にソート
    const chars = Array.from(uncertain.chars).sort((a, b) => {
        const count_a = wordcounts.get(a) ?? 0;
        const count_b = wordcounts.get(b) ?? 0;
        return count_a - count_b;
    });
    //
    chars.forEach((ch) => {
        if (used.get(ch) !== undefined) { return; }
        const words = wordarrays.get(ch) ?? [ch];
        //
        /*
        const word = words.SHUFFLED().sort((a, b) => {
            return wordscore(b, ch, used) - wordscore(a, ch, used);
        })[0];
        */
        // こちら ↓ の方が少し速いか…
        const findbest = (words) => {
            let maxscore = -Infinity;
            let wd;
            words.forEach((w) => {
                const score = wordscore(w, ch, used)
                if (maxscore < score) { maxscore = score; wd = w; }
            });
            return wd;
        };
        const word = findbest(words.SHUFFLED());
        //
        wordset.push(word);
        word.split('').forEach((ch) => { used.set(ch, true); });
    });
    wordset = wordreduce(wordset);
    // this.check(word_array);
    return wordset;
}

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
    if (helpstyle === "dothelp") {
        const span = document.createElement("span");
        let s = document.createElement("span");
        s.textContent = ch;
        s.classList.add("ch");
        span.appendChild(s);
        s = document.createElement("span");
        s.classList.add("st");
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
    if (ch === st_external) { return make_span([[ch, "ch"], [st_external, "st", "outset"]], ["help", "alnum"]); }
    //
    return make_span([[ch, "ch"], [st_external, "st"]], ["help", "alnum"]);
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
    timeend = (new Date()).getTime();
    lessontime += timeend - timebeg;
    //
    // const r = im.encode2(str, ifdvorak);
    const r = im.encode2(ifdvorak ? fromdvorak(str) : str);
    //
    const m = lcs.match(r, s);
    lessonst.all += m.all;
    lessonst.cor += m.cor;
    lessonst.err += m.err;
    lessonst.que += m.que;
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
    weakchars = weakchars.filter((ch) => !acorr.includes(ch));
    aerr.forEach((ch) => {
        if (!weakchars.includes(ch)) { weakchars.push(ch); }
    });
    //
    for (const typo of atypo) {
        lessontypo.push(typo[0]);
        sessiontypo.push(typo[0]);
    }
    helps = atypo;
    do_help();
    //
    pute(make_span(e, ["usr"]));
    //
    if (0 < aerr.length) {
        const e = aerr.map((ch) => [ch, "err"]);
        e.unshift(["『"]);
        e.unshift(["[まちがえた文字] "]);
        e.push(["』"]);
        pute(make_span(e), ["message"]);
    }
}

function truncate() {
    while (stdoutsize < stdout.childElementCount) {
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
    for (let i = 0; i < stdoutsize; i++) { puts(); }
    truncate();
}

function do_reset() {
    totaltime = 0;
    totalst.all = 0;
    totalst.cor = 0;
    totalst.err = 0;
    totalst.que = 0;
    weakchars.CLEAR();
    lessontypo.CLEAR();
    // prompting = false;
    sessiontypo.CLEAR();
}

function do_lessonreset() {
    lessontime = 0;
    lessonst.all = 0;
    lessonst.cor = 0;
    lessonst.err = 0;
    lessonst.que = 0;
    lessontypo.CLEAR();
    prompting = false;
}

function do_score(ms, st) {
    pute(make_span([["[総打鍵成績] 毎打鍵 "],
                    [Math.floor(ms / st.all), "usr"],
                    [" ミリ秒、毎分 "],
                    [Math.floor(st.all / ms * 60000), "usr"],
                    [" 打鍵"]]),
         ["message"]);
    pute(make_span([["[実打鍵成績] 毎打鍵 "],
                    [Math.floor(ms / st.cor), "usr"],
                    [" ミリ秒、毎分 "],
                    [Math.floor(st.cor / ms * 60000), "usr"],
                    [" 打鍵"]]),
         ["message"]);
    pute(make_span([["エラーレート "],
                    [Math.floor(st.err / st.que * 1000) / 10, "err"],
                    [" %"]]),
         ["message"]);
}

window.addEventListener("load", (event) => {
    const selectim = document.getElementById("selectim");
    const checkdvorak = document.getElementById("checkdvorak");
    const checkalnum = document.getElementById("checkalnum");
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
    helpstyle = (cookie.get("help") ?? "dothelp") === "dothelp" ? "dothelp" : "alnum";
    const echomode = cookie.get("echo") === "true";
    repeatmode = cookie.get("repeat") === "true";
    checkdvorak.checked = ifdvorak;
    checkalnum.checked = helpstyle === "alnum";
    checkecho.checked = echomode;
    checkrepeat.checked = repeatmode;
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
        //
        // do_reset();
        weakchars.CLEAR();
        lessontypo.CLEAR();
        sessiontypo.CLEAR();
        reviewlesson = null;
        ifsessionreview = false;
    };
    //
    selectcertain.addEventListener("change", (event) => {
        const index = selectcertain.selectedIndex;
        certain = certains[index];
        cookie.set("certain", certain.id);
        cookie.write();
        //
        certainchars = ifkana ? certain.chars.concat(kanachars) : certain.chars;
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
            do_lessonreset();
            return;
        }
        //
        const index = selectlesson.selectedIndex;
        lesson = lessons[index];
        lesson_index = index;
        line_index = null;
        line = null;
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
        do_lessonreset();
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
        // const prompt = "もう一度? 次へ(N)/もう一度(A)/前へ(P)/補習(R)/終了(Q)";
        const prompt = make_span([
            ["もう一度トライしますか? 次へ("], ["N", "cmd"],
            [")/もう一度("], ["A", "cmd"],
            // [")/前へ("], ["P", "cmd"],
            [")/補習("], ["R", "cmd"],
            [")/総復習("], ["T", "cmd"],
            [")/終了("], ["Q", "cmd"],
            [")"]
        ]);
        // XXX
        if (lessons.length === 0) {
            stdin.value = "";
            return;
        }
        //
        if (!prompting && input === "" && line_index === null && line === null && event.key === "Enter" && event.shiftKey) {
            // XXX: レッスン開始時に Shift+Return 空打ちで prompting に (ad hoc)
            puts();
            pute(prompt, ["message"]);
            prompting = true;
        }
        if (prompting && event.key === "Enter") {
            stdin.value = "";
            // } else if (event.key === "Enter") {
        } else if (event.key === "Enter" ||
                   !prompting && line === null && event.key === " ") {
            // XXX: Space でもレッスンを開始できるように (ad hoc)
            if (line === null) {
                clear();
                helps.CLEAR();
                do_help();
            } else if (line !== "" && input === "") {
                // XXX: レッスン中に Return 空打ちでスキップ (ad hoc)
                putm("スキップしました");
                puts();
            } else {
                // const res = do_input_text(text, input);
                const res = do_input_text(line, ifdvorak ? fromdvorak(input) : input);
                do_result(res.res);
                if (repeatmode && res.err !== 0) {
                    stdin.value = "";
                    if (weakchars.length === 0) { puts(line); }
                    else {
                        const re = new RegExp("(" + weakchars.map((ch) => RegExp.escape(ch)).join("|") + ")");
                        // > もし separator が括弧 ( ) を含む正規表現であれば、一致した結果が配列に含められます。
                        const a = line.split(re).map((s) => re.test(s) ? [s, "weak"] : [s]);
                        pute(make_span(a));
                    }
                    return;
                } else { puts(); }
            }
            stdin.value = "";
            if (line_index === null) {
                line_index = 0;
            } else if (line_index < (reviewlesson?.text?.length ?? lesson.text.length) - 1) {
                line_index += 1;
            } else {
                totaltime += lessontime;
                totalst.all += lessonst.all;
                totalst.cor += lessonst.cor;
                totalst.err += lessonst.err;
                totalst.que += lessonst.que;
                do_score(lessontime, lessonst);
                //
                line_index = null;
                //
                if (0 < lessontypo.length) {
                    const typo = lessontypo.UNIQUED();
                    // XXX: [この課でまちがえた文字] のヘルプは表示しない
                    // (あるいは [まちがえた文字] とは別に表示する)
                    //
                    const e = typo.map((t) => [t, "err"]);
                    e.unshift(["『"]);
                    e.unshift(["[この課でまちがえた文字] "]);
                    e.push(["』"]);
                    pute(make_span(e), ["message"]);
                }
                //
                puts();
                pute(prompt, ["message"]);
                prompting = true;
            }
            //
            if (line_index !== null) {
                // text = lesson.text[text_index];
                line = (reviewlesson?.text ?? lesson.text)[line_index];
                if (weakchars.length === 0) { puts(line); }
                else {
                    const re = new RegExp("(" + weakchars.map((ch) => RegExp.escape(ch)).join("|") + ")");
                    // > もし separator が括弧 ( ) を含む正規表現であれば、一致した結果が配列に含められます。
                    const a = line.split(re).map((s) => re.test(s) ? [s, "weak"] : [s]);
                    pute(make_span(a));
                }
                //
                timebeg = (new Date()).getTime();
            } else {
                line = null;
            }
        } else if (prompting && line_index === null) {
            // const eventkey = event.key.toLowerCase();
            switch (event.key) {
            case "n":
            case "N":
                lesson_index = (lesson_index + 1) % lessons.length;
                prompting = false;
                reviewlesson = null;
                ifsessionreview = false;
                break;
            case "p":
            case "P":
                lesson_index = (lesson_index + lessons.length - 1) % lessons.length;
                prompting = false;
                reviewlesson = null;
                ifsessionreview = false;
                break;
            case "a":
            case "A":
                prompting = false;
                reviewlesson = null;
                ifsessionreview = false;
                break;
            case "t":
            case "T":
                ifsessionreview = true;
                const sessionreviewchars = sessiontypo.filter((ch) => ch != " ").UNIQUED();
                if (0 < sessionreviewchars.length) {
                    const re = new RegExp(`[${sessionreviewchars.map((ch) => RegExp.escape(ch)).join("")}]`);
                    const reviewwords = lessons.flatMap((lesson) => lesson.text).map((line) => line.split(" ")).flat().filter((word) => re.test(word)); // XXX
                    const nwords = 6; // 1 行あたりの語数
                    reviewlesson = {text: reviewwords.SHUFFLED().CHUNK(nwords).map((a) => a.join(" "))};
                    line_index = 0;
                } else {
                    reviewlesson = null;
                }
                //
                if (!reviewlesson) {
                    putm("総復習はありません");
                    pute(prompt, ["message"]);
                    ifsessionreview = false;
                } else { prompting = false; }
                break;
            case "r":
            case "R":
            case " ":
                // reviewlesson = null;
                const reviewchars = lessontypo.filter((ch) => ch !== " ").UNIQUED();
                if (0 < reviewchars.length) {
                    const re = new RegExp(`[${reviewchars.map((ch) => RegExp.escape(ch)).join("")}]`);
                    const reviewwords =
                          (ifsessionreview ?
                           lessons.flatMap((lesson) => lesson.text).map((line) => line.split(" ")).flat() :
                           lesson.text.flatMap((line) => line.split(" "))).
                          filter((word) => re.test(word));
                    const nwords = 6; // 1 行あたりの語数
                    reviewlesson = {text: reviewwords.CHUNK(nwords).map((a) => a.join(" "))};
                    line_index = 0;
                } else {
                    reviewlesson = null;
                }
                //
                if (!reviewlesson && event.key === " ") {
                    lesson_index = (lesson_index + 1) % lessons.length;
                    prompting = false;
                    // reviewlesson = null;
                    break;
                }
                //
                if (!reviewlesson) {
                    putm("補習はありません");
                    pute(prompt, ["message"]);
                    ifsessionreview = false;
                } else { prompting = false; }
                break;
            case "q":
            case "Q":
                // prompting = false;
                reviewlesson = null;
                ifsessionreview = false;
                puts();
                putm();
                putm("総合成績");
                putm();
                //
                do_score(totaltime, totalst);
                //
                pute(make_span([["入力打鍵数 "],
                                [totalst.all, "usr"],
                                [" 打鍵、所要時間 "],
                                [Math.ceil(totaltime / 1000), "usr"],
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
            //
            if (reviewlesson && !prompting) {
                line_index = null;
                line = null;
                // clear();
                helps.CLEAR()
                do_help();
                putm("リターンキーで開始");
                //
                stdin.focus();
                do_lessonreset();
                return;
            }
            //
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
    checkalnum.addEventListener("change", (event) => {
        helpstyle = checkalnum.checked ? "alnum" : "dothelp";
        do_help();
        stdin.focus();
        cookie.set("help", helpstyle);
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
        certainchars = ifkana ? certain.chars.concat(kanachars) : certain.chars;
        if (certain && uncertain) { make_lessons(); }
        cookie.set("kana", ifkana);
        cookie.write();
    });
    //
    buttonhint.addEventListener("click", (event) => {
        if (line !== null) {
            helps = line.split("").map((ch) => im.encode2(ch)[0]); // XXX
        } else {
            helps = lessontypo.UNIQUED().map((ch) => im.encode2(ch)[0]);
            // stdin.value = "";
        }
        do_help();
        stdin.focus();
    });
    //
    checkrepeat.addEventListener("change", (event) => {
        repeatmode = checkrepeat.checked;
        stdin.focus();
        cookie.set("repeat", repeatmode);
        cookie.write();
    });
    //
    checkecho.dispatchEvent(new Event("change"));
    //
    do_reset();
});
