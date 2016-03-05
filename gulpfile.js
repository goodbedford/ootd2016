//gulpfile.js

var gulp = require("gulp");


// plugins
var nodemon = require("gulp-nodemon");
var jshint = require("gulp-jshint");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");


gulp.task("restartServer", function() {
    nodemon({
        script: "server.js",
        ext: "js",
        env: {
            PORT: 8000
        },
        ignore: ["./node_modules/**"]

    })
        .on("restart", function() {
            console.log("restarted server:");
        })
});

gulp.task("lint", function() {
    return gulp.src(
        ["client/**/*.js",
         "server/**/*.js"
        ])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("default",["restartServer", "lint"]);

