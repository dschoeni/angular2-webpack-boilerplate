// Helper: root(), and rootDir() are defined at the bottom
var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    // add debug messages
    config.debug = !isProd;

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     */
    config.entry = {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts' // our angular app
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */
    config.output = {
        path: root('dist'),
        publicPath: isProd ? '/' : 'http://localhost:8080/',
        filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
        chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
    };

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        root: root(),
        // only discover files that have those extensions
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
        alias: {
            'app': 'src/app',
            'common': 'src/common'
        }
    };

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        preLoaders: [{test: /\.ts$/, loader: 'tslint'}],
        loaders: [
            // Support for .ts files.
            {
                test: /\.ts$/,
                loader: 'ts',
                exclude: [/node_modules\/(?!(ng2-.+))/]
            },

            // copy those assets to output
            {
                test: /.(png|ico|jpe?g|gif)(\?[a-z0-9=\.]+)?$/, 
                loader: 'file?name=fonts/[name].[hash].[ext]?'
            },

            // correct font-loading using version-tags
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&minetype=application/font-woff" 
            },

            { 
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "file-loader" 
            },

            // Support for *.json files.
            {
                test: /\.json$/, loader: 'json'
            },

            // Support for CSS as raw text
            // all css in src/style will be bundled in an external css file
            {
                test: /\.css$/,
                exclude: root('src', 'app'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },

            // support for .scss files
            // all css in src/style will be bundled in an external css file
            {
                test: /\.scss$/,
                exclude: root('src', 'app'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass?includePaths[]=' + (path.resolve(__dirname, "./node_modules")))
            },

            // all css required in src/app files will be merged in js files
            {
                test: /\.scss$/,
                exclude: root('src', 'style'), 
                loader: 'raw!sass?includePaths[]=' + (path.resolve(__dirname, "./node_modules"))
            },


            // support for .html as raw text
            // todo: change the loader to something that adds a hash to images
            {
                test: /\.html$/,
                loader: 'raw'
            },

        ]
    };

    /**
    * PostCSS
    * Reference: https://github.com/postcss/autoprefixer-core
    * Add vendor prefixes to your css
    */
    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        // Define env variables to help with builds
        // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        new webpack.DefinePlugin({
            // Environment helpers
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        }),

        new CommonsChunkPlugin({
                name: ['vendor', 'polyfills']
        }),

        // Inject script and link tags into html files
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            chunksSortMode: 'dependency'
        }),

        // Extract css files
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin('css/[name].[hash].css', {disable: !isProd})
    ];

    // Add build specific plugins
    if (isProd) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                mangle: true
            }),

            // Copy assets from the public folder
            // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([{
                from: root('src/public')
            }])
        );
    }

    /**
     * Apply the tslint loader as pre/postLoader
     * Reference: https://github.com/wbuchwalter/tslint-loader
     */
    config.tslint = {
        emitErrors: false,
        failOnHint: false
    };

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './src/public',
        historyApiFallback: true,
        stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
    };

    return config;
}();

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}
