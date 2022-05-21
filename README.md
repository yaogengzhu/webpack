# webpack

## loader

webpack开箱即用仅支持js 和 json 两种文件类型，通过loaders去支持其他文件类型并且把他们转化成有效的模块，并且可以添加到依赖图中。

本身是一个函数，接收源文件作为参数，返回转换的结果。

常用的loader

| 名称          | 描述                      |
|---------------|---------------------------|
| babel-loader  | 转换es6、es7新特性与法    |
| css-loader    | 支持.css文件的加载和解析  |
| less-loader   | 支持.less文件的加载和解析 |
| ts-loader     | 将ts转换成js              |
| filer-loader  | 进行图片、字体等进行打包  |
| raw-loader    | 将文件以字符串的形式导入  |
| thread-loader | 多进程打包js和css         |

loader基本用法
```js
...
module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ],
},
...
```

## plugins

插件用于bundle文件的优化，资源管理和环境变量注入，作用于整个构建过程

**任何loader无法完成的事情，都可以通过plugins去实现**


常用的plugins

| 名称                    | 描述                                       |
|-------------------------|--------------------------------------------|
| CommonsChunkPlugin      | 将chunks相同的模块提取成公共的js           |
| ExtracTextWebpackPlugin | 将css从bundle文件中提取成一个单独的css文件 |
| CopyWebpackPlugin       | 将文件或者文件夹拷贝到构建输出目录         |
| HtmlWebpackPlugin       | 创建html文件去承载输出的bundle             |
| UglifyjsWebpackPlugin   | 压缩js                                     |
| ZipWebpackPlugin        | 打包出的资源生成一个zip包                  |

基本用法

```js
...
plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
],
...
```

## mode

mod用来指定当前的构建环境：production、development、none

设置mode 可以使用webpack 内置函数、默认值为production

| 选项        | 描述                                                           |
|-------------|----------------------------------------------------------------|
| development | 设置 process.env.NODE_ENV 的值为`development`                  |
| production  | 设置 process.env.NODE_ENV 的值为`production`、开启部分插件使用 |
| none        | 不开启任何优化项                                               |