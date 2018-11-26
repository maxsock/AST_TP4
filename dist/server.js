"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var bodyparser = require("body-parser");
var app = express();
var port = process.env.PORT || '8080';
var dbMet = new metrics_1.MetricsHandler('./db');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.get('/', function (req, res) {
    res.write('Hello World');
    res.send();
});
app.get('/metrics/:id', function (req, res) {
    dbMet.get(req.params.id, function (err, result) {
        if (err)
            throw err;
        if (result === undefined) {
            res.write('no result');
            res.send();
        }
        else
            res.json(result);
    });
});
app.post('/metrics/:id', function (req, res) {
    dbMet.save(req.params.id, req.body, function (err) {
        if (err) {
            res.status(500).send(err.message);
        }
        res.status(200).send();
    });
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server listening on port " + port);
});
