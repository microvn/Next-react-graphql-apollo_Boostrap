require('dotenv').config()

import express from 'express'
import next from 'next'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'

import apollo from '~server/core/apollo'

// import { routes } from './core/nextRoutes'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'

const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
// const handle = routes.getRequestHandler(app)

nextApp.prepare().then(() => {
  const server = express()

  //security
  server.use(helmet())

  // Generate logs
  server.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
  )
  server.use(compression())

  //start apollo server
  apollo.applyMiddleware({ app: server })

  server.get('*', (req, res) => handle(req, res))
  // express().use(handler).listen(3000) //routes handle way
  server.listen(port, err => {
    if (err) throw err
  })
})
