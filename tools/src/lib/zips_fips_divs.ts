import * as fs from "fs";
import { parse as parseCSV } from "@fast-csv/parse";

export interface County {
  fips: number;
  state: string;
}

export async function loadCountyByZip(
  filepath: string
): Promise<Record<number, County>> {
  const fipsByZip: Record<number, County> = {};

  return new Promise<Record<number, County>>((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(parseCSV({ headers: true }))
      .on("data", (row) => {
        fipsByZip[parseInt(row["ZIP"])] = {
          fips: parseInt(row["STCOUNTYFP"]),
          state: row["STATE"],
        };
      })
      .on("end", () => resolve(fipsByZip))
      .on("error", (err) => {
        console.log("loadFipsByZip streaming error:", err);
        reject(err);
      });
  });
}

export async function loadDivsByFips(
  filepath: string
): Promise<Record<number, number>> {
  const divsByFips: Record<number, number> = {};

  return new Promise<Record<number, number>>((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(parseCSV({ headers: true, delimiter: " " }))
      .on("data", (row) => {
        divsByFips[parseInt(row["POSTAL_FIPS_ID"])] = parseInt(
          row["CLIMDIV_ID"]
        );
      })
      .on("end", () => resolve(divsByFips))
      .on("error", (err) => {
        console.log("loadDivsByFips streaming error:", err);
        reject(err);
      });
  });
}
