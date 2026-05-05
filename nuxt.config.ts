// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/global.css',
    '~/assets/css/components/nav.css',
    '~/assets/css/components/hero-tag-strip.css',
    '~/assets/css/components/hero.css',
    '~/assets/css/components/market-gap.css',
    '~/assets/css/components/services.css',
    '~/assets/css/components/proof.css',
    '~/assets/css/components/process.css',
    '~/assets/css/components/fit.css',
    '~/assets/css/components/final-cta.css',
    '~/assets/css/components/footer.css',
    '~/assets/css/components/cursor.css',
    '~/assets/css/components/progress.css'
  ],
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap'
        }
      ]
    }
  },
  modules: ['@nuxtjs/i18n'],
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/', '/es']
    }
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'es', iso: 'es-ES', file: 'es.json' }
    ],
    langDir: '../locales',
    detectBrowserLanguage: false,
    vueI18n: './i18n.config.ts'
  }
})
