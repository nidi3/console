/*global $*/
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

