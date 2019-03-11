const pkg = require('./package')
const getAPI = require('./src/server/lib/getAPI.js')
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

module.exports = {
  mode: 'universal',
  srcDir: 'src/',
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    titleTemplate: '%s | ' + pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '「Slack + NuxtでMarkdown対応のブログを作る」のサンプルです。',
      },
      { name: 'robots', content: 'noindex' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    'ress',
    { src: '@@/node_modules/highlight.js/styles/monokai.css', lang: 'css' },
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit',
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    sass: ['@/assets/css/variable.scss', '@/assets/css/foundation/base.scss'],
  },

  manifest: {
    name: 'SLACK-BLOG',
    lang: 'ja',
  },

  markdownit: {
    injected: true,
    breaks: true,
    html: true,
    linkify: true,
    use: ['markdown-it-emoji', 'markdown-it-highlightjs'],
  },

  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: `http://${host}:${port}/api/`,
  },

  /*
   ** Generate configuration
   */
  generate: {
    routes() {
      async function setRoutes() {
        const res = await getAPI.fetchAllData()
        const arr = []
        res.channels.forEach(channel => {
          arr.push({
            route: `/categories/${channel.id}`,
            payload: {
              channel: res.channels,
              users: res.users,
            },
          })
          channel.entries.forEach(entry => {
            arr.push({
              route: `/categories/${entry.channel}/entry-${entry.ts}`,
              payload: {
                channel: res.channels,
                users: res.users,
              },
            })
          })
        })
        return arr
      }
      return setRoutes().then(data => {
        return data
      })
    },
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
}
