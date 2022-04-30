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
exports.TickReportData = void 0;
var tick_occurrence_1 = require("./tick_occurrence");
var tick_data_1 = require("./tick_data");
var TickReportData = /** @class */ (function (_super) {
    __extends(TickReportData, _super);
    function TickReportData(filepath) {
        var _this = _super.call(this) || this;
        _this.filepath = filepath;
        // Derived from TickCheck data.
        _this.avgFeedingHours = {
            larva: {
                unengorged: 3,
                "semi-engorged": 37,
                "fully engorged": 98
            },
            nymph: {
                unengorged: 4,
                "semi-engorged": 33,
                "fully engorged": 99
            },
            adult: {
                unengorged: 7,
                "semi-engorged": 57,
                "fully engorged": 99
            }
        };
        return _this;
    }
    TickReportData.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.processRows(this.filepath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TickReportData.prototype._createRecord = function (row) {
        var tickID = row["Tid"].trim();
        var species = row["Species"].trim();
        if (species !== tick_data_1.DeerTick)
            return null;
        var normLifeStage = this._norm(row["Stage"]);
        if (normLifeStage === null)
            return null;
        var lifeStage = this._toLifeStage(normLifeStage);
        if (lifeStage == null)
            return null;
        var normFeedingState = this._norm(row["Feeding state"]);
        if (normFeedingState === null)
            return null;
        var feedingHours = this._toFeedingHours(lifeStage, normFeedingState);
        if (feedingHours == null)
            return null;
        var zipCode = parseInt(row["Location Zip Code"].trim());
        if (isNaN(zipCode) || zipCode < 0 || zipCode >= 100000) {
            return null;
        }
        var rawRemovedDate = this._norm(row["Tick Removed Date"]);
        if (rawRemovedDate === null)
            return null;
        var encounterDate;
        try {
            encounterDate = this._toEncounterDate(new Date(rawRemovedDate), feedingHours);
        }
        catch (_err) {
            return null;
        }
        return {
            tickID: tickID,
            source: "TickReport",
            species: species,
            lifeStage: lifeStage,
            year: encounterDate.getUTCFullYear(),
            month: encounterDate.getUTCMonth() + 1,
            day: encounterDate.getUTCDate(),
            zipCode: zipCode
        };
    };
    TickReportData.prototype._toLifeStage = function (normLifeStage) {
        switch (normLifeStage) {
            case "larva":
                return tick_occurrence_1.LifeStage.larva;
            case "nymph":
                return tick_occurrence_1.LifeStage.nymph;
            case "adult":
                return tick_occurrence_1.LifeStage.adult;
            default:
                return null;
        }
    };
    TickReportData.prototype._toFeedingHours = function (lifeStage, normFeedingState) {
        var lifeStageHours = this.avgFeedingHours[lifeStage];
        switch (normFeedingState) {
            case "flat":
                return lifeStageHours["unengorged"];
            case "partially fed":
                return lifeStageHours["semi-engorged"];
            case "engorged":
                return Math.round((lifeStageHours["semi-engorged"] + lifeStageHours["fully engorged"]) /
                    2);
            case "replete":
                return lifeStageHours["fully engorged"];
            default:
                return null;
        }
    };
    return TickReportData;
}(tick_data_1.TickData));
exports.TickReportData = TickReportData;
//# sourceMappingURL=tick_report_data.js.map