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
