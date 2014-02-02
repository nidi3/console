/*global Model,View*/
function Console(div, config) {
    var self = this,
        c = config || {},
        columns = c.columns || 80,
        rows = c.rows || 0,
        model = new Model(columns),
        view = new View(div, columns, rows, c);

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
