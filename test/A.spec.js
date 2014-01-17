/*global describe,it,expect,A*/

describe('A', function () {

    describe('last', function () {
        it('should return undefined on empty array', function () {
            expect(A.last([])).toBe(undefined);
        });

        it('should find the last element of an array', function () {
            expect(A.last([1, 2, 3])).toBe(3);
        });
    });

    describe('pushTo', function () {
        it('should push a value to an array and return the value', function () {
            var a = [1, 2, 3];
            expect(A.pushTo(42, a)).toBe(42);
            expect(a).toEqual([1, 2, 3, 42]);
        });
    });

    describe('unshift', function () {
        it('should unshift to an array a value and return the array', function () {
            var a = [1, 2, 3];
            expect(A.unshift(a, 42)).toEqual([42, 1, 2, 3]);
        });
    });
});