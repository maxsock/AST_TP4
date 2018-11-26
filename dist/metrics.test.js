"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var leveldb_1 = require("./leveldb");
var dbPath = 'db_test';
//var dbMet: MetricsHandler
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
describe('Metrics', function () {
    before(function () {
        leveldb_1.LevelDb.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    after(function () {
        dbMet.db.close();
    });
    describe("#get", function () {
        it('should get empty array on non existing group', function () {
            dbMet.get("0", function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.an('array');
                chai_1.expect(result).to.be.empty;
            });
        });
    });
    describe("#save", function () {
        it('should save data', function () {
        });
        it('should update data', function () {
        });
    });
    describe("#delete", function () {
        it('should delete data', function () {
        });
        it('should not fail if data does not exist', function () {
        });
    });
});
