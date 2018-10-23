const path = require('path');

module.exports = {
    mode: 'development',
    devtool: "source-map",
    entry: {
        winter: './src/winter.js',
        e3_difficulty: './src/e3_difficulty.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../../content/scripts')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};
