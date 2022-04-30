"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.TickCheckData = void 0;
var tick_occurrence_1 = require("./tick_occurrence");
var tick_data_1 = require("./tick_data");
var MAX_ORDER_FOUND_DATE_DIFF_DAYS = 4;
var TickCheckData = /** @class */ (function (_super) {
    __extends(TickCheckData, _super);
    function TickCheckData(filepath) {
        var _this = _super.call(this) || this;
        // hours indexed by stage and then engorgement label
        _this.avgFeedingHours = {};
        // millis diff indexed by stage and then engorgement label
        _this.avgOrderDiffMillis = {};
        // totals indexed by stage and then engorgement label
        _this._totalFeedingHoursAndRecords = {};
        _this._totalOrderDiffAndRecords = {};
        _this._incompleteRecords = [];
        _this._filepath = filepath;
        for (var _i = 0, _a = Object.keys(tick_occurrence_1.LifeStage); _i < _a.length; _i++) {
            var lifeStage = _a[_i];
            _this._totalFeedingHoursAndRecords[lifeStage] = {
                unengorged: [0, 0],
                "semi-engorged": [0, 0],
                "fully engorged": [0, 0]
            };
            _this._totalOrderDiffAndRecords[lifeStage] = {
                unengorged: [0, 0],
                "semi-engorged": [0, 0],
                "fully engorged": [0, 0]
            };
        }
        return _this;
    }
    TickCheckData.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, lifeStage, _b, _c, _d, engorgementLabel, totals, lifeStageHours, _e, _f, lifeStage, _g, _h, _j, engorgementLabel, totals, lifeStageDiffs, _k, _l, record, estimatedFoundDate, engorgementHours, lifeStageHours, encounterDate;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0: 
                    // Load all of the TickCheck data rows.
                    return [4 /*yield*/, this.processRows(this._filepath)];
                    case 1:
                        // Load all of the TickCheck data rows.
                        _m.sent();
                        // Determine average feeding time as a function of life stage and
                        // engorgement label. I'll use this information to estimate engorgement
                        // durations in TickReport data, which only provides engorgement labels.
                        for (_i = 0, _a = Object.keys(tick_occurrence_1.LifeStage); _i < _a.length; _i++) {
                            lifeStage = _a[_i];
                            for (_b = 0, _c = Object.entries(this._totalFeedingHoursAndRecords[lifeStage]); _b < _c.length; _b++) {
                                _d = _c[_b], engorgementLabel = _d[0], totals = _d[1];
                                lifeStageHours = this.avgFeedingHours[lifeStage];
                                if (!lifeStageHours) {
                                    lifeStageHours = {};
                                    this.avgFeedingHours[lifeStage] = lifeStageHours;
                                }
                                lifeStageHours[engorgementLabel] = Math.round(totals[0] / totals[1]);
                            }
                        }
                        // Determine average time between time order placed and time tick was
                        // discovered as a function of life stage and engorgement label. I'll
                        // use this information to estimate tick encounter time in TickCheck
                        // records that do not provide a tick encounter time.
                        for (_e = 0, _f = Object.keys(tick_occurrence_1.LifeStage); _e < _f.length; _e++) {
                            lifeStage = _f[_e];
                            for (_g = 0, _h = Object.entries(this._totalOrderDiffAndRecords[lifeStage]); _g < _h.length; _g++) {
                                _j = _h[_g], engorgementLabel = _j[0], totals = _j[1];
                                lifeStageDiffs = this.avgOrderDiffMillis[lifeStage];
                                if (!lifeStageDiffs) {
                                    lifeStageDiffs = {};
                                    this.avgOrderDiffMillis[lifeStage] = lifeStageDiffs;
                                }
                                lifeStageDiffs[engorgementLabel] = Math.round(totals[0] / totals[1]);
                            }
                        }
                        // Generate complete records from incomplete records using the
                        // above-established averages as estimates.
                        for (_k = 0, _l = this._incompleteRecords; _k < _l.length; _k++) {
                            record = _l[_k];
                            estimatedFoundDate = record.foundDate;
                            if (!estimatedFoundDate) {
                                estimatedFoundDate = new Date(record.orderDate.getTime() -
                                    this.avgOrderDiffMillis[record.lifeStage][record.engorgementLabel]);
                            }
                            engorgementHours = record.engorgementHours;
                            if (record.engorgementLabel != "unengorged" && !engorgementHours) {
                                lifeStageHours = this.avgFeedingHours[record.lifeStage];
                                engorgementHours = lifeStageHours[record.engorgementLabel];
                            }
                            encounterDate = this._toEncounterDate(estimatedFoundDate, engorgementHours);
                            this.records.push({
                                tickID: record.tickID,
                                source: "TickCheck",
                                species: record.species,
                                lifeStage: record.lifeStage,
                                year: encounterDate.getUTCFullYear(),
                                month: encounterDate.getUTCMonth() + 1,
                                day: encounterDate.getUTCDate(),
                                zipCode: record.zipCode
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TickCheckData.prototype.printInfo = function () {
        console.log("avgFeedingHours:", JSON.stringify(this.avgFeedingHours, undefined, "  "));
        var avgOrderDiffHours = Object.assign({}, this.avgOrderDiffMillis);
        for (var _i = 0, _a = Object.keys(tick_occurrence_1.LifeStage); _i < _a.length; _i++) {
            var lifeStage = _a[_i];
            for (var _b = 0, _c = Object.entries(avgOrderDiffHours[lifeStage]); _b < _c.length; _b++) {
                var _d = _c[_b], engorgementLabel = _d[0], millis = _d[1];
                avgOrderDiffHours[lifeStage][engorgementLabel] = Math.round(millis / tick_data_1.MILLIS_PER_HOUR);
            }
        }
        console.log("avgOrderDiffHours:", JSON.stringify(avgOrderDiffHours, undefined, "  "));
    };
    TickCheckData.prototype._createRecord = function (row) {
        // Extract basic data from the row, returning null if it does not
        // meet the minimum requirements, in order ignore the data.
        var tickID = row["tick_id"].trim();
        var orderCreatedAt = this._norm(row["order_created_at"]);
        if (orderCreatedAt === null)
            return null;
        var species = row["tick_type_binomial_name"].trim();
        if (species !== tick_data_1.DeerTick)
            return null;
        var engorgementLabel = this._norm(row["engorgement_level"]);
        if (engorgementLabel == null || engorgementLabel == "undetermined") {
            return null;
        }
        var normLifeStage = this._norm(row["life_stage"]);
        if (normLifeStage === null)
            return null;
        var lifeStage = this._toLifeStage(normLifeStage);
        if (lifeStage == null)
            return null;
        var zipCode = parseInt(row["zip"].trim());
        if (isNaN(zipCode) || zipCode < 0 || zipCode >= 100000) {
            return null;
        }
        var rawFoundDate = this._norm(row["tick_found_date"]);
        var foundDate = null;
        if (rawFoundDate !== null) {
            try {
                foundDate = new Date(rawFoundDate);
            }
            catch (err) {
                // ignore parse error; foundDate will remain null
            }
        }
        // Determine the tick engorgement time.
        var rawEngorgementTime = row["engorgement_time"].trim();
        var engorgementHours = 0;
        if (engorgementLabel === "unengorged" && rawEngorgementTime === "") {
            // TickCheck folks said unengorged means between 0 and 7 hours.
            engorgementHours = 3.5;
        }
        else {
            engorgementHours = parseInt(rawEngorgementTime);
            if (isNaN(engorgementHours) ||
                engorgementHours < 0 ||
                engorgementHours > 100) {
                return null;
            }
        }
        // Track engorgement time as a function of engorgement label. It seems
        // that engorgement is not always provided, so ignore zeros except for
        // unengorged specimens, which are assumed to have accurate hours.
        if (engorgementHours > 0 || engorgementLabel == "unengorged") {
            var engorgementTotals = this._totalFeedingHoursAndRecords[lifeStage][engorgementLabel];
            if (engorgementTotals !== undefined) {
                engorgementTotals[0] += engorgementHours;
                ++engorgementTotals[1];
            }
        }
        // Track difference between found date and order date as a function of
        // engorgement time.
        if (foundDate !== null) {
            var timeDiffTotals = this._totalOrderDiffAndRecords[lifeStage][engorgementLabel];
            if (timeDiffTotals !== undefined) {
                var orderFoundDiffMillis = new Date(orderCreatedAt).getTime() - foundDate.getTime();
                if (orderFoundDiffMillis >
                    MAX_ORDER_FOUND_DATE_DIFF_DAYS * 24 * tick_data_1.MILLIS_PER_HOUR) {
                    // ignore apparently bad data
                    return null;
                }
                timeDiffTotals[0] += orderFoundDiffMillis;
                ++timeDiffTotals[1];
            }
        }
        // Collect records that lack found dates or engorgment hours for
        // processing later when these can be estimated.
        if (!rawFoundDate || !engorgementHours) {
            if (engorgementLabel !== null) {
                this._incompleteRecords.push({
                    tickID: tickID,
                    foundDate: foundDate,
                    species: species,
                    lifeStage: lifeStage,
                    engorgementLabel: engorgementLabel,
                    engorgementHours: engorgementHours,
                    orderDate: new Date(orderCreatedAt),
                    zipCode: zipCode
                });
            }
            return null;
        }
        // Determine the encounter date as a function of found date and
        // estimated engorgement time.
        var encounterDate;
        try {
            encounterDate = this._toEncounterDate(new Date(rawFoundDate), engorgementHours);
        }
        catch (_err) {
            return null;
        }
        // Return a complete TickCheck record.
        return {
            tickID: tickID,
            source: "TickCheck",
            species: species,
            lifeStage: lifeStage,
            year: encounterDate.getUTCFullYear(),
            month: encounterDate.getUTCMonth() + 1,
            day: encounterDate.getUTCDate(),
            zipCode: zipCode
        };
    };
    TickCheckData.prototype._toLifeStage = function (rawLifeStage) {
        switch (rawLifeStage) {
            case "larvae":
                return tick_occurrence_1.LifeStage.larva;
            case "nymph":
                return tick_occurrence_1.LifeStage.nymph;
            case "adult female":
                return tick_occurrence_1.LifeStage.adult;
            case "adult male":
                return tick_occurrence_1.LifeStage.adult;
            default:
                return null;
        }
    };
    return TickCheckData;
}(tick_data_1.TickData));
exports.TickCheckData = TickCheckData;
//# sourceMappingURL=tick_check_data.js.map