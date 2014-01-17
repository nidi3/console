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