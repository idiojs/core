const { debuglog } = require('util');
let enableDestroy = require('server-destroy'); if (enableDestroy && enableDestroy.__esModule) enableDestroy = enableDestroy.default;
let Router = require('koa-router'); if (Router && Router.__esModule) Router = Router.default;
let Koa = require('@goa/koa'); if (Koa && Koa.__esModule) Koa = Koa.default;
let erotic = require('erotic'); if (erotic && erotic.__esModule) erotic = erotic.default;
const setupMiddleware = require('./setup-middleware');

/**
 * Create an application and setup middleware.
 * @param {MiddlewareConfig} middlewareConfig
 */
async function createApp(middlewareConfig) {
  const app = new Koa()

  const middleware = await setupMiddleware(middlewareConfig, app)

  if (app.env == 'production') {
    app.proxy = true
  }

  return {
    app,
    middleware,
  }
}

const LOG = debuglog('idio')

const DEFAULT_PORT = 5000
const DEFAULT_HOST = '0.0.0.0'

async function destroy(server) {
  await new Promise((resolve) => {
    server.on('close', resolve)
    server.destroy()
  })
  LOG('destroyed the server')
}

/**
 * @param {import('koa').Application} app
 * @param {number} [port]
 * @param {string} [hostname='0.0.0.0']
 * @return {Promise<import('http').Server>}
 */
function listen(app, port, hostname = '0.0.0.0') {
  const cb = erotic(true)
  return new Promise((r, j) => {
    const ec = (err) => {
      const e = cb(err)
      j(e)
    }
    /** @type {import('http').Server} */
    const server = app.listen(port, hostname, () => {
      r(server)
      app.removeListener('error', ec)
    }).once('error', ec)
  })
}

/**
 * Start the server.
 * @param {MiddlewareConfig} [middlewareConfig] Middleware configuration.
 * @param {Config} [config] Configuration object.
 */
async function startApp(middlewareConfig, config) {
  const {
    port = DEFAULT_PORT,
    host = DEFAULT_HOST,
  } = config

  // close all connections when running nodemon
  const sigListener = async () => {
    await app.destroy()
    process.kill(process.pid, 'SIGUSR2')
  }
  process.once('SIGUSR2', sigListener)

  const appMeta = await createApp(middlewareConfig, config)
  const { app } = appMeta

  const server = await listen(app, port, host)

  enableDestroy(server)
  app.destroy = async () => {
    await destroy(server)
    process.removeListener('SIGUSR2', sigListener)
  }
  const { port: p } = server.address()

  const url = `http://localhost:${p}`

  const router = new Router()

  return { ...appMeta, router, url, server }
}

module.exports=startApp

/**
 * @typedef {import('..').MiddlewareConfig} MiddlewareConfig
 * @typedef {import('..').Config} Config
 */