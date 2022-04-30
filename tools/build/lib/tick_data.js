"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.TickData = exports.DeerTick = exports.MILLIS_PER_HOUR = void 0;
var fs = require("fs");
var parse_1 = require("@fast-csv/parse");
var HOUR_TICK_FOUND = (23 + 7) / 2; // halfway bewteen 7am and 11pm
var MINS_UNTIL_FEEDING = 30;
exports.MILLIS_PER_HOUR = 60 * 60 * 1000;
exports.DeerTick = "Ixodes scapularis";
var TickData = /** @class */ (function () {
    function TickData() {
        this.records = [];
    }
    TickData.prototype.processRows = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.createReadStream(filepath)
                            .pipe((0, parse_1.parse)({ headers: true }))
                            .on("data", function (row) {
                            var record = _this._createRecord(row);
                            if (record)
                                _this.records.push(record);
                        })
                            .on("end", function () { return resolve(); })
                            .on("error", function (err) {
                            console.log("Streaming error:", err);
                            reject(err);
                        });
                    })];
            });
        });
    };
    TickData.prototype._norm = function (value) {
        value = value.trim().toLowerCase();
        return value == "" ? null : value;
    };
    TickData.prototype._toEncounterDate = function (date, feedingHours) {
        var iso = date.toISOString();
        var isoT0 = iso.substring(0, iso.indexOf("T")) + "T00:00:00.000Z";
        var date0 = new Date(isoT0);
        var middayMillis = date0.getTime() + HOUR_TICK_FOUND * exports.MILLIS_PER_HOUR;
        return new Date(middayMillis - feedingHours * exports.MILLIS_PER_HOUR - MINS_UNTIL_FEEDING);
    };
    return TickData;
}());
exports.TickData = TickData;
//# sourceMappingURL=tick_data.js.map