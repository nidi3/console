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
        },

        watch: {
            dist: {
                files: 'src/*.js',
                tasks: 'dist'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', []);
    grunt.registerTask('dist', ['concat']);
};