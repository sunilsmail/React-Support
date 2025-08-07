const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/ppa',
    createProxyMiddleware({
      target: 'https://b2bbackendserver.verizon.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/ppa': '', // ⬅️ removes /ppa from the request
      },
    })
  );
};
