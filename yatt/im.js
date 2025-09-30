// // XXX: CODE COPY
// // - javascript - Escape regexp strings? - Stack Overflow
// // - https://stackoverflow.com/questions/6828637/escape-regexp-strings
// function preg_quote (str, delimiter) {
//     // Quote regular expression characters plus an optional character
//     //
//     // version: 1107.2516
//     // discuss at: http://phpjs.org/functions/preg_quote
//     // +   original by: booeyOH
//     // +   improved by: Ates Goral (http://magnetiq.com)
//     // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
//     // +   bugfixed by: Onno Marsman
//     // +   improved by: Brett Zamir (http://brett-zamir.me)
//     // *     example 1: preg_quote("$40");
//     // *     returns 1: '\$40'
//     // *     example 2: preg_quote("*RRRING* Hello?");
//     // *     returns 2: '\*RRRING\* Hello\?'
//     // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
//     // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
//     return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
// }

// if (RegExp.escape === undefined) {
//     RegExp.escape = function(str) { return preg_quote(str); }
// }
// // /XXX: CODE COPY

function IM(id, title, table, table_alt = {}, prefix = {}) {
    this.id = id;
    this.title = title;
    this.table = table;
    this.table_alt = table_alt;
    this.prefix = prefix;
}

IM.prototype.encode = function(str) {
    return str.split('').map((ch) => this.table[ch] ?? this.table_alt[ch] ?? ch).join();
}

IM.prototype.encode2 = function(str) {
    return str.split('').map((ch) => [ch, this.table[ch] ?? this.table_alt[ch] ?? ch]);
}

IM.prototype.deprefix = function(st) {
    if (st === undefined) { return ["", ""]; }
    for (const prefixmark in this.prefix) {
        const prefix = this.prefix[prefixmark];
        if (st.indexOf(prefix) === 0) {
            return [st.slice(prefix.length, st.length), prefixmark];
        }
    }
    return [st, ""];
}

const ims = new Array();
