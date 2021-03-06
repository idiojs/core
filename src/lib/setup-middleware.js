import session from 'koa-session'
import CSRF from 'koa-csrf'
import multer from 'koa-multer'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import cors from '@koa/cors'
import ensurePath from '@wrote/ensure-path'
import { join, resolve } from 'path'
import compress from 'koa-compress'
import serve from 'koa-static'
import compose from 'koa-compose'
import { Z_SYNC_FLUSH } from 'zlib'
import Mount from 'koa-mount'
import frontend from '@idio/frontend'
import checkAuth from './check-auth'

function setupStatic(app, config, {
  root = [],
  maxage,
  mount,
}) {
  const roots = Array.isArray(root) ? root : [root]
  const m = roots.map((r) => {
    const fn = serve(r, {
      maxage,
      ...config,
    })
    return fn
  })
  const c = compose(m)
  if (mount) return Mount(mount, c)
  return c
}

function setupCors(app, config, {
  origin,
}) {
  const o = Array.isArray(origin) ? (ctx) => {
    const oh = ctx.get('Origin')
    const found = origin.find(a => a == oh)
    return found
  } : origin
  const fn = cors({
    origin: o,
    ...config,
  })
  return fn
}

function setupCompress(app, config, {
  threshold = 1024,
}) {
  const fn = compress({
    threshold,
    flush: Z_SYNC_FLUSH,
    ...config,
  })
  return fn
}
function setupCheckAuth() {
  return checkAuth()
}
function setupSession(app, config, { keys }) {
  if (!Array.isArray(keys)) {
    throw new Error('Keys must be an array')
  }
  app.keys = keys
  const ses = session(config, app)
  return ses
}
function setupCsrf(app, config) {
  const csrf = new CSRF(config)
  return csrf
}

const setupMulter = async (app, config = {})  => {
  if (typeof config.dest != 'string') {
    throw new Error('expecting uploadDir for multer')
  }
  const resolvedDir = resolve(config.dest)
  const uploadDirTestPath = join(resolvedDir, 'test.data')
  await ensurePath(uploadDirTestPath)
  const upload = multer(config)
  return upload
}

const setupBodyParser = (app, config) => {
  const bodyparser = bodyParser(config)
  return bodyparser
}

const setupLogger = (app, config) => {
  const l = logger(config)
  return l
}

/**
 * @param {_goa.Application} app
 * @param {import('..').FrontendConfig} config
 * @param {import('..').FrontendOptions} options
 */
const setupFrontend = async (app, config, options) => {
  const { directory } = options
  const d = Array.isArray(directory) ? directory : [directory]
  const res = await Promise.all(d.map(async (dir) => {
    const f = await frontend({
      ...config,
      directory: dir,
    })
    app.use(f)
    return f
  }))
  return res
}

const map = {
  session: setupSession,
  multer: setupMulter,
  csrf: setupCsrf,
  compress: setupCompress,
  bodyparser: setupBodyParser,
  checkauth: setupCheckAuth,
  logger: setupLogger,
  static: setupStatic,
  cors: setupCors,
  frontend: setupFrontend,
}

async function initMiddleware(name, conf, app) {
  if (typeof conf == 'function') {
    /** @type {_goa.Middleware} */
    const c = conf
    app.use(c)
    return c
  }
  let fn
  if (name in map) {
    fn = map[name]
  } else if (conf.middlewareConstructor) {
    if (typeof conf.middlewareConstructor != 'function') {
      throw new Error(`Expecting a function in the "middlewareConstructor" of the ${name} middleware.`)
    }
    fn = conf.middlewareConstructor
  } else {
    throw new Error('Either the "middleware" or "middlewareConstructor" properties must be passed.')
  }
  const { use, config = {}, ...options } = conf
  /** @type {_goa.Middleware} */
  const res = await fn(app, config, options)
  if (use) {
    app.use(res)
  }
  return res
}

/**
 * @param {MiddlewareConfig} middlewareConfig
 * @param {_goa.Application} app
 */
export default async function setupMiddleware(middlewareConfig = {}, app) {
  /** @type {Object.<string, _goa.Middleware>} */
  const res = await Object.keys(middlewareConfig)
    .reduce(async (acc, name) => {
      const accRes = await acc
      const conf = middlewareConfig[name]
      let installed
      if (Array.isArray(conf)) {
        const p = conf.map(async (c) => {
          await initMiddleware(name, c, app)
        })
        installed = await Promise.all(p)
      } else {
        installed = await initMiddleware(name, conf, app)
      }
      return {
        ...accRes,
        [name]: installed,
      }
    }, {})
  return res
}

/** @typedef {import('@goa/koa').Middleware} _goa.Middleware */
/** @typedef {import('@goa/koa').Application} _goa.Application */
/** @typedef {import('..').MiddlewareConfig} MiddlewareConfig */
