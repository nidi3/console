/*global $*/
function View(div, columns, rows, config) {
    var d, lineHeight, currentLine,
        viewDiv = $(div),
        conf = $.extend({},
            {
                color: 'black',
                backgroundColor: 'white',
                fontStyle: 'normal',
                textDecoration: 'none'
            }, config);

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
        d = $('<div/>')
            .css('font-family', 'monospace')
            .css('white-space', 'pre')
            .appendTo(viewDiv);

        widthTest = $('<span />')
            .css('visibility', 'hidden')
            .html(dup('w', columns))
            .appendTo(d);

        heightTest = $('<div />')
            .css('visibility', 'hidden')
            .appendTo(d);

        lineHeight = heightTest.height();
        viewDiv.css('width', widthTest.width())
            .css('height', lineHeight * rows)
            .css('overflow-y', 'scroll')
            .css('background-color', config.backgroundColor);

        widthTest.remove();
        heightTest.remove();
    }

    function scrollBottom() {
        viewDiv.scrollTop(viewDiv[0].scrollHeight);
    }

    function attr(part, name) {
        return part.attr[name] || conf[name];
    }

    function write(part) {
        $('<span/>')
            .css('color', attr(part, 'color'))
            .css('background-color', attr(part, 'backgroundColor'))
            .css('font-style', attr(part, 'fontStyle'))
            .css('text-decoration', attr(part, 'textDecoration'))
            .html(part.text)
            .appendTo(currentLine);
    }

    this.newLine = function () {
        var num = currentLine ? +currentLine.attr('id').substring(4) + 1 : 0;
        currentLine = $('<div />').attr('id', 'line' + num).appendTo(d);
        scrollBottom();
    };

    this.writeParts = function (part) {
        var i;
        for (i = 0; i < part.length - 1; i += 1) {
            write(part[i]);
            this.newLine();
        }
        write(part[i]);
    };

    this.clear = function () {
        d.empty();
    };

    init();
}

