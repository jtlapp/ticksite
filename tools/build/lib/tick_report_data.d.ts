import { LifeStage } from "./tick_occurrence";
import { TickData } from "./tick_data";
export declare class TickReportData extends TickData {
    filepath: string;
    avgFeedingHours: Record<string, Record<string, number>>;
    constructor(filepath: string);
    load(): Promise<void>;
    protected _createRecord(row: any): {
        tickID: any;
        source: string;
        species: any;
        lifeStage: LifeStage;
        year: number;
        month: number;
        day: number;
        zipCode: number;
    } | null;
    private _toLifeStage;
    private _toFeedingHours;
}
