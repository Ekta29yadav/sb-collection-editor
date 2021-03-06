var express = require('express'),
    http = require('http');
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const latexService = require('./latexService.js')

var app = express();

app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))

app.get("/latex/convert", latexService.convert)
app.post("/latex/convert", bodyParser.json({ limit: '1mb' }), latexService.convert);


app.use('/api', proxy('dock.sunbirded.org', {
    https: true,
    proxyReqPathResolver: function(req) {
        console.log('proxyReqPathResolver ',  urlHelper.parse(req.url.replace('api', 'action')).path);
        return urlHelper.parse(req.url.replace('api', 'action')).path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator')
        // you can update headers 
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        // proxyReqOpts.headers['authorization'] = 'Bearer <-paste Token->';
        return proxyReqOpts;
    }
}));



http.createServer(app).listen(app.get('port'), 3000);
