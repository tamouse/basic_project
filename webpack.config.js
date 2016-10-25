// path is part of webpack
import {resolve} from 'path'
import webpack from 'webpack'

import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackValidator from 'webpack-validator'

module.exports = env => {
    const config = WebpackValidator({
        context: resolve('src'),
        entry: {
            app: './index.js',
        },
        output: {
            path: resolve('dist'),
            filename: 'bundle.js',
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel',
                    exclude: /node_modules/
                },
                {
                    test: /\.s[ac]ss$/,
                    loader: ExtractTextPlugin.extract('css!sass')
                },
            ],
        },
        plugins: [
            new ExtractTextPlugin('css/styles.css', { allChunks: true } ),
            new ProgressBarPlugin(),
            new HtmlWebpackPlugin({
                template: './index.html',
                inject: 'head'
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: 'development'
                }
            })
        ]
    });

    if (env.debug) {
        console.log(config);
        debugger; // eslint-disable-line
    }

    return config
};