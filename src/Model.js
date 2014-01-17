/*global A*/
function Model(columns) {
    var m = [], currentX;

    function currentLine() {
        return A.last(m);
    }

    function writeCurrentLine(s, attr) {
        currentX += s.length;
        return A.pushTo({text: s, attr: attr}, currentLine());
    }

    this.newLine = function () {
        m.push([]);
        currentX = 0;
    };

    this.write = function (s, attr) {
        var added, tooLen = currentX + s.length - columns;
        if (tooLen <= 0) {
            return [writeCurrentLine(s, attr)];
        }
        added = writeCurrentLine(s.substring(0, s.length - tooLen), attr);
        this.newLine();
        return A.unshift(this.write(s.substring(s.length - tooLen), attr), added);
    };

    this.clear = function () {
        m = [];
        currentX = 0;
    };
}

