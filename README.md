# Custom-Vue-Project

## project-scaffold 脚手架搭建跳坑
> 配置：设置dev、prd两种环境，根据webpack配置项进行环境配置。接入mockjs实现请求拦截返回模拟数据，在dev环境下配置proxy代理。
> 路由：router路由，使用 *动态路由* 或者 *全局路由守卫* 实现路由权限控制。
> 菜单：根据角色权限返回菜单项，菜单自动渲染。
> Axios：全局声明axios请求实例，绑定 `$get` 、 `$post` 、 `$axios` 实例方法到 `Vue.prototype`，分别设置请求、响应拦截器。
> Store：根据模块划分store

### webpack/vue-cli3.0 配置跳坑
1. Vue-cli3.0 可以直接配置 `.env`、`.env.[mode]`、`.env.local`、`.env.[mode].local` 环境变量文件。内置 `webpack.DefinePlugin`插件，使用 `.env[mode]` 配置 需要通过 `package.json` script 配置中指定 `--mode [mode]` 切换环境。
*注意*: 在 `src` 目录下，使用 `process.env` 返回的是*客户端*的环境变量，不能直接访问 `.env` 环境变量文件的配置内容，只有以 `VUE_APP_` 开头的变量才会被自动添加到*客户端*的环境变量中，在src目录下才能正常访问。
*注意*：只有在src目录内属于客户端执行环境，可以使用 es6 语法的`import` `export`模块语法，其他目录下都实在 node 环境下，需要使用 node 对应语法，比如模块语法（CommonJS ）中的 `module.exports` `require`。
### mockjs 配置跳坑
1. mock()：mock方法可用于拦截xhr请求返回指定内容，在控制台不会显示xhr请求记录，除非不能正常拦截会向服务端获取。mockjs在proxy代理前就已经拦截，设置proxy暂不起作用。
2. 拦截失败-mock参数常见设置错误：
  拦截路由设置错误：第一个参数设置拦截接口路由，支持正则、字符串，不需要设置完整的接口请求地址，否则会在xhr请求中匹配失败导致拦截失败，mockjs根据 uri+type 来匹配请求。
  **例如：接口请求地址为 `http://localhost:8080/user/info`，第一个参数只需要设置 `/user/info` 即可，不用填写完整接口地址。**
3. 拦截失败-axios在request添加拦截器改变url导致mock无法拦截
   在axios在request拦截器中设置 `config.baseUrl` 接口基路径，改变请求接口地址，mockjs认为我们没有定义对应的拦截url, 因此就放过了这个请求，从而向服务器获取。
   **解决：1)添加前缀变量加到拦截url `/${ctx}/*`；2）使用正则表达式。实际上就是修改所有拦截url** 
### router 配置跳坑
1. base：默认值为 `/`，该配置取决于项目部署的服务器资源目录，如果部署在 `/app/` 目录下，则需要配置 `base: '/app/'`，这样路由跳转就会正确带上 `/app/`。