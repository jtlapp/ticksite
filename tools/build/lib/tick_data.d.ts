import { TickOccurrence } from "./tick_occurrence";
export declare const MILLIS_PER_HOUR: number;
export declare const DeerTick = "Ixodes scapularis";
export declare abstract class TickData {
    records: TickOccurrence[];
    processRows(filepath: string): Promise<void>;
    protected abstract _createRecord(row: any): TickOccurrence | null;
    protected _norm(value: string): string | null;
    protected _toEncounterDate(date: Date, feedingHours: number): Date;
}
