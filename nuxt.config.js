export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  srcDir: "src/",
  target:"server",
  server: {
    port: 8888, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  proxy: {
    '/api': {
      target: 'https://www.lawsees.com',
      changeOrigin: true,

      // pathRewrite: {
      //    '^/api': '' // 删除url中的/api
      // }
    }
  },
  head: {
    title: 'FAWEB',
    htmlAttrs: {
      lang: 'zh-Hans'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/static/font/iconfont.css',
    '@/css/index.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/main.js',
    '@/plugins/route',
    '@/plugins/local-storage.js',
    {
      src: '@/plugins/vue-qr.js', ssr: false
    },
    {src:'@/static/font/iconfont.js', ssr: false},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  generate: {
    routes: ["/", "/home"]
  },


  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/axios',
    '@nuxtjs/router',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/router',
  ],


  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
    proxy: true

  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/, 'swiper','vue-awesome-swiper'],
    // 防止重复打包
    vendor: ['axios'],
    loadingScreen: false,
  },
  vue:{
    sanitizier: false
  }
}
