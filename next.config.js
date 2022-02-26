/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/debug",
        destination: "http://localhost:3334"
      },
      {
        source: "/debug/:match*",
        destination: "http://localhost:3334/:match*"
      }
    ]
  }
}
