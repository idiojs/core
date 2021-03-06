@idio/core
===

[![npm version](https://badge.fury.io/js/%40idio%2Fcore.svg)](https://npmjs.org/package/@idio/core)

<a href="https://github.com/idio/core"><img src="https://raw.github.com/idiocc/core/master/images/logo.svg?sanitize=true" width="150" align="left"></a>

`@idio/core` is a _Koa2_-based web server with some pre-installed middleware which facilitates quick creation of a web server with the essential functionality, such as serving static files, compression, body parsing, _etc_. It also provides full JSDoc documentation of all options for completion in IDEs. Other components such as `@idio/database`, `@idio/route` and `@idio/jsx` allow to build more complex websites (to come).

```sh
yarn add -E @idio/core
```

<p align="center">
<a href="https://idio.cc"><img alt="Developer-Friendly Suggestions For Middleware" src="app2.gif"></a>
</p>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async core(middlewareConfig?: MiddlewareConfig, config?: Config): IdioCore`](#async-coremiddlewareconfig-middlewareconfigconfig-config-idiocore)
  * [`MiddlewareConfig`](#type-middlewareconfig)
  * [`Config`](#type-config)
  * [`IdioCore`](#type-idiocore)
- [Middleware Configuration](#middleware-configuration)
  * [Session](#session)
  * [File Uploads](#file-uploads)
  * [Cross-Site Request Forgery](#cross-site-request-forgery)
  * [Parse Body](#parse-body)
  * [Checking Auth](#checking-auth)
  * [Logging](#logging)
  * [Compression](#compression)
  * [Static Files](#static-files)
  * [CORS](#cors)
  * [Frontend](#frontend)
- [Custom Middleware](#custom-middleware)
- [Router Set-up](#router-set-up)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import idioCore from '@idio/core'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `async core(`<br/>&nbsp;&nbsp;`middlewareConfig?: MiddlewareConfig,`<br/>&nbsp;&nbsp;`config?: Config,`<br/>`): IdioCore`

The `@idio/core` accepts 2 arguments which are the middleware configuration object and server configuration object. It is possible to start the server without any configuration, however it will do nothing, therefore it is important to add some middleware configuration.

__<a name="type-middlewareconfig">`MiddlewareConfig`</a>__: Middleware configuration for the `idio` `core` server.

|    Name    |                                                                              Type                                                                               |                                                      Description                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| session    | <em>[SessionOptions](#type-sessionoptions)</em>                                                                                                                 | `session` options.                                                                                                     |
| multer     | <em>[MulterOptions](#type-multeroptions)</em>                                                                                                                   | `multer` options.                                                                                                      |
| csrf       | <em>[CSRFOptions](#type-csrfoptions)</em>                                                                                                                       | `csrf` options.                                                                                                        |
| bodyparser | <em>[BodyparserOptions](#type-bodyparseroptions)</em>                                                                                                           | `bodyparser` options.                                                                                                  |
| compress   | <em>[CompressOptions](#type-compressoptions)</em>                                                                                                               | `compress` options.                                                                                                    |
| checkauth  | <em>[CheckauthOptions](#type-checkauthoptions)</em>                                                                                                             | `checkauth` options.                                                                                                   |
| logger     | <em>[LoggerOptions](#type-loggeroptions)</em>                                                                                                                   | `logger` options.                                                                                                      |
| static     | <em>[StaticOptions](#type-staticoptions)</em>                                                                                                                   | `static` options.                                                                                                      |
| cors       | <em>[CorsOptions](#type-corsoptions)</em>                                                                                                                       | `cors` options.                                                                                                        |
| frontend   | <em><a href="#type-frontendoptions" title="Allows to serve front-end JS files and CSS as modules, including from node_modules folder.">FrontendOptions</a></em> | `frontend` options. If the option is specified, the middleware always will be used, i.e., no need to pass `use: true`. |

__<a name="type-config">`Config`</a>__: Server configuration object.

| Name |      Type       |              Description               |  Default  |
| ---- | --------------- | -------------------------------------- | --------- |
| port | <em>number</em> | The port on which to start the server. | `5000`    |
| host | <em>string</em> | The host on which to listen.           | `0.0.0.0` |

---

The return type contains the _URL_, _Application_ and _Router_ instances, and the map of configured middleware, which could then be [passed to the router](#router-set-up).

[`import('@goa/koa').Application`](https://github.com/idiocc/goa/blob/master/doc/TYPES.md#type-_goaapplication) __<a name="type-_goaapplication">`_goa.Application`</a>__: An instance of the Koa application.

[`import('@goa/koa').Middleware`](https://github.com/idiocc/goa/blob/master/doc/TYPES.md#type-_goamiddleware) __<a name="type-_goamiddleware">`_goa.Middleware`</a>__: An async middleware function.

[`import('koa-router').Router`](https://github.com/alexmingoia/koa-router#exp_module_koa-router--Router) __<a name="type-koa-routerrouter">`koa-router.Router`</a>__: An instance of the Koa router.

[`import('http').Server`](https://nodejs.org/api/http.html#http_class_http_server) __<a name="type-httpserver">`http.Server`</a>__: An instance of the Node's Server class.

__<a name="type-idiocore">`IdioCore`</a>__: An object containing the url and references to the app, router and middleware.

|    Name    |                                                          Type                                                           |                                             Description                                              |         Default         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------- |
| url        | <em>string</em>                                                                                                         | The url on which the server is accessible.                                                           | `http://localhost:5000` |
| app        | <em><a href="#type-_goaapplication" title="An instance of the Koa application.">_goa.Application</a></em>               | The `Koa` application.                                                                               | -                       |
| router     | <em>Router</em>                                                                                                         | The `koa-router` instance.                                                                           | -                       |
| server     | <em><a href="#type-httpserver" title="An instance of the Node's Server class.">http.Server</a></em>                     | The `http` server instance.                                                                          | -                       |
| middleware | <em>Object&lt;string, <a href="#type-_goamiddleware" title="An async middleware function.">_goa.Middleware</a>&gt;</em> | The map of configured middleware functions which could then be set up to be used on a certain route. | -                       |

---

To start the server, the async method needs to be called and passed the middleware and server configuration objects. For example, the following code will start a server which serves static files with enabled compression.

```js
import idioCore from '@idio/core'

const Server = async () => {
  const { url } = await idioCore({
    logger: {
      use: true,
    },
    static: {
      use: true,
      root: 'example/static',
      mount: '/static',
    },
    compress: {
      use: true,
      config: {
        threshold: 1024,
      },
    },
  }, {
    port: 8080,
  })
  console.log('File available at: %s/static/test.txt', url)
}
```
```
File available at: http://localhost:8080/static/test.txt
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Middleware Configuration

The middleware can be configured according to the `MiddlewareConfig`. `@idio/core` comes with some installed middleware as dependencies to speed up the process of creating a web server. Moreover, any custom middleware which is not part of the bundle can also be specified here (see [Custom Middleware](#custom-middleware)).

Each middleware accepts the following properties:

|  Property  |                                                                                                                             Description                                                                                                                             | Default |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `use` | Whether to use this middleware for every request. If not set to `true`, the configured middleware function will be included in the `middleware` property of the returned object, which can then be passed to a router configuration (not part of the `@idio/core`). | `false` |
| `config` | Configuration object expected by the middleware constructor.                                                                                                                                                                                                        | `{}` |
| `...props` | Any additional specific properties (see individual middleware configuration).                                                                                                                                                                                       |         |



<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/koajs/session"><img src="https://raw.github.com/idiocc/core/master/images/session.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="session">Session</a></strong>: handling sessions via cookies.
<hr/>

__<a name="type-sessionoptions">`SessionOptions`</a>__

|   Name    |                                                  Type                                                   |                 Description                  | Default |
| --------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------- |
| __keys*__ | <em>string[]</em>                                                                                       | A set of keys to be installed in `app.keys`. | -       |
| use       | <em>boolean</em>                                                                                        | Use this middleware for every request.       | `false` |
| config    | <em><a href="#type-sessionconfig" title="Configuration passed to `koa-session`.">SessionConfig</a></em> | `koa-session` configuration.                 | -       |
</summary>

__<a name="type-sessionconfig">`SessionConfig`</a>__: Configuration passed to `koa-session`.

|   Name    |              Type              |                                                                                        Description                                                                                        |  Default   |
| --------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| key       | <em>string</em>                | Cookie key.                                                                                                                                                                               | `koa:sess` |
| maxAge    | <em>(number \| 'session')</em> | maxAge in ms with default of 1 day. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. | `86400000` |
| overwrite | <em>boolean</em>               | Can overwrite or not.                                                                                                                                                                     | `true`     |
| httpOnly  | <em>boolean</em>               | httpOnly or not.                                                                                                                                                                          | `true`     |
| signed    | <em>boolean</em>               | Signed or not.                                                                                                                                                                            | `true`     |
| rolling   | <em>boolean</em>               | Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.                                        | `false`    |
| renew     | <em>boolean</em>               | Renew session when session is nearly expired, so we can always keep user logged in.                                                                                                       | `false`    |


</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/koa-modules/multer"><img src="https://raw.github.com/idiocc/core/master/images/multer.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="file-uploads">File Uploads</a></strong>: receiving files on the server.
<hr/>

__<a name="type-multeroptions">`MulterOptions`</a>__

|  Name  |                    Type                     |              Description               | Default |
| ------ | ------------------------------------------- | -------------------------------------- | ------- |
| use    | <em>boolean</em>                            | Use this middleware for every request. | `false` |
| config | <em>[MulterConfig](#type-multerconfig)</em> | `koa-multer` configuration.            | -       |
</summary>

[`import('http').IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage) __<a name="type-httpincomingmessage">`http.IncomingMessage`</a>__

[`import('fs').Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) __<a name="type-fsstats">`fs.Stats`</a>__

[`import('koa-multer').StorageEngine`](https://github.com/expressjs/multer#storage) __<a name="type-koa-multerstorageengine">`koa-multer.StorageEngine`</a>__

[`import('koa-multer').File`](https://github.com/expressjs/multer#file-information.) __<a name="type-koa-multerfile">`koa-multer.File`</a>__

__<a name="type-limits">`Limits`</a>__: [An object](https://github.com/expressjs/multer#limits) specifying the size limits.

|     Name      |      Type       |                                 Description                                  |  Default   |
| ------------- | --------------- | ---------------------------------------------------------------------------- | ---------- |
| fieldNameSize | <em>number</em> | Max field name size in bytes.                                                | `100`      |
| fieldSize     | <em>number</em> | Max field value size in bytes.                                               | `1024`     |
| fields        | <em>number</em> | Max number of non-file fields.                                               | `Infinity` |
| fileSize      | <em>number</em> | For multipart forms, the max file size in bytes.                             | `Infinity` |
| files         | <em>number</em> | For multipart forms, the max number of file fields.                          | `Infinity` |
| parts         | <em>number</em> | For multipart forms, the max number of parts (fields + files).               | `Infinity` |
| headerPairs   | <em>number</em> | For multipart forms, the max number of header key=&gt; value pairs to parse. | `2000`     |

__<a name="type-multerconfig">`MulterConfig`</a>__

|     Name     |                                                                  Type                                                                  |                                           Description                                           | Default |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| dest         | <em>string</em>                                                                                                                        | Where to store the files.                                                                       | -       |
| storage      | <em>StorageEngine</em>                                                                                                                 | Where to store the files.                                                                       | -       |
| fileFilter   | <em>(req: IncomingMessage, file: File, callback: (error: (Error|null), acceptFile: boolean)) => void</em>                              | [Function](https://github.com/expressjs/multer#filefilter) to control which files are accepted. | -       |
| limits       | <em><a href="#type-limits" title="[An object](https://github.com/expressjs/multer#limits) specifying the size limits.">Limits</a></em> | Limits of the uploaded data.                                                                    | -       |
| preservePath | <em>boolean</em>                                                                                                                       | Keep the full path of files instead of just the base name.                                      | `false` |


</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/koajs/csrf"><img src="https://raw.github.com/idiocc/core/master/images/csrf.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="cross-site-request-forgery">Cross-Site Request Forgery</a></strong>: prevention against CSRF attacks.
<hr/>

__<a name="type-csrfoptions">`CSRFOptions`</a>__

|  Name  |                  Type                   |              Description               | Default |
| ------ | --------------------------------------- | -------------------------------------- | ------- |
| use    | <em>boolean</em>                        | Use this middleware for every request. | `false` |
| config | <em>[CSRFConfig](#type-csrfconfig)</em> | `koa-csrf` configuration.              | -       |
</summary>

__<a name="type-csrfconfig">`CSRFConfig`</a>__

|              Name              |       Type        | Description |
| ------------------------------ | ----------------- | ----------- |
| invalidSessionSecretMessage    | <em>string</em>   |             |
| invalidSessionSecretStatusCode | <em>number</em>   |             |
| invalidTokenMessage            | <em>string</em>   |             |
| invalidTokenStatusCode         | <em>number</em>   |             |
| excludedMethods                | <em>string[]</em> |             |
| disableQuery                   | <em>boolean</em>  |             |


</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/7.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/koajs/body-parser"><img src="https://raw.github.com/idiocc/core/master/images/bodyparser.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="parse-body">Parse Body</a></strong>: parsing of data sent with requests.
<hr/>

__<a name="type-bodyparseroptions">`BodyparserOptions`</a>__

|  Name  |                        Type                         |              Description               | Default |
| ------ | --------------------------------------------------- | -------------------------------------- | ------- |
| use    | <em>boolean</em>                                    | Use this middleware for every request. | `false` |
| config | <em>[BodyparserConfig](#type-bodyparserconfig)</em> | `koa-bodyparser` configuration.        | -       |
</summary>

[`import('koa').Context`](https://github.com/koajs/koa/blob/master/docs/api/context.md) __<a name="type-koacontext">`koa.Context`</a>__

__<a name="type-bodyparserconfig">`BodyparserConfig`</a>__

|    Name     |                            Type                             |                                                 Description                                                  |      Default       |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------ |
| enableTypes | <em>string[]</em>                                           | Parser will only parse when request type hits enableTypes.                                                   | `['json', 'form']` |
| encode      | <em>string</em>                                             | Requested encoding.                                                                                          | `utf-8`            |
| formLimit   | <em>string</em>                                             | Limit of the urlencoded body. If the body ends up being larger than this limit a 413 error code is returned. | `56kb`             |
| jsonLimit   | <em>string</em>                                             | Limit of the json body.                                                                                      | `1mb`              |
| strict      | <em>boolean</em>                                            | When set to true, JSON parser will only accept arrays and objects.                                           | `true`             |
| detectJSON  | <em>(ctx: Context) => boolean</em>                          | Custom json request detect function.                                                                         | `null`             |
| extendTypes | <em>{ json: string[], form: string[], text: string[] }</em> | Support extend types.                                                                                        | -                  |
| onerror     | <em>(err: Error, ctx: Context) => void</em>                 | Support custom error handle.                                                                                 | -                  |


</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/8.svg?sanitize=true" width="15"></a></p>
<a href="#"><img src="https://raw.github.com/idiocc/core/master/images/checkauth.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="checking-auth">Checking Auth</a></strong>: a simple function which throws if <code>ctx.session.user</code> is not set. Non-configurable.
<hr/>

__<a name="type-checkauthoptions">`CheckauthOptions`</a>__

| Name |       Type       |              Description               | Default |
| ---- | ---------------- | -------------------------------------- | ------- |
| use  | <em>boolean</em> | Use this middleware for every request. | `false` |
</summary>




</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/9.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/koajs/logger"><img src="https://raw.github.com/idiocc/core/master/images/logger.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="logging">Logging</a></strong>: a logger of incoming requests / response times and sizes.
<hr/>

__<a name="type-loggeroptions">`LoggerOptions`</a>__

|  Name  |                    Type                     |              Description               | Default |
| ------ | ------------------------------------------- | -------------------------------------- | ------- |
| use    | <em>boolean</em>                            | Use this middleware for every request. | `false` |
| config | <em>[LoggerConfig](#type-loggerconfig)</em> | `koa-logger` configuration.            | -       |
</summary>

__<a name="type-loggerconfig">`LoggerConfig`</a>__

|    Name     |                                              Type                                              |                                                                                       Description                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transporter | <em>(str: string, args: [string, string, string, string, string, string, string]) => void</em> | Param `str` is output string with ANSI Color, and you can get pure text with other modules like `strip-ansi`. Param `args` is a array by `[format, method, url, status, time, length]`. |


</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/10.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/koajs/compress"><img src="https://raw.github.com/idiocc/core/master/images/compress.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="compression">Compression</a></strong>: enabling gzip and other compression.
<hr/>

__<a name="type-compressoptions">`CompressOptions`</a>__

|  Name  |                      Type                       |              Description               | Default |
| ------ | ----------------------------------------------- | -------------------------------------- | ------- |
| use    | <em>boolean</em>                                | Use this middleware for every request. | `false` |
| config | <em>[CompressConfig](#type-compressconfig)</em> | `koa-compress` configuration.          | -       |
</summary>

__<a name="type-compressconfig">`CompressConfig`</a>__

|    Name     |                    Type                    |                                                          Description                                                          | Default |
| ----------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------- |
| filter      | <em>(content_type: string) => boolean</em> | An optional function that checks the response content type to decide whether to compress. By default, it uses `compressible`. | -       |
| threshold   | <em>number</em>                            | Minimum response size in bytes to compress.                                                                                   | `1024`  |
| flush       | <em>number</em>                            | Default: `zlib.constants.Z_NO_FLUSH`.                                                                                         | -       |
| finishFlush | <em>number</em>                            | Default: `zlib.constants.Z_FINISH`.                                                                                           | -       |
| chunkSize   | <em>number</em>                            | Default: `16*1024`.                                                                                                           | -       |
| windowBits  | <em>number</em>                            | Support extend types.                                                                                                         | -       |
| level       | <em>number</em>                            | Compression only.                                                                                                             | -       |
| memLevel    | <em>number</em>                            | Compression only.                                                                                                             | -       |
| strategy    | <em>number</em>                            | Compression only.                                                                                                             | -       |
| dictionary  | <em>*</em>                                 | Deflate/inflate only, empty dictionary by default.                                                                            | -       |


</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/11.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/koajs/static"><img src="https://raw.github.com/idiocc/core/master/images/static.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="static-files">Static Files</a></strong>: serving files from filesystem.
<hr/>

__<a name="type-staticoptions">`StaticOptions`</a>__

|   Name    |                    Type                     |                    Description                    | Default |
| --------- | ------------------------------------------- | ------------------------------------------------- | ------- |
| __root*__ | <em>(string \| string[])</em>               | Root or multiple roots from which to serve files. | -       |
| use       | <em>boolean</em>                            | Use this middleware for every request.            | `false` |
| mount     | <em>string</em>                             | Path from which to serve files.                   | `/`     |
| maxage    | <em>number</em>                             | How long to cache file for.                       | `0`     |
| config    | <em>[StaticConfig](#type-staticconfig)</em> | `koa-static` configuration.                       | -       |
</summary>

[`import('http').ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) __<a name="type-httpserverresponse">`http.ServerResponse`</a>__

`(res: ServerResponse, path: string, stats: Stats) => any` __<a name="type-setheaders">`SetHeaders`</a>__

__<a name="type-staticconfig">`StaticConfig`</a>__

|    Name    |                  Type                   |                                                                                             Description                                                                                             |   Default    |
| ---------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| maxage     | <em>number</em>                         | Browser cache max-age in milliseconds.                                                                                                                                                              | `0`          |
| hidden     | <em>boolean</em>                        | Allow transfer of hidden files.                                                                                                                                                                     | `false`      |
| index      | <em>string</em>                         | Default file name.                                                                                                                                                                                  | `index.html` |
| defer      | <em>boolean</em>                        | If `true`, serves after return next(), allowing any downstream middleware to respond first.                                                                                                         | `false`      |
| gzip       | <em>boolean</em>                        | Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with `.gz` extension exists.                                                  | `true`       |
| br         | <em>boolean</em>                        | Try to serve the brotli version of a file automatically when brotli is supported by a client and if the requested file with `.br` extension exists (note, that brotli is only accepted over https). | `true`       |
| setHeaders | <em>[SetHeaders](#type-setheaders)</em> | Function to set custom headers on response.                                                                                                                                                         | -            |
| extensions | <em>boolean</em>                        | Try to match extensions from passed array to search for file when no extension is sufficed in URL. First found is served.                                                                           | `false`      |


For example, the below configuration will serve files from both the `static` directory of the project, and the _React.js_ dependency. When `NODE_ENV` environment variable is set to `production`, files will be cached for 10 days.

```js
import { join, dirname } from 'path'
import idioCore from '@idio/core'

const STATIC = join(__dirname, 'static')
const REACT = join(dirname(require.resolve('react')), 'umd')

const DAY = 1000 * 60 * 60 * 24

const Static = async () => {
  const { url } = await idioCore({
    static: {
      use: true,
      root: [STATIC, REACT],
      mount: '/scripts',
      maxage: process.env.NODE_ENV == 'production' ? 10 * DAY : 0,
    },
  }, { port: 5004 })
  return url
}
```
```
Static server started on http://localhost:5004
```

</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/12.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/koajs/cors"><img src="https://raw.github.com/idiocc/core/master/images/cors.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="cors">CORS</a></strong>: return Cross-Origin Resource Sharing headers.
<hr/>

`import('koa').Context` __<a name="type-koacontext">`koa.Context`</a>__

__<a name="type-corsoptions">`CorsOptions`</a>__

|  Name  |                           Type                           |                                                                                                                                                                                                             Description                                                                                                                                                                                                              | Default |
| ------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| origin | <em>string|Array<string>|((ctx: Context) => string)</em> | The origin or an array of origins to accept as valid. In case of an array, the origin from the request headers will be searched in the array, and if found, it will be returned (since browsers only support a single `Access-Control-Allow-Origin` header). If a function is passed, it should return the string with the origin to set. If not passed, the request origin is returned, allowing any origin to access the resource. | -       |
| use    | <em>boolean</em>                                         | Use this middleware for every request.                                                                                                                                                                                                                                                                                                                                                                                               | `false` |
| config | <em>[CorsConfig](#type-corsconfig)</em>                  | `@koa/cors` configuration.                                                                                                                                                                                                                                                                                                                                                                                                           | -       |
</summary>

__<a name="type-corsconfig">`CorsConfig`</a>__

|        Name        |                   Type                   |                      Description                       |             Default              |
| ------------------ | ---------------------------------------- | ------------------------------------------------------ | -------------------------------- |
| origin             | <em>string</em>                          | `Access-Control-Allow-Origin` header value.            | `request Origin header`          |
| allowMethods       | <em>(string \| Array&lt;string&gt;)</em> | `Access-Control-Allow-Methods` header value.           | `GET,HEAD,PUT,POST,DELETE,PATCH` |
| exposeHeaders      | <em>(string \| Array&lt;string&gt;)</em> | `Access-Control-Expose-Headers` header value.          | -                                |
| allowHeaders       | <em>(string \| Array&lt;string&gt;)</em> | `Access-Control-Allow-Headers` header value.           | -                                |
| maxAge             | <em>(string \| number)</em>              | `Access-Control-Max-Age` header value in seconds.      | -                                |
| credentials        | <em>boolean</em>                         | `Access-Control-Allow-Credentials` header value.       | `false`                          |
| keepHeadersOnError | <em>boolean</em>                         | Add set headers to `err.header` if an error is thrown. | `false`                          |


</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/13.svg?sanitize=true" width="15"></a></p>
<a href="https://github.com/idiocc/frontend"><img src="https://raw.github.com/idiocc/core/master/images/frontend.svg?sanitize=true" align="left" height="100"></a>
<details>
<summary><strong><a name="frontend">Frontend</a></strong>: serve JS and CSS files as modules for modern browsers.
<hr/>

__<a name="type-frontendoptions">`FrontendOptions`</a>__: Allows to serve front-end JS files and CSS as modules, including from node_modules folder.

|   Name    |                      Type                       |                       Description                       |  Default   |
| --------- | ----------------------------------------------- | ------------------------------------------------------- | ---------- |
| directory | <em>(string \| Array&lt;string&gt;)</em>        | The directory or directories from which to serve files. | `frontend` |
| config    | <em>[FrontendConfig](#type-frontendconfig)</em> | `@idio/frontend` configuration.                         | -          |
</summary>

__<a name="type-frontendconfig">`FrontendConfig`</a>__

|  Name  |      Type       |                                                                                                           Description                                                                                                            |           Default            |
| ------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| pragma | <em>string</em> | The pragma function to import. This enables to skip writing `h` at the beginning of each file. JSX will be transpiled to have `h` pragma, therefore to use React it's possible to do `import { createElement: h } from 'react'`. | `import { h } from 'preact'` |


</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/14.svg?sanitize=true"></a></p>

## Custom Middleware

When required to add any other middleware in the application not included in the `@idio/core` bundle, it can be done in several ways.

1. Passing the middleware function as part of the _MiddlewareConfig_. It will be automatically installed to be used by the _Application_. All middleware will be installed in order it is found in the _MiddlewareConfig_.

```js
import idioCore from '@idio/core'

/** @typedef {import('koa').Middleware} Middleware */

const APIServer = async (port) => {
  const { url } = await idioCore({
    // 1. Add logging middleware.
    /** @type {Middleware} */
    async log(ctx, next) {
      await next()
      console.log(' --> API: %s %s %s', ctx.method, ctx.url, ctx.status)
    },
    // 2. Add always used error middleware.
    /** @type {Middleware} */
    async error(ctx, next) {
      try {
        await next()
      } catch (err) {
        ctx.status = 403
        ctx.body = err.message
      }
    },
    // 3. Add validation middleware.
    /** @type {Middleware} */
    async validateKey(ctx, next) {
      if (ctx.query.key !== 'app-secret')
        throw new Error('Wrong API key.')
      ctx.body = 'ok'
      await next()
    },
  }, { port })
  return url
}

export default APIServer
```
```
Started API server at: http://localhost:5005
 --> API: GET / 403
 --> API: GET /?key=app-secret 200
```

2. Passing a configuration object as part of the _MiddlewareConfig_ that includes the `middlewareConstructor` property which will receive the reference to the `app`. Other properties such as `conf` and `use` will be used in the same way as when setting up bundled middleware: setting `use` to `true` will result in the middleware being used for every request, and the `config` will be passed to the constructor.

```js
import rqt from 'rqt'
import idioCore from '@idio/core'
import APIServer from './api-server'

const ProxyServer = async (port) => {
  // 1. Start the API server.
  const API = await APIServer(5001)
  console.log('API server started at %s', API)

  // 2. Start a proxy server to the API.
  const { url } = await idioCore({
    /** @type {import('koa').Middleware} */
    async log(ctx, next) {
      await next()
      console.log(' --> Proxy: %s %s %s', ctx.method, ctx.url, ctx.status)
    },
    api: {
      use: true,
      async middlewareConstructor(app, config) {
        // e.g., read from a virtual network
        app.context.SECRET = await Promise.resolve('app-secret')

        /** @type {import('koa').Middleware} */
        const fn = async(ctx, next) => {
          const { path } = ctx
          const res = await rqt(`${config.API}${path}?key=${ctx.SECRET}`)
          ctx.body = res
          await next()
        }
        return fn
      },
      config: {
        API,
      },
    },
  }, { port })
  return url
}
```
```
API server started at http://localhost:5001
Proxy started at http://localhost:5002
 --> API: GET /?key=app-secret 200
 --> Proxy: GET / 200
```


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/15.svg?sanitize=true"></a></p>

## Router Set-up

After the _Application_ and _Router_ instances are obtained after starting the server as the `app` and `router` properties of the [returned object](#type-idiocore), the router can be configured to respond to custom paths. This can be done by assigning configured middleware from the map and standalone middleware, and calling the `use` method on the _Application_ instance.

```js
import idioCore from '@idio/core'

async function pre(ctx, next) {
  console.log('  <-- %s %s',
    ctx.request.method,
    ctx.request.path,
  )
  await next()
}

async function post(ctx, next) {
  console.log('  --> %s %s %s',
    ctx.request.method,
    ctx.request.path,
    ctx.response.status,
  )
  await next()
}

const Server = async () => {
  const path = '/test'
  const {
    url, router, app, middleware: { bodyparser },
  } = await idioCore({
    // 1. Configure the bodyparser without using it for each request.
    bodyparser: {
      config: {
        enableTypes: ['json'],
      },
    },
  }, { port: 5003 })

  // 2. Setup router with the bodyparser and path-specific middleware.
  router.post(path,
    pre,
    bodyparser,
    async (ctx, next) => {
      ctx.body = {
        ok: true,
        request: ctx.request.body,
      }
      await next()
    },
    post,
  )
  app.use(router.routes())
  return `${url}${path}`
}
```
```
Page available at: http://localhost:5003/test
  <-- POST /test
  --> POST /test 200
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/16.svg?sanitize=true"></a></p>

## Copyright

Middleware icons and logo from [Deco Dingbats NF font](https://www.1001fonts.com/decodingbats1-font.html).

Middleware types descriptions by their respective authors.

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio" />
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>