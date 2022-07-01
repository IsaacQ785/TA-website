module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['www.designyourway.net', 'landerapp.com', 'external-content.duckduckgo.com', 'cdn.discordapp.com']
  },
  env: {
    DEV_URL: process.env.DEV_URL,
    PROD_URL: process.env.PROD_URL
  }
}
