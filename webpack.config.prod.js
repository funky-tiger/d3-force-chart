const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin'); //压缩css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');

module.exports = merge(baseConfig,{
    optimization:{ // 优化项
        minimizer:[
            new OptimizeCss(),
            new UglifyJsPlugin({
                cache:true,//缓存
                parallel:true,//并发压缩 同时压缩多个
                sourceMap:true,//源码映射
            })
        ]
    },
    mode:'production',
    entry:'./src/index.js',
    output:{
        filename:'index.js',
        path: path.resolve(__dirname,'lib'), 
        libraryTarget: 'umd',  //发布组件专用
        library: 'ReactCmp',
    },
    plugins:[ // 数组 配置所有的webpack插件
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:'css/main.css'
        })
    ]
})