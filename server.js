const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');
const history = require('connect-history-api-fallback');
app = express();
app.use(serveStatic(path.join(__dirname, 'dist')));
app.use(history());
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});
const port = process.env.PORT || 3000;
app.listen(port);