const gutil = require("gulp-util");
const path = require("path");
const through = require("through2");

const File = gutil.File;
const PluginError = gutil.PluginError;

const PLUGIN_NAME = "gulp-ui5-lib";

exports.default = function(libName)
{
    const libPreload = {
        version: "2.0",
        name: `${libName}.library-preload`,
        dependencies: [ "sap.ui.core.library-preload" ],
        modules: { }
    };

    libPreload.modules[`${libName}/library.js`] = "";

    let latestFile = null;
    let latestMod = null;

    function bufferContents(file, enc, cb)
    {
        // Ignore empty files
        if (file.isNull())
        {
            cb();
            return;
        }

        // We don't support streams
        if (file.isStream())
        {
            this.emit("error", new PluginError(PLUGIN_NAME,  "Streaming not supported"));
            cb();
            return;
        }

        if (!latestMod || file.stat && file.stat.mtime > latestMod)
        {
            latestFile = file;
            latestMod = file.stat && file.stat.mtime;
        }

        const code = file.contents.toString();
        const relPath = libName + "/" + file.relative;

        libPreload.modules[relPath] = code;

        cb();
    }

    function endStream(cb)
    {
        const libraryPreloadJson = latestFile.clone({ contents: false });
        libraryPreloadJson.path = path.join(latestFile.base, "library-preload.json");
        libraryPreloadJson.contents = new Buffer(JSON.stringify(libPreload, null, "\t"));
        this.push(libraryPreloadJson);

        cb();
    }

    return through.obj(bufferContents, endStream);
};
module.exports = exports.default;
