# api 目录
> 提供项目涉及的接口配置信息，封装成通用方法 `$api` ，方便接口调用。

# index
> 解析 `modules` 目录，获取相关模块接口配置，然后封装成 `$api` 全局方法。

# modules
> 存放模块接口配置文件，必须是 `*.js` 文件，提供一个暴露模块，返回相应配置。

# 接口配置
- key: 作为接口配置的键值，同时也是 $api 调用方法的键值。
- url: 指定接口地址，支持 restful 接口，地址带有的参数（:key）会从 `data` 中读取，自动进行数值替换，**因此data中必须包含参数字段，否则会导致接口地址错误。**
- method: 接口请求方式
- description: 接口描述 - 不作为请求参数
- data: 接口参数列表，所有参数必须填写，包括url上的参数（:key)，自动过滤列表以外的参数。

# $api 方法
> $api['modules/key'](data, config)
- modules: modules目录的对应文件名
- key: 接口键值
- data: 接口参数
- config: 额外的接口配置
