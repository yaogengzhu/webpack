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


### 如何提取公共资源

基础库分离

思路：将 react 、react-dom 基础包通过cdn引入、不打入 bundle中

使用 html-webpack-externals-plugins


可以利用 SplitChunksPlugin 进行公共脚本分离

chunks 参数说明
- async 异步引入的库进行分离 （default）
- initial 同步引入的库进行分离
- all 所有的库进行分离

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 20000, // 最小包体积
    minRemainingSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    enforceSizeThreshold: 50000,
    cacheGroups: {
      commons: {
        test: /(react|react-dom)/,
        name: 'venders',
        chunks: 'all'
      },
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
}
```


```bash
pnpm add html-webpack-externals-plugin -D 
```

```js
...
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'react',
      entry: 'https://unpkg.com/react@18/umd/react.production.min.js',
      global: 'React'
    },
    {
      module: 'react-dom',
      entry: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
      global: 'ReactDOM'
    }
  ]
})
...
```

### tree shaking

webpack 默认支持

写法必须时 es6

代码不会被执行，不可到达
代码执行的结果不会被用到
代码只会影响到死变量 （只读不写）

利用 ES6 模块的特点
- 只能作为模块顶层的语句出现
- import 的模块名只能是字符串常量
- import binding 是immutable

代码擦出： uglify 阶段删除无用代码


### ScopeHoisting 使用和原理分析

现象： 构建后的代码存在大量的闭包代码

导致的问题

- 大量函数 闭包包裹代码，导致代码体积增大（模块越多越明显）
- 运行代码时创建的函数作用域变大，内存开销变大。

原理： 将所有的模块的代码按照引用顺行放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突。

对比：通过scope hoisting 可以减少函数声明代码和内存开销。

webpack mode -> production 默认开启


### 代码分割和动态import

代码分割的意义
对于大的web 应用来讲，将所有的代码都放在一个文件中显然不够有效，特别是当你的某些代码块是在某些特殊的时候才被使用到。webpack有一个功能就是将你的代码分割成chunks ，当代码运行需要它们的时候在进行加载。

适用的场景：
- 抽离相同代码一个共享块
- 脚本懒加载，使得初始值下载的代码更小

懒加载JS脚本的方式
- CommonJs: require.ensure
- es6： 动态import (目前没有原生支持，需要babel支持)

如何使用动态的import?

安装插件
```bash
pnpm add @babel/plugin-syntax-dynamic-import -S -D
```

```js
[
  ...
  plugins: ['@babel/plugin-syntax-dynamic-import']
  ...
]
```

### webpack 和 eslint的结合 

Eslint 必要性， 代码规范检查
Airbnb： eslint-config-airbnb 、 eslint-config-airbnb-base
腾讯： eslit-config-alloy

制定团队Eslint 规范

- 不重复造轮子，基于eslint:recommend 配置并改进
- 能帮助发现代码错误、全部开启。
- 帮助保持团队的代码风格统一、而不是限制开发体验。

Eslint 如何执行落地
- 和CI/CD 系统集成
  bulid 之前增加lint-pipline

- 和 webpack 集成

**本地开发阶段增加precommit 钩子**

[可以参考](https://github.com/yaogengzhu/daily-share/issues/161)

集成webpack

```bash
pnpm add eslint eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-ally -D
```

```bash
pnpm add eslint-loader -D
```

```bash
# pnpm add babel-eslint -D
# 更新
pnpm add @babel/eslint-parser - D

