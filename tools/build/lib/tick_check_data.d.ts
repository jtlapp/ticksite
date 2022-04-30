import { LifeStage } from "./tick_occurrence";
import { TickData } from "./tick_data";
interface IncompleteRecord {
    tickID: string;
    foundDate: Date | null;
    species: string;
    lifeStage: LifeStage;
    engorgementLabel: string;
    engorgementHours: number;
    orderDate: Date;
    zipCode: number;
}
export declare class TickCheckData extends TickData {
    avgFeedingHours: Record<string, Record<string, number>>;
    avgOrderDiffMillis: Record<string, Record<string, number>>;
    _filepath: string;
    _totalFeedingHoursAndRecords: Record<string, Record<string, number[]>>;
    _totalOrderDiffAndRecords: Record<string, Record<string, number[]>>;
    _incompleteRecords: IncompleteRecord[];
    constructor(filepath: string);
    load(): Promise<void>;
    printInfo(): void;
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
}
export {};
