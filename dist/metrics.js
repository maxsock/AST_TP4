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
    MetricsHandler.prototype.delete = function (key, callback) {
        var _this = this;
        var stream = this.db.createReadStream();
        stream.on('error', callback)
            .on('end', function (err) {
            callback(null);
        })
            .on('data', function (data) {
            var _a = data.key.split(":"), k = _a[1], timestamp = _a[2];
            if (key !== k) {
                console.log("LevelDB error : " + data + " does not match key " + key);
                callback(new Error());
            }
            else {
                _this.db.del(key, function (err) {
                    if (err)
                        callback(new Error());
                });
            }
        });
    };
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var _this = this;
        metrics.forEach(function (m) {
            _this.db.put("metric:" + key + ":" + m.timestamp, m.value).then(function () { callback(null); });
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
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
