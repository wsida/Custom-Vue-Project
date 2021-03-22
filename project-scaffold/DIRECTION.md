# 项目说明

## 目录结构

- build（构建配置目录）
- public（公共资源目录）
- src（项目目录）
  - api（项目api接口目录）
  - assets（项目资源目录）
  - components（项目组件目录）
  - config（全局配置目录）
  - directives（自定义指令目录）
  - layouts（页面布局文件目录）
  - i18n（多语言配置）
  - mock（mock目录-本地环境开启）
  - plugins（插件目录）
  - router（路由树目录）
  - store（store目录）
  - styles（全局样式目录）
  - utils（工具方法目录）
  - views （项目页面目录）
  - App.vue （项目App）- 提供单页面路由视图 router-view
  - main.js（构建入口 - 加载插件、插件全局配置）

## api 目录

> 提供项目涉及的接口配置信息，封装成通用方法 `$api` ，方便接口调用。

- index 文件 -解析 `modules` 目录，获取相关模块接口配置，然后封装成 `$api` 全局方法。
- modules 目录（存放模块接口配置文件，必须是 `*.js` 文件，暴露相应配置对象）

**使用 `require.context()` 方法一次性引入目录文件模块**

### 接口配置

- key: 作为接口配置的键值，同时也是 $api 调用方法的键值。
- url: 指定接口地址，支持 restful 接口，地址带有的参数（:key）会从 `data` 中读取，自动进行数值替换，**因此data中必须包含参数字段，否则会导致接口地址错误。**
- method: 接口请求方式
- description: 接口描述 - 不作为请求参数
- data: 接口参数列表，所有参数必须填写，包括url上的参数（:key)，自动过滤列表以外的参数。

### $api 方法

> $api['modules/key'](data, config)

- modules: modules目录的对应文件名
- key: 接口键值
- data: 接口参数
- config: 额外的接口配置

## mock 目录

> 本地 `.dev` 才执行，拦截接口请求，返回mock数据。需要按结构定义相应接口路由及mock数据。

- index 文件 -mock启用文件
- utils 文件 -定义mock相关工具方法
- services 目录（定义模块接口）

**使用 `require.context()` 方法一次性引入目录文件模块**

*扩展：*
`require.context(directory, useSubdirectories, regExp): function`

- irectory: 要查找的文件路径
- useSubdirectories: 是否查找子目录
- regExp: 要匹配文件的正则
- return: 返回一个函数，通过 `.keys()` 返回匹配的所有模块地址，传入对应key值，获取对应模块内容。通过正则可解析文件名称作为模块名称。

## routes 目录

> 定义项目路由配置。

- index 文件 -最终路由配置对象。
- staticRoutes 文件 -配置公共路由，不需要用户权限验证
- asyncRoutes 文件 -根据接口返回权限码返回动态路由配置 或者 需要根据权限（permitCode）动态计算的路由

*备注* 目前登录页由项目提供，需要登录后才能获取路由权限，不建议使用动态路由，而直接根据路由的permitCode 在全局路由守卫拦截。如果在index.html可以获取账号权限（登录页由其他项目管理）则建议使用动态路由。asyncRoutes 文件提供 `getRoutes` 方法返回动态路由配置。

## store 目录

- index 文件 -根store
- types 文件 -定义mutations、actions名称常量
- modules 目录（定义store模块）
**注意** modules 如果启用 命名空间（namespaced: true），dispatch、commit 要加模块名称前缀，但mapState可以传入`模块名称(1参)`以及直接使用`字符串数组(2参)`就能得到模块state，如果禁用 命名空间，dispatch、commit 不需要加模块前缀，但是模块state需要在 mapState 使用`对象(1参)`参数建立映射关系([string]: (state) => any)。

## styles 目录

> 定义全局样式，避免 `.vue` 文件嵌套复杂的样式，只需要专注页面结构以及页面逻辑。

- index -根样式
- base 文件 -基础样式
- common 目录（存放公共内容）
  - index 文件 -定义类结构变量
  - mixins 文件 -混合类
  - variable 文件 -定义公共变量
- components 目录（定义组件样式）
- layouts 目录（定义布局组件样式）
- views 目录（定义模块页面样式）

## i18n 目录

> 定义多语言配置文件，目前只设置中文、英文两个语言版本

- index 文件 -解析语言配置，创建`i18n`对象
- language 目录 -存放对应语言配置，文件名作为语言，并需要在各个语言文件内配置对应名称的文案配置，这一步是为了顶部多语言切换能够正确显示可切换的语言文案。

## config 目录

> 定义项目需要使用的或者需要多处使用的静态内容。

- index 文件
- cookies 文件 -定义项目涉及的所有cookie的名称。
- charts 文件 -定义图标配置项默认配置，方便风格统一。
- router 文件 -定义路由创建所需要的默认配置项，以及全局路由拦截。
- axios 文件 -定义axios创建所需要的默认配置项，以及axios全局拦截器，包括interceptor.request 和 interceptor.response
