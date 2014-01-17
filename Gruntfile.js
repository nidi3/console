module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: ['src/A.js', 'src/Model.js', 'src/View.js', 'src/Console.js', 'src/Basic.js', 'src/Ansi.js'],
                dest: 'dist/web-console.js'
            },
            options: {
                banner: 'var cons = (function () {',
                footer: 'return { Console: Console, Basic: Basic, Ansi: Ansi }; }());'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', []);
    grunt.registerTask('dist', ['concat']);
};