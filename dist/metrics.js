"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
//import WriteStream from 'level-ws'
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(path) {
        this.db = leveldb_1.LevelDb.open(path);
    }
    MetricsHandler.prototype.save = function (key, met, callback) {
        //if WriteStream works
        // const stream = WriteStream(this.db)
        //
        // stream.on('error', callback)
        // stream.on('close', callback)
        //
        // met.forEach((m: Metric) => {
        //   stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
        // })
        //
        // stream.end()
        var _this = this;
        //if WriteStream is not working
        met.forEach(function (m) {
            _this.db.put("metric:" + key + ":" + m.timestamp, m.value);
        });
    };
    MetricsHandler.prototype.get = function (key, callback) {
        var stream = this.db.createReadStream();
        var met = [];
        stream.on('error', callback)
            .on('end', function (err) {
            callback(null, met);
        })
            .on('data', function (data) {
            var _a = data.key.split(":"), k = _a[1], timestamp = _a[2];
            var value = data.value;
            if (key !== k) {
                console.log("LevelDB error : " + data + " does not match key " + key);
            }
            else {
                met.push(new Metric(timestamp, value));
            }
        });
    };
    MetricsHandler.get = function (callback) {
        callback(null, [
            new Metric('2013-11-04 14:00 UTC', 12),
            new Metric('2013-11-04 14:30 UTC', 15)
        ]);
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
