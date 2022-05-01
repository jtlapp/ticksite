export class ClimDivSummary {
	source: string;
	lifeStage: string;
	year: number;
	climateDivision: number;
	state: string;
	counts: number[] = [];

	constructor(row: any[]) {
		this.source = row[0];
		this.lifeStage = row[1];
		this.year = parseInt(row[2]);
		this.climateDivision = parseInt(row[3]);
		this.state = row[4];
		for (let i = 5; i < row.length; ++i) {
			this.counts.push(parseInt(row[i]));
		}
	}

	static async load(): Promise<ClimDivSummary[]> {
		const res = await fetch('data/climdiv-summaries.csv');
		const csvFile = await res.text();
		const summaries: ClimDivSummary[] = [];

		const lines = csvFile.split('\n');
		for (const line of lines) {
			const row = line.split(',');
			summaries.push(new ClimDivSummary(row));
		}
		return summaries;
	}
}
