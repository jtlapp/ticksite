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
var path = require("path");
var tick_occurrence_1 = require("./lib/tick_occurrence");
var zips_fips_divs_1 = require("./lib/zips_fips_divs");
var zipsFipsFile = path.join(__dirname, "../../../tick-data/ZIP-COUNTY-FIPS_2018-03 data-world.csv");
var fipsDivsFile = path.join(__dirname, "../../../tick-data/noaa-fips-divs.txt");
var occurrenceFile = path.join(__dirname, "../../../tick-data/tick-occurrences.csv");
var daysByMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var data = {};
var unrecognizedZipCodes = [];
var unrecognizedFips = [];
function generateData() {
    return __awaiter(this, void 0, void 0, function () {
        var fipsByZip, divsByFips, occurrences, _i, occurrences_1, occurrence, sourceData, lifeStageData, yearData, fips, climateDivision, divisionData, counts, i, daysInMonth, monthOffset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, zips_fips_divs_1.loadFipsByZip)(zipsFipsFile)];
                case 1:
                    fipsByZip = _a.sent();
                    return [4 /*yield*/, (0, zips_fips_divs_1.loadDivsByFips)(fipsDivsFile)];
                case 2:
                    divsByFips = _a.sent();
                    return [4 /*yield*/, (0, tick_occurrence_1.loadOccurrences)(occurrenceFile)];
                case 3:
                    occurrences = _a.sent();
                    for (_i = 0, occurrences_1 = occurrences; _i < occurrences_1.length; _i++) {
                        occurrence = occurrences_1[_i];
                        sourceData = data[occurrence.source];
                        if (!sourceData) {
                            sourceData = {};
                            data[occurrence.source] = sourceData;
                        }
                        lifeStageData = sourceData[occurrence.lifeStage];
                        if (!lifeStageData) {
                            lifeStageData = {};
                            sourceData[occurrence.lifeStage] = lifeStageData;
                        }
                        yearData = lifeStageData[occurrence.year];
                        if (!yearData) {
                            yearData = {};
                            lifeStageData[occurrence.year] = yearData;
                        }
                        fips = fipsByZip[occurrence.zipCode];
                        if (!fips) {
                            unrecognizedZipCodes.push(occurrence.zipCode);
                            continue;
                        }
                        climateDivision = divsByFips[fips];
                        if (!climateDivision) {
                            unrecognizedFips.push(fips);
                            continue;
                        }
                        divisionData = yearData[climateDivision];
                        if (!divisionData) {
                            counts = [];
                            for (i = 0; i < 12; ++i) {
                                counts.push([0, 0, 0, 0]);
                            }
                            divisionData = {
                                source: occurrence.source,
                                lifeStage: occurrence.lifeStage,
                                year: occurrence.year,
                                climateDivision: climateDivision,
                                // indexed first by month (0-11) and then by quarter of month (0-3)
                                counts: counts
                            };
                            yearData[climateDivision] = divisionData;
                        }
                        daysInMonth = daysByMonth[occurrence.month - 1];
                        if (occurrence.month == 2 /* February */) {
                            if (occurrence.year % 400 == 0 ||
                                (occurrence.year % 4 == 0 && occurrence.year % 100 != 0)) {
                                daysInMonth = 29;
                            }
                        }
                        monthOffset = Math.floor((4 * (occurrence.day - 1)) / daysInMonth);
                        ++divisionData.counts[occurrence.month - 1][monthOffset];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function printData() {
    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
        var _b = _a[_i], source = _b[0], sourceData = _b[1];
        for (var _c = 0, _d = Object.entries(sourceData); _c < _d.length; _c++) {
            var _e = _d[_c], lifeStage = _e[0], lifeStageData = _e[1];
            for (var _f = 0, _g = Object.entries(lifeStageData); _f < _g.length; _f++) {
                var _h = _g[_f], year = _h[0], yearData = _h[1];
                for (var _j = 0, _k = Object.entries(yearData); _j < _k.length; _j++) {
                    var _l = _k[_j], division = _l[0], summary = _l[1];
                    var counts = summary.counts
                        .map(function (month) { return month.join(","); })
                        .join(",");
                    console.log("".concat(source, ",").concat(lifeStage, ",").concat(year, ",").concat(division, ",").concat(counts));
                }
            }
        }
    }
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, generateData()];
            case 1:
                _a.sent();
                printData();
                console.log();
                console.log("".concat(unrecognizedZipCodes.length, " records with unrecognized zip codes"));
                if (unrecognizedZipCodes.length > 0) {
                    console.log("  e.g.", unrecognizedZipCodes.slice(0, 10).join(", "));
                }
                console.log("".concat(unrecognizedFips.length, " records with unrecognized fips"));
                if (unrecognizedFips.length > 0) {
                    console.log("  e.g.", unrecognizedFips.slice(0, 10).join(", "));
                }
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=gen-div-sums.js.map