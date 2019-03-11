const express = require('express')
const consola = require('consola')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const getAPI = require('./lib/getAPI.js')

// generate mode
if (process.argv.length && process.argv[2] === '--generate') {
  getAPI
    .fetchAllImages()
    .then(() => {
      console.log('done')
      process.exit(0)
    })
    .catch(err => {
      console.error(err)
      process.exit(0)
    })
} else {
  // dev mode
  app.set('port', port)

  async function start() {
    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true,
    })
  }
  start()

  app.get('/api/fetchAllData', (req, res) => {
    getAPI
      .fetchAllData()
      .then(data => {
        res.send(data)
        console.log('done')
        process.exit(1)
      })
      .catch(err => {
        res.sendStatus(500)
      })
  })
}
