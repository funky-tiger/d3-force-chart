const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    devtool: 'cheap-module-source-map',
    devServer:{ // 开发服务器的配置
        port:3030,
        progress:true, // 打包过程中的进度条
        contentBase:'./example', // 启动服务的目录
        open:true, // 自动打开浏览器
        compress:true,// 开启 gzip 压缩
    },
    mode:'development',
    entry:'./src/index.js',
    output:{
        filename:'index.js',
        path: path.resolve(__dirname,'lib'), 
    },
    plugins:[ // 数组 配置所有的webpack插件
        new HtmlWebpackPlugin({
            inject: true,
            template:path.resolve(__dirname, 'example/index.html'),//模版路径
            filename:'index.html', // 模版打包后的名字
        }),
        new MiniCssExtractPlugin({
            filename:'css/main.css'
        })
    ]
})