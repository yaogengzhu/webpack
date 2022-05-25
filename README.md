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


### 文件指纹

打包输出的文件后缀。

**hash** 和整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值就会更改。
**chunkhash** 和 webpack 打包的chunk有关，不同的entry会生成不同的chunkhash值。
**contenthash** 根据文件内容来定义hash, 文件内容不变、则contenthash不变。


```js
...
output: {
  clean: true,
  filename: '[name][chunkhash:6].js', // 使用chunkhash
  path: path.join(__dirname, 'dist/js')
},
...
```


对于css，可以使用contenthash

```bash
pnpm add mini-css-extract-plugin -D
```

```js
...
```

图片指纹设置

| 占位符        | 含义                          |
|---------------|-------------------------------|
| [ext]         | 资源后缀名                    |
| [name]        | 文件名称                      |
| [path]        | 文件的相对路径                |
| [folder]      | 文件所在的文件夹              |
| [contenthash] | 文件的内容hash, 默认是md5生成 |
| [hash]        | 文件的内容hash, 默认是md5生成 |
| [emoji]       | 一个随机指代文件内容的emoji   |


### 代码压缩

- HTML 压缩
- CSS  压缩
- JS 压缩

**js 文件的压缩**

内置了 `uglifyjs-webpack-plugin`

**css 文件压缩**

/ v4版本使用

使用 `optimize-css-assets-webpack-plugin`

```bash
pnpm add optimize-css-assets-webpack-plugin -D
```

同时使用cssnano (css预处理器)

```bash
pnpm add cssnano -D
```

对于当前版本的v5而言

使用 如下方式
```bash
pnpm add -D css-minimizer-webpack-plugin
```

**html 文件压缩**

```bash
pnpm add html-webpack-plugin -D
```

```js
new HtmlWebpackPlugin({
  template: path.join(__dirname, './public/index.html'),
  filename: 'index.html',
  chunks: ['index'],
  inject: true,
  minify: {
    html5: true,
    collapseWhitespace: true,
    preserveLineBreaks: false,
    minifyCSS: true,
    removeComments: true,
  }
})
```

### 对于目录清理

对于webpack5.X 而言

```js
output: {
  ...
  clean: true, // 清空构建目录
  ...
},
```

### css增强功能、css3前缀处理

浏览器内核
- trident(-ms)
- Geko(-moz)
- Webkit(-webkit)
- Presto(-o)

autoprefixer 插件 自动补全CSS3前缀 & postcss-loader

针对webpack4.x
```bash
pnpm add postcss-loader autoprefixer -D
```

```js
{
  test: /\.less$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'less-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [
          require('autoprefixer')({
            browsers: ['last 2 versions', '>1%', 'ios 7']
          })
        ]
      }
    }
  ]
},
```

针对webpack5.X

[可参考该文章](https://blog.csdn.net/huangbiao86/article/details/123133779)

```bash
pnpm add -D postcss-loader postcss
```

```js
{
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [autoprefixer({
        overrideBrowserslist: [
          'last 10 Chrome versions',
          'last 5 Firefox versions',
          'Safari >= 6',
          'ie> 8'
        ]
      })]
    }
  }
}
```

### 浏览器的分辨率

页面适配 rem 

rem是什么？
W3C 对rem 的定义： font-size of the root element

rem 和 px 的对比
- rem 是相对单位
- px 是绝对单位

移动端CSS px 自动转成rem

使用 px2rem-loader

```bash
pnpm add px2rem-loader -D
```

页面渲染时计算根元素的font-size 值

可使用手淘的lib-flexible库

```bash
pnpm add lib-flexible -S
```

### 资源内联的意义

代码层面：
- 页面框架的初始化脚本
- 上报相关打点
- css 内联避免页面闪动

请求层面： 减少HTTP 网络请求数
- 小图片或者字体内联(url-loader)

raw-loader 内联 html

```js
<script><%{require('raw-loader!babel-loader!./meta.html!')%></script>
```

```html
<head>
    <%=require('raw-loader!. /meta.html')%>
    <title>Document</title>
    <script><%=require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible') %></script>
</head>
```

**css内联**

方案1： 借助 style-loader

方案2: html-inline-css-webpack-plugin


### 多页面应用打包

每一个页面对应一个entry, 一个html-webpack-plugin 

缺点：每次新增或删除页面都需要改webpack 配置

动态获取 entry 和 设置 html-webpack-plugin 数量

利用glob.sync 

```js
entry: glob.sync(Path.join(__dirname, './src/*/index.js'))
```

如何配置
```js
...
const glob = require('glob')
const setMAP = () => {
  const entry = {}
  const htmlWebpackPlugin = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
  Object.keys(entryFiles).forEach((index) => {
    const entryFile = entryFiles[index]
    const match = entryFile.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]
    entry[pageName] = entryFile
    htmlWebpackPlugin.push(new HtmlWebpackPlugin({
      template: path.join(__dirname, `src/${pageName}/index.html`),
      filename: `${pageName}.html`,
      chunks: [pageName],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        removeComments: true,
      }
    }))
  })
  return {
    entry,
    htmlWebpackPlugin
  }
}
...
```

### 使用source map

作用：通过sorce map 定位到源码

开发环境开启，线上环境关闭

线上排查问题时候可以将source map 上传到错误监控系统

| 关键字     | 描述                                       |
|------------|--------------------------------------------|
| eval       | 使用eval包裹模块代码                       |
| source map | 产生.map文件                               |
| cheap      | 不包含列信息                               |
| inline     | 将.map 作为dataURL 嵌入，不单独.map 文件｜ |
| module     | 包含loader 的source map                    |

通过组合、可以看到 源码、行