## Middleware Configuration

The middleware can be configured according to the `MiddlewareConfig`. `@idio/core` comes with some installed middleware as dependencies to speed up the process of creating a web server. Moreover, any custom middleware which is not part of the bundle can also be specified here (see [Custom Middleware](#custom-middleware)).

Each middleware accepts the following properties:

```table
[
  ["Property", "Description", "Default"],
  ["`use`", "Whether to use this middleware for every request. If not set to `true`, the configured middleware function will be included in the `middleware` property of the returned object, which can then be passed to a router configuration (not part of the `@idio/core`).", "`false`"],
  ["`config`", "Configuration object expected by the middleware constructor.", "`{}`"],
  ["`...props`", "Any additional specific properties (see individual middleware configuration).", null]
]
```


%MACRO middleware
%~ width="15"%
<a href="$3"><img src="https://raw.github.com/idiocc/core/master/images/$4.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong>[$1](###)</strong>: $2.
<hr/>

%TYPEDEF types/options/$4.xml%
</summary>

%TYPEDEF types/config/$4.xml%

$5
</details>
%

%USE-MACRO middleware
<data>Session</data>
<data>handling sessions via cookies</data>
<data>https://github.com/koajs/session</data>
<data>session</data>
<data/>
%

%USE-MACRO middleware
<data>File Uploads</data>
<data>receiving files on the server</data>
<data>https://github.com/koa-modules/multer</data>
<data>multer</data>
<data/>
%

%USE-MACRO middleware
<data>Cross-Site Request Forgery</data>
<data>prevention against CSRF attacks</data>
<data>https://github.com/koajs/csrf</data>
<data>csrf</data>
<data/>
%

%USE-MACRO middleware
<data>Parse Body</data>
<data>parsing of data sent with requests</data>
<data>https://github.com/koajs/body-parser</data>
<data>bodyparser</data>
<data/>
%

%USE-MACRO middleware
<data>Checking Auth</data>
<data>a simple function which throws if <code>ctx.session.user</code> is not set. Non-configurable</data>
<data>#</data>
<data>checkauth</data>
<data/>
%

%USE-MACRO middleware
<data>Logging</data>
<data>a logger of incoming requests / response times and sizes</data>
<data>https://github.com/koajs/logger</data>
<data>logger</data>
<data/>
%

%USE-MACRO middleware
<data>Compression</data>
<data>enabling gzip and other compression</data>
<data>https://github.com/koajs/compress</data>
<data>compress</data>
<data/>
%

%USE-MACRO middleware
<data>Static Files</data>
<data>serving files from filesystem</data>
<data>https://github.com/koajs/static</data>
<data>static</data>
<data>
For example, the below configuration will serve files from both the `static` directory of the project, and the _React.js_ dependency. When `NODE_ENV` environment variable is set to `production`, files will be cached for 10 days.

%EXAMPLE: example/static, ../src => @idio/core%
%FORK example/static%
</data>
%

%USE-MACRO middleware
<data>CORS</data>
<data>return Cross-Origin Resource Sharing headers</data>
<data>https://github.com/koajs/cors</data>
<data>cors</data>
<data/>
%

%USE-MACRO middleware
<data>Frontend</data>
<data>serve JS and CSS files as modules for modern browsers</data>
<data>https://github.com/idiocc/frontend</data>
<data>frontend</data>
<data/>
%

%~%