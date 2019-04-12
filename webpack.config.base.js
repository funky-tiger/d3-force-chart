const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module:{
        rules:[
            { // 打包html中的图片
                test:/\.html$/,
                use:'html-withimg-loader'
            },
            { // 打包js和css中的图片
                test:/\.(png|jpg|gif)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit:20,
                        outputPath:'images',
                    }
                }
            },
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{ // babel-loader -> es6转换为es5
                        presets:[
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins:[
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                },
                include:path.resolve(__dirname,'src'),
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use:[
                    MiniCssExtractPlugin.loader, //抽离css 通过link标签
                    'css-loader',
                    'postcss-loader',
                ]
            }
        ]
    }
   }