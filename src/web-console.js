/*global $*/
var cons = (function () {

    var A = {
        last: function (array) {
            return array[array.length - 1];
        },
        pushTo: function (value, array) {
            array.push(value);
            return value;
        },
        unshift: function (array, value) {
            array.unshift(value);
            return array;
        }
    };

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

    function View(div, columns, rows) {
        var d, lineHeight, currentLine,
            viewDiv = $(div);

        function dup(s, n) {
            var i, res = '';
            for (i = 0; i < n; i += 1) {
                res += s;
            }
            return res;
        }

        function init() {
            var widthTest, heightTest;
            viewDiv.addClass('console');
            d = $('<div/>').css('font-family', 'monospace').css('white-space', 'pre').appendTo(viewDiv);
            widthTest = $('<span />').css('visibility', 'hidden').html(dup('w', columns)).appendTo(d);
            heightTest = $('<div />').css('visibility', 'hidden').appendTo(d);
            lineHeight = heightTest.height();
            viewDiv.css('width', widthTest.width());
            viewDiv.css('height', lineHeight * rows);
            widthTest.remove();
            heightTest.remove();
        }

        function scrollBottom() {
            viewDiv.scrollTop(viewDiv[0].scrollHeight);
        }

        function write(p) {
            $('<span/>')
                .css('color', p.attr.color || 'black')
                .css('background-color', p.attr.backgroundColor || 'white')
                .css('font-style', p.attr.fontStyle || 'normal')
                .css('text-decoration', p.attr.textDecoration || 'none')
                .html(p.text)
                .appendTo(currentLine);
        }

        this.newLine = function () {
            var num = currentLine ? +currentLine.attr('id').substring(4) + 1 : 0;
            currentLine = $('<div />').attr('id', 'line' + num).appendTo(d);
            scrollBottom();
        };

        this.writeParts = function (p) {
            var i;
            for (i = 0; i < p.length - 1; i += 1) {
                write(p[i]);
                this.newLine();
            }
            write(p[i]);
        };

        this.clear = function () {
            d.empty();
        };

        init();
    }

    function Console(div, columns, rows) {
        var self = this,
            w = columns || 80,
            h = rows || 25,
            model = new Model(w),
            view = new View(div, w, h);

        this.newLine = function () {
            model.newLine();
            view.newLine();
        };

        this.write = function (s, attr) {
            var parts = model.write(s, attr || {});
            view.writeParts(parts);
        };

        this.clear = function () {
            model.clear();
            view.clear();
            self.newLine();
        };

        self.clear();
    }

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

    function Ansi(console) {
        var basic = new Basic(console),
            attr = {bright: false},
            paletteNormal = ['#000000', '#bb0000', '#00bb00', '#bbbb00', '#0000bb', '#bb00bb', '#00bbbb', '#bbbbbb', '#ffffff'],
            paletteBright = ['#555555', '#ff5555', '#55ff55', '#ffff55', '#5555ff', '#ff55ff', '#55ffff', '#ffffff'];

        function extend(base, value) {
            var p;
            for (p in value) {
                base[p] = value[p];
            }
        }

        function parseColor(param) {
            switch (param) {
            case 0:
                return {colorIndex: null, backgroundColorIndex: null, bright: false, italic: false, underline: false, crossedOut: false};
            case 1:
                return {bright: true};
            case 3:
                return {italic: true};
            case 4:
                return {underline: true};
            case 9:
                return {crossedOut: true};
            case 22:
                return {bright: false};
            case 23:
                return {italic: false};
            case 24:
                return {underline: false};
            case 29:
                return {crossedOut: false};
            default:
                if (param >= 30 && param <= 37) {
                    return {colorIndex: param - 30};
                }
                if (param >= 40 && param <= 47) {
                    return {backgroundColorIndex: param - 40};
                }
            }
        }

        function parseColors(param) {
            var i, res = {}, parts = param.split(';');
            for (i = 0; i < parts.length; i += 1) {
                extend(res, parseColor(+parts[i]));
            }
            return res;
        }

        function parse(cmd, param) {
            switch (cmd) {
            case 'm':
                return parseColors(param);
            default:
                return {};
            }
        }

        function attrToCss(attr) {
            var res = {};
            if (attr.colorIndex) {
                res.color = attr.bright ? paletteBright[attr.colorIndex] : paletteNormal[attr.colorIndex];
            }
            if (attr.backgroundColorIndex) {
                res.backgroundColor = attr.bright ? paletteBright[attr.backgroundColorIndex] : paletteNormal[attr.backgroundColorIndex];
            }
            if (attr.italic) {
                res.fontStyle = 'italic';
            }
            if (attr.underline) {
                res.textDecoration = 'underline';
            }
            if (attr.crossedOut) {
                res.textDecoration = 'line-through';
            }
            return res;
        }

        this.write = function (s) {
            var cmd,
                lastIndex = 0,
                re = /(?:\x1B|\u001B)\[([0-9;]*)([A-Za-z])/g;
            while (true) {
                if ((cmd = re.exec(s)) === null) {
                    break;
                }
                basic.write(s.substring(lastIndex, cmd.index), attrToCss(attr));
                extend(attr, parse(cmd[2], cmd[1]));
                lastIndex = re.lastIndex;
            }
            basic.write(s.substring(lastIndex, s.length), attrToCss(attr));
        };

        this.clear = function () {
            console.clear();
        };

    }

    return {
        Console: Console,
        Basic: Basic,
        Ansi: Ansi
    };

}());
