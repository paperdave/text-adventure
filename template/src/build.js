// builds the game
const fs = require("fs-extra");
const path = require("path");
const webpack = require('webpack');
const minifier = require('html-minifier');

const p_output_directory = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")).toString()).output_directory;

// make `dist` folder
const dist_folder = path.join(__dirname, "../", p_output_directory);
if (fs.pathExistsSync(dist_folder)) {
    fs.removeSync(dist_folder)
}
fs.mkdirsSync(dist_folder);

// run `webpack --mode production`
const config = require("../webpack.config.js");
config.output = {
    path: dist_folder,
    filename: 'adventure.js'
};
config.mode = 'production';

webpack(config, (err, stats) => {
    // errors
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        return;
    }
    
    const info = stats.toJson();
    
    // errors
    if (stats.hasErrors()) {
        console.error(info.errors);
    }
    
    // warnings
    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }

    // copy index.production.html
    const input_html = fs.readFileSync(path.join(__dirname, "../src/index.html")).toString();
    const output_html = minifier.minify(input_html, {
        caseSensitive: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        minifyURLs: true,
        minifyCSS: true,
        minifyJS: {
            ie8: false,
            mangle: {
                toplevel: true,
                keep_fnames: false
            },
            
        },
        removeComments: true,
        removeAttributeQuotes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeTagWhitespace: true,
        useShortDoctype: true
    });
    fs.writeFileSync(path.join(dist_folder, "index.html"),output_html);
        
    
    console.log("build completed!");
});

