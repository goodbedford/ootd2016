//gulpfile.js

var gulp = require("gulp");

// plugins
var nodemon     = require("gulp-nodemon");
var jshint      = require("gulp-jshint");
var jscs        = require("gulp-jscs");
var jscsStylish = require("gulp-jscs-stylish");
var sourcemaps  = require("gulp-sourcemaps");
var sass        = require("gulp-sass");
var concat      = require("gulp-concat");
var uglify      = require("gulp-uglify");

var jsFiles = [
                "*.js",
                "public/app.module.js",
                "public/app.config.js",
                "public/layout/*.js",
                "server/**/*.js"
              ];

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
    });
});

gulp.task("sass", function() {
    return gulp.src("./public/assets/sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./public/assets/css"))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write("map"))
        .pipe(gulp.dest("./public/assets/css"));
});

gulp.task("watch:all", function() {
    gulp.watch("./public/assets/sass/**/*.scss", ["sass"]);
    gulp.watch(jsFiles, ["lint"]);

});

gulp.task("lint", function() {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish", {
            verbose:true})
        )
        .pipe(jscs(".jscrc"))
        .pipe(jscsStylish());
});

gulp.task("default",["lint","sass", "watch:all"], function() {

    var options = {
        script: "server.js",
        ext: "js",
        env: {
            PORT: 8000
        },
        ignore: ["./node_modules/**"],
        watch: jsFiles   //["server.js", "server/**/ *.js"]
    };

    return nodemon(options)
        .on("restart", function(ev) {
            console.log("Restarting Server....");
        });
});