pnpm add eslint-config-airbnb -D
```

### webpack 打包库和组件

- 除了用来打包应用，也可以用来打包Js库

实现一个大整数加法库的打包

- 需要打包一个压缩版本和非压缩版本
- 支持AMD/CJS/ESM 模块引入


```js
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  mode: 'none',
  entry: {
    'large-number': './src/index.js',
    'large-numbr.min': './src/index.js'
  },
  output: {
    filename: '[name].js',
    library: 'largeNumber',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
      }),
    ]
  }
}
```

### 实现 SSR 打包

服务端渲染SSR是什么？

渲染： HTML + CSS + JS + Data -> 渲染后的HTML

服务端： 
- 所有的模块等资源存储在服务端
- 内网机器拉取数据更快
- 一个HTML返回所有的数据

交互流程

请求开始 -> Server -> {
   Html   -> server render -> 浏览器解析并渲染 -> 加载其他js
   data
}

SSR 的优势
- 减少白屏时间
- 对于SEO友好

渲染思路

服务端
- 使用 react-dom/server 的renderToString 方法将React 组件渲染成字符串
- 服务端路由返回对应的模版

客户端
- 打包针对服务端的组件


### 当前构建的日志显示

统计信息 Stats 

借助插件

```
pnpm add friendly-errors-webpack-plugin
```

### 构建异常和中断处理

在CI/CD 的pipline 或者 发布系统需要知道当前构建状态

每次构建完成后输入 echo$ 获取错误码

如何主动捕获并处理构建错误？

compiler 每次构建接受后会触发done 这个hook

process.exit 主动处理构建报错！

### 构建配置包设计

构建配置抽离成npm 包的意义

通用性

- 业务开发者无需关注构建配置
- 统一团队构建脚本

可维护性
- 构建配置合理拆分
- README文档、ChangeLog 文档等

质量
- 冒烟测试、单元测试、测试覆盖率
- 持续集成

设计
通过多个配置文件管理不同环境的webpack配置

- 基础配置：webpack.base.js
- 开发环境：webpack.dev.js
- 生产环境：webpack.prod.js
- SSR 环境：webpack.ssr.js

抽离一个npm包统一管理
- 规范：Git commit 日志、README、ESlint规范、Semver 规范
- 质量： 冒烟测试、单元测试、测试覆盖率 和 CI

使用Eslint 规范构建脚本

```bash
pnpm add eslint-config-airbnb-base -D
```

eslint --fix 自动修复

### 冒烟测试执行

构建是否成功

- 每次构建完成 build 目录是否有内容输出
- 是否有 js、css 等 静态资源文件
- 是否有html 文件

判断构建是否成功


### 发布npm

添加用户 npm adduser

升级版本 (自动修改版本)
- 升级补丁补丁版本： npm version patch
- 升级小版本号：    npm version minor
- 升级大版本：  npm version major

发布版本： npm publish

### Git规范和changelog 生成

良好的 Git commit 规范优势
- 加快 code Review 的流程
- 根据Git Commit 元数据生成changeLog
- 后续维护者可以知道 feature 被修改的原因


如何使用husky

[指引](https://github.com/yaogengzhu/daily-share/issues/161)

### 使用webapck 内置的stats

```js
{
  ...
  "build:stats": "webpack --config webpack.prod.js --json > stats.json",
}
```

### 使用speed-measure-webpack-plugin 速度分析

```bash
pnpm add speed-measure-webpack-plugin -D
```


### 借助 webpack-bundle-analyzer 分析体积

```bash
pnpm add webpack-bundle-analyzer -D
```

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

...
[
  new BundleAnalyzerPlugin()
]
...
```

### 使用高版本的Node webpack

提升构建速度

v8 带来的优化 (for of 代替 forEach、Map Set 代替Object、 includes 替代indexOf)

默认使用更快的md4 hash算法


### 使用多进程/多实例构建：资源并行解析可选方案

happyPack 不做详细的介绍

使用thread-loader

```bash

pnpm add thread-loader -S
```

### 多进程并行压缩

```bash
 pnpm add webpack-parallel-uglify-plugin
```

更推荐使用 terser-webpack-plugin 

```bash
pnpm add terser-webpack-plugin 
```

### 分包 设置Externals

方法： 使用DLLPlugin 进行分包，DllReferencePlugin 对manifest.json 引用


### 缓存

目的： 提升二次构建速度

缓存思路：
- babel-loader
- terser-webpack-plugin
- cache-loader 或者 hard-soucrce-webpack-plugin


```bash
 pnpm add cache-loader 

 pnpm add hard-soucrce-webpack-plugin # (webpack5.x 不再支持)
``` 
