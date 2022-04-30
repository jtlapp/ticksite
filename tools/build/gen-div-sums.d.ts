import { LifeStage } from "./lib/tick_occurrence";
export interface DivisionSummary {
    source: string;
    lifeStage: LifeStage;
    year: number;
    climateDivision: number;
    counts: number[][];
}
