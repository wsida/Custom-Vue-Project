# api 目录
> 提供项目涉及的接口配置信息，封装成通用方法 `$api` ，方便接口调用。

# index
> 解析 `modules` 目录，获取相关模块接口配置，然后封装成 `$api` 全局方法。

# modules
> 存放模块接口配置文件，必须是 `*.js` 文件，提供一个暴露模块，返回相应配置。

# 接口配置
- key: 作为接口配置的键值，同时也是 $api 调用方法的键值。
- url: 接口地址，支持 restful 接口，地址参数会从 `data` 读取，进行替换。
- method: 接口请求方式
- description: 接口描述 - 不作为请求参数
- data: 接口参数列表，所有参数必须填写，自动过滤列表以外的参数。

# $api 方法
> $api['modules/key'](data, config)
- modules: modules目录的对应文件名
- key: 接口键值
- data: 接口参数
- config: 额外的接口配置
