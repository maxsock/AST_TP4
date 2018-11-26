#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metrics_1 = require("../src/metrics");
var met = [
    new metrics_1.Metric("" + new Date('2013-11-04 14:00 UTC').getTime(), 12),
    new metrics_1.Metric("" + new Date('2013-11-04 14:15 UTC').getTime(), 10),
    new metrics_1.Metric("" + new Date('2013-11-04 14:30 UTC').getTime(), 8)
];
var db = new metrics_1.MetricsHandler('./db');
db.save('0', met, function (err) {
    if (err)
        throw err;
    console.log('Data populated');
});
