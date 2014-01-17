/*global Basic*/
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



