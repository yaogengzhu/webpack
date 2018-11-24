// const path = require('path');

// module.exports = {
//     enter:path.join(__dirname,'./src/main.js'),
//     output:{
//         path:path.join(__dirname,'./dist'),
//         filename:'bund.js'
//     }
// };

const path = require('path');
// hot设置成功的第二步
const webpack = require('webpack');
// 引入html-webpack-plugin  
var htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: 'production',
    // 设置dev模块-- --
    devServer:{
        open:true,
        port:3000,
        contentBase:'src',
        // hot 设置得成功的第一步
        hot:true
    },
    // hot设置成功的第三步
    plugins:[
        new webpack.HotModuleReplacementPlugin,
        // 将html-webpack-plugin插件放到这个数组中
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./src/index.html'),//指定要放入内存中的页面 
            filename:'index.html' //指定生成页面的名称
        })
    ],
    module:{
        rules:[
            {
                test:/\.css$/,use:['style-loader','css-loader']
            }
        ]
    }
};