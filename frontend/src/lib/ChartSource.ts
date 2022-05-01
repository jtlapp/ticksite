import type { ClimDivSummary } from './ClimDivSummary';

const MAX_POINTS_PER_MONTH = 4;
const MONTHS_PER_YEAR = 12;

export class ChartSource {
	climateDivision: number;
	state: string;
	counts: number[] = [];
	total = 0;

	constructor(climateDivision: number, state: string) {
		this.climateDivision = climateDivision;
		this.state = state;
	}

	add(summary: ClimDivSummary, pointsPerMonth: number): void {
		if (this.counts.length == 0) {
			this.counts = new Array(pointsPerMonth * MONTHS_PER_YEAR);
			this.counts.fill(0);
		}
		const pointsPerSum = MAX_POINTS_PER_MONTH / pointsPerMonth;
		let i = 0;
		let j = 0;
		while (i < summary.counts.length) {
			let sum = 0;
			for (let k = 0; k < pointsPerSum; ++k) {
				sum += summary.counts[i];
				++i;
			}
			this.counts[j++] += sum;
			this.total += sum;
		}
	}
}
