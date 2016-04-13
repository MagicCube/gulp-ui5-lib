# gulp-ui5-lib
An UNOFFICIAL Gulp plugin for building SAP UI5 libraries.


## Installation
```
$ npm install --save-dev gulp-ui5-lib
```

## Usage
```js
const gulp = require("gulp");
const less = require("gulp-less");
const runSequence = require("run-sequence");
const uglify = require("gulp-uglify");
const ui5Lib = require("gulp-ui5-lib");

gulp.task("default", [ "build" ]);

gulp.task("clean", function(cb) {
    del("./assets/example").then(() => {
        cb();
    }, function(reason) {
        cb(reason);
    });
});

gulp.task("build", [ "clean" ], function(cb) {
    runSequence(
        [ "build-less", "build-library" ]
    );
});

gulp.task(`build-less`, function() {
    return gulp.src("./src/themes/base/library.less")
        .pipe(less())
        .pipe(gulp.dest("./assets/themes/base"));
});

gulp.task("build-library", function() {
    return gulp.src("./src/example/**/*.js")
               .pipe(uglify())
               .pipe(ui5Lib("example"))
               .pipe(gulp.dest("./assets/example"));
});
```

## Reference
+ [babel-plugin-ui5](https://github.com/MagicCube/babel-plugin-ui5)
+ [babel-plugin-ui5-example](https://github.com/MagicCube/babel-plugin-ui5-example)
