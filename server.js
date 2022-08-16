var fs = require('fs');
var http = require('http');
var https = require('https');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const path = require('path');
const puppeteer = require("puppeteer");
const { v4: uuidv4 } = require('uuid');

var privateKey  = fs.readFileSync('./localhost+2-key.pem', 'utf8');
var certificate = fs.readFileSync('./localhost+2.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
const port = 3004

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


const app = express()
app.use(connectLiveReload());
app.use(express.static(path.join(__dirname, "assets")));

// express configuration here
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3005, () => {
  console.log('HTTP Server on port 3005, HTTPS on 3004 ');
});

httpsServer.listen(port, () => {
  console.log*('HTTPS server listening on port ' + port);
}).on('error', (err) => {
  console.log('HTTPS server error: ' + err);
  httpServer.close();
});

// List of experiments
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

app.get('/basic-1', (req, res) => {
  res.sendFile('basic-1.html', { root: __dirname })
})

app.get('/basic-2', (req, res) => {
  res.sendFile('basic-2.html', { root: __dirname })
})

// Experiment 1.1 -- Playing with A-Frame components
app.get('/advanced', (req, res) => {
  res.sendFile('advanced.html', { root: __dirname })
})


// Experiment 2 - Display a grafana panel on canvas

app.get('/static-panel', (req, res) => {
  res.sendFile('static-panel.html', { root: __dirname })
})

// Experiment 2: Endpoint making a screenshot of a grafana panel
app.get('/screenshot', (req, res) => {
  puppeteer
  .launch({
    defaultViewport: {
      width: 1280,
      height: 2000,
    },
  })
  .then(async (browser) => {
    const url = "http://localhost:3000/d/3j4JGc6nz/16543-multi-ds-variables-test?orgId=1&viewPanel=22&kiosk";
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.panel-content', {visible: true});
    const name =  uuidv4() + '.png';
    await page.screenshot({ path: path.join(__dirname, 'assets', name) });
    await browser.close();
    res.status(200).json({panel: name});
  });
})
