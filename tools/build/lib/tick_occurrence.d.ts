export declare enum LifeStage {
    nymph = "nymph",
    adult = "adult",
    larva = "larva"
}
export interface TickOccurrence {
    tickID: string;
    source: string;
    species: string;
    lifeStage: LifeStage;
    year: number;
    month: number;
    day: number;
    zipCode: number;
}
export declare function loadOccurrences(filepath: string): Promise<TickOccurrence[]>;
