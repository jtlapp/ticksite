import { parse as parseCSV } from '@fast-csv/parse';

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

	add(another: ClimDivSummary): void {
		for (let i = 0; i < this.counts.length; ++i) {
			this.counts[i] += another.counts[i];
		}
	}

	clone(): ClimDivSummary {
		return Object.assign({}, this);
	}

	static async load(): Promise<ClimDivSummary[]> {
		const res = await fetch('data/climdiv-summaries.csv');
		const csvFile = await res.text();
		const summaries: ClimDivSummary[] = [];

		return new Promise<ClimDivSummary[]>((resolve, reject) => {
			const stream = parseCSV({ headers: false })
				.on('data', (row) => summaries.push(new ClimDivSummary(row)))
				.on('end', () => resolve(summaries))
				.on('error', (err) => {
					console.log('csv streaming error:', err);
					reject(err);
				});
			stream.write(csvFile);
			stream.end();
		});
	}
}
