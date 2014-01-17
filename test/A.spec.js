/*global describe,it,expect,A*/

describe('A', function () {
    it('should find the last element of an array', function () {
        expect(A.last([1, 2, 3])).toBe(3);
    });
});