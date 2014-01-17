/*global Model,View*/
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
