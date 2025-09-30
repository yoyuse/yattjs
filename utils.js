// - javascript - Escape regexp strings? - Stack Overflow
// - https://stackoverflow.com/questions/6828637/escape-regexp-strings
function preg_quote (str, delimiter) {
    // Quote regular expression characters plus an optional character
    //
    // version: 1107.2516
    // discuss at: http://phpjs.org/functions/preg_quote
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

if (RegExp.escape === undefined) {
    RegExp.escape = function(str) { return preg_quote(str); }
}

// - ひらがなをカタカナに一括変換する方法 - JavaScript TIPSふぁくとりー
// - https://www.nishishi.com/javascript-tips/regexp-katakana-hiragana.html
String.prototype.hiragana = function() {
    return this.replace(/[ァ-ン]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0x60);
    });
}

//
String.prototype.katakana = function() {
    return this.replace(/[ぁ-ん]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 0x60);
    });
}
//

// - 【JavaScript】全角／半角変換メモ #初心者 - Qiita
// - https://qiita.com/ozackiee/items/0a78eeb6397c3e29d552
String.prototype.hankaku = function() {
    // ～ は 〜(WAVE DASH) ではなくて ～(FULLWIDTH TILDE)
    return this.replace(/[！-～]/g, function(s) { // ～: FULLWIDTH TILDE
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

String.prototype.remove_whites = function() {
    return this.replace(/[　 \n]/g, '');
}

String.prototype.count_chars = function() {
    return this.length;
}

String.prototype.count_shifts = function() {
    return this.replace(/[^!@#$%^&*()_+|~{}:"A-Z<>?]/g, '').length;
}
