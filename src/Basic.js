function Basic(console) {
    function writeLine(line, attr) {
        console.write(line.replace(/.\x08/, '').replace('\t', '        '), attr);
    }

    this.write = function (s, attr) {
        var i, lines = s.split('\n');
        for (i = 0; i < lines.length - 1; i += 1) {
            writeLine(lines[i], attr);
            console.newLine();
        }
        writeLine(lines[i], attr);
    };

    this.clear = function () {
        console.clear();
    };
}
