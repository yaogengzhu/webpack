前置知识！ 采用pnpm管理依赖. pnpm使用方式与npm基本一致

安装
```bash
npm i -g pnpm 
```

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


## 处理文件
### 资源解析、解析es6

使用babel-loader

babler的配置文件是： .babelrc

```bash
@babel/core @babel/preset-env babel-loader
```


解析 jsx 语法


### 解析css

```bash
pnpm add style-loader css-loader -D
```

配置
```js
 ...
module: {
    rules: [
      ...
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
      ...
    ],
},
...
```

处理less

安装less-loader less

```bash
pnpm add less-loader less -D
```

同理写好配置
```bash
module: {
    rules: [
      ...
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }
      ...
    ],
},
```

### 解析图片和解析字体资源

```bash
pnpm add file-loader
```

使用配置

```js
module: {
    rules: [
      ...
      { test: /\.(png|jpg|gif|jpeg|svg)$/, use: 'file-loader' },
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: 'file-loader' },
      ...
    ],
},
```

使用url-loader

```bash
pnpm add url-loader -D
```

对于小的图片，可以base64处理
```bash
{
  test: /\.(png|jpg|gif|jpeg|svg)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 20280, // 20k, 小于20k 自动base64
      }
    }
  ]
},
```

### 修改webpack的文件监听

文件监听是在发现源码发生变化时，自动重新构建出新的输出文件。

webpack开启监听模式，有两种方式：
- 启动 webpack 命令式， 带上 -- watch 参数
- 在配置webpack.config.js 中设置 watch: true


**文件监听原理分析**

轮询判断文件的最后编辑时间是否发生变化

某个文件发生了变化，并不会立即告诉监听者，而是先缓存起来，等 aggregateTimeout 

```js
modules.export = {
  watch: true, // 默认为false
  watchOptions: {
    ignore: /node_modules/, // 忽略文件
    aggregateTimeout: 300, // 监听到文件变化后等300ms再去执行，默认300ms
    poll: 1000, // 判断文件是否发生变化时通过不停的询问系统指定文件有没有发生变化时现的，默认每秒1000次
  }
}
```

### webpack的热更新 

webpack-dev-server

- WDS 不刷新浏览器
- WDS 不输出文件，而是放在内存中
- 使用 HotModuleReplacementPlugin 插件


```js
...
plugins: [
  new webpack.HotModuleReplacementPlugin()
],
devServer: {
  static: {
    directory: path.join(__dirname, 'public'), // webpack5.x 静态文件文章
  },
  hot: true,
}
...
```


webpack-dev-middleware

WDM 将webpack 输出文件传给服务器， 适用于灵活的定制场景

**原理：**

webpack Compile: 将JS编译成Bundle 

HMR Server 将热更新的文件输出给 HMR Runtime

Bundle server: 提供给文件在浏览器的访问

HRM runtime: 会被注入到浏览器，将更新文件的变化

bundle.js: 构建输出的文件