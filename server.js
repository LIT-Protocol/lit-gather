const next = require('next');
const express = require('express');
const sslRedirect = require('heroku-ssl-redirect').default;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
const app = express();

  // redirect to SSL
  app.use(sslRedirect());

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});