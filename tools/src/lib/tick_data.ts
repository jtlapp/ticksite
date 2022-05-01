import * as fs from "fs";
import { parse as parseCSV } from "@fast-csv/parse";

import { TickOccurrence } from "./tick_occurrence";

const HOUR_TICK_FOUND = (23 + 7) / 2; // halfway bewteen 7am and 11pm
const MINS_UNTIL_FEEDING = 30;
export const MILLIS_PER_HOUR = 60 * 60 * 1000;

export const DeerTick = "Ixodes scapularis";

export abstract class TickData {
  records: TickOccurrence[] = [];

  async processRows(filepath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(filepath)
        .pipe(parseCSV({ headers: true }))
        .on("data", (row) => {
          const record = this._createRecord(row);
          if (record) this.records.push(record);
        })
        .on("end", () => resolve())
        .on("error", (err) => {
          console.log("Streaming error:", err);
          reject(err);
        });
    });
  }

  protected abstract _createRecord(row: any): TickOccurrence | null;

  protected _norm(value: string): string | null {
    value = value.trim().toLowerCase();
    return value == "" ? null : value;
  }

  protected _toEncounterDate(
    source: string,
    tickID: string,
    date: Date,
    feedingHours: number
  ): Date {
    let year = date.getUTCFullYear();
    if (year < 2000 || year > 2022) throw Error("invalid year");
    const iso = date.toISOString();
    const isoT0 = iso.substring(0, iso.indexOf("T")) + "T00:00:00.000Z";
    const date0 = new Date(isoT0);
    const middayMillis = date0.getTime() + HOUR_TICK_FOUND * MILLIS_PER_HOUR;
    const encounterDate = new Date(
      middayMillis - feedingHours * MILLIS_PER_HOUR - MINS_UNTIL_FEEDING
    );
    year = encounterDate.getUTCFullYear();
    if (year < 2000 || year > 2022) {
      console.log(
        "Bad encounterDate:",
        encounterDate,
        "for",
        source,
        tickID,
        date,
        feedingHours
      );
      process.exit(1);
    }
    return encounterDate;
  }
}
