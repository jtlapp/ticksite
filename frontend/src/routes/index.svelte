<script lang="ts">
	import { onMount } from 'svelte';
	import Line from 'svelte-chartjs/src/Line.svelte';

	import DropDown from '../components/DropDown.svelte';
	import { ClimDivSummary } from '../lib/ClimDivSummary';
	import { ChartSource } from '../lib/ChartSource';
	import { stateAbbrsCoolestFirst } from '../lib/states';

	const STORAGE_KEY = 'params';
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	const initialParamsJson = sessionStorage.getItem('params');
	const initialParams = initialParamsJson ? JSON.parse(initialParamsJson) : null;

	let earliestYear = 4000;
	let latestYear = 0;
	let startYears: number[] = [];
	let endYears: number[] = [];

	let chartCount: number = initialParams?.chartCount || 10;
	let plotType: string = initialParams?.plotType || 'Divisions';
	let source: string = initialParams?.source || 'any';
	let startYear: number = initialParams?.startYear || 0;
	let endYear: number = initialParams?.endYear || 4000;
	let lifeStage: string = initialParams?.lifeStage || 'any';
	let pointsPerMonth: number = initialParams?.pointsPerMonth || 1;
	let minCount: number = initialParams?.minCount || 100;
	let chartWidth: number = initialParams?.chartWidth || 300;

	let summaries: ClimDivSummary[];
	let monthPoints = 0;
	let yearPoints = 0;
	let chartSources: ChartSource[] = [];
	let xAxisLabels: string[] = [];

	onMount(async () => {
		summaries = await ClimDivSummary.load();
		for (const summary of summaries) {
			if (summary.year < earliestYear) {
				earliestYear = summary.year;
			} else if (summary.year > latestYear) {
				latestYear = summary.year;
			}
		}
		for (let i = earliestYear; i <= latestYear; ++i) {
			startYears.push(i);
			endYears.push(i);
		}
		if (startYear < startYears[0]) startYear = startYears[0];
		if (endYear > endYears[endYears.length - 1]) endYear = endYears[endYears.length - 1];
	});

	$: {
		endYears = [];
		for (let i = startYear; i <= latestYear; ++i) {
			endYears.push(i);
		}
		if (endYear < endYears[0]) {
			endYear = endYears[0];
		}
	}

	$: if (summaries) {
		// Index summaries by division and then year.

		const summaryIndex: Record<number, Record<number, ClimDivSummary>> = {};
		for (const summary of summaries) {
			let summaryEntry = summaryIndex[summary.climateDivision];
			if (!summaryEntry) {
				summaryEntry = {};
				summaryIndex[summary.climateDivision] = summaryEntry;
			}
			summaryEntry[summary.year] = summary;
		}

		// Tabulate the number of data points and the charts.

		// whether there is a data point for any given division, year, and month
		const pointsByDivAndYear: Record<number, Record<number, boolean[]>> = {};
		monthPoints = 0;
		const chartsByRegion: Record<string | number, ChartSource> = {};

		for (const summary of summaries) {
			if (
				(source == 'any' || source == summary.source) &&
				startYear <= summary.year &&
				endYear >= summary.year &&
				(lifeStage == 'any' || lifeStage.toLowerCase() == summary.lifeStage)
			) {
				// Identify available data points.

				for (let i = 0; i < 12; ++i) {
					let precedingYearCounts = 0;
					for (let j = i - 1; j >= 0; --j) {
						for (let k = 0; k < 4; ++k) {
							precedingYearCounts += summary.counts[j * 4 + k];
						}
					}
					const precedingSummary = summaryIndex[summary.climateDivision][summary.year - 1];
					if (precedingSummary) {
						for (let j = 11; j >= i; --j) {
							for (let k = 0; k < 4; ++k) {
								precedingYearCounts += precedingSummary.counts[j * 4 + k];
							}
						}
					} else {
						// must have all months of prior year to count as a data point
						precedingYearCounts = 0;
					}
					let pointsByYear = pointsByDivAndYear[summary.climateDivision];
					if (!pointsByYear) {
						pointsByYear = {};
						pointsByDivAndYear[summary.climateDivision] = pointsByYear;
					}
					let pointsByMonth = pointsByYear[summary.year];
					if (!pointsByMonth) {
						pointsByMonth = new Array(12).fill(false);
						pointsByYear[summary.year] = pointsByMonth;
					}
					pointsByMonth[i] = precedingYearCounts >= minCount;
					if (pointsByMonth[i]) ++monthPoints;
				}

				// Accumulate data into a chart.

				const region = plotType == 'States' ? summary.state : summary.climateDivision;
				let chart = chartsByRegion[region];
				if (!chart) {
					chart = new ChartSource(summary.climateDivision, summary.state);
					chartsByRegion[region] = chart;
				}
				chart.add(summary, pointsPerMonth);
			}
		}
		//console.log(JSON.stringify(pointsByDivAndYear, undefined, '  '));

		// Calculate total complete years represented in month points.

		yearPoints = 0;
		for (const pointsByYear of Object.values(pointsByDivAndYear)) {
			for (const pointsByMonth of Object.values(pointsByYear)) {
				if (pointsByMonth.every((available) => available)) ++yearPoints;
			}
		}

		// Filter and sort the charts.

		chartSources = Object.values(chartsByRegion);
		chartSources.sort((a, b) => b.total - a.total);
		chartSources = chartSources.slice(0, chartCount);
		chartSources = chartSources.filter((src) => src.total >= minCount);
		if (plotType == 'States') {
			const reorderedSources: ChartSource[] = [];
			for (const state of stateAbbrsCoolestFirst) {
				for (const source of chartSources) {
					if (state == source.state) {
						reorderedSources.push(source);
					}
				}
			}
			chartSources = reorderedSources;
		}

		// Label the charts.

		xAxisLabels = [];
		for (let i = 0; i < chartSources[0].counts.length; ++i) {
			xAxisLabels.push(months[Math.floor(i / pointsPerMonth)]);
		}
	}

	$: sessionStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			chartCount,
			plotType,
			source,
			startYear,
			endYear,
			lifeStage,
			pointsPerMonth,
			minCount,
			chartWidth
		})
	);
</script>

{#if summaries}
	<h1 class="font-medium mt-4 mb-6 text-2xl text-center">Seasonal Deer Tick Abundance</h1>

	<div class="mx-auto">
		<div class="flex flex-wrap justify-center mb-2 mx-auto">
			<div class="sm:w-24 px-3 mb-6">
				<DropDown label="Charts" bind:value={chartCount} options={[10, 12, 20, 30, 40, 50]} />
			</div>
			<div class="sm:w-35 px-3 mb-6">
				<DropDown label="Plot" bind:value={plotType} options={['Divisions', 'States']} />
			</div>
			<div class="sm:w-38 px-3 mb-6">
				<DropDown label="Source" bind:value={source} options={['any', 'TickCheck', 'TickReport']} />
			</div>
			<div class="sm:w-28 px-3 mb-6">
				<DropDown label="Start" bind:value={startYear} options={startYears} />
			</div>
			<div class="sm:w-28 px-3 mb-6">
				<DropDown label="End" bind:value={endYear} options={endYears} />
			</div>
			<div class="sm:w-30 px-3 mb-6">
				<DropDown
					label="Life Stage"
					bind:value={lifeStage}
					options={['any', 'Larva', 'Nymph', 'Adult']}
				/>
			</div>
			<div class="sm:w-32 px-3 mb-6">
				<DropDown label="Points/Month" bind:value={pointsPerMonth} options={[1, 2, 4]} />
			</div>
			<div class="sm:w-26 px-3 mb-6">
				<DropDown
					label="Min Count"
					bind:value={minCount}
					options={[50, 60, 70, 80, 90, 100, 120, 150, 175, 200, 250, 300, 350, 400, 450, 500]}
				/>
			</div>
			<div class="sm:w-26 px-3 mb-6">
				<DropDown
					label="Width"
					bind:value={chartWidth}
					options={[200, 250, 300, 350, 400, 450, 500, 550, 600]}
				/>
			</div>
		</div>

		<div class="mb-4 text-center">
			{monthPoints} per-month points available for {yearPoints} complete years
		</div>

		<div class="flex flex-wrap justify-center">
			{#each chartSources as source}
				<div class="mb-4">
					<Line
						width={chartWidth}
						data={{
							labels: xAxisLabels,
							datasets: [
								{
									label:
										(plotType == 'Divisions' ? source.climateDivision + ', ' : '') +
										source.state +
										` (${source.total} ticks)`,
									data: source.counts,
									borderColor: 'rgb(75, 192, 192)',
									lineTension: 0.5
								}
							]
						}}
					/>
				</div>
			{/each}
		</div>
	</div>
{:else}
	No summaries
{/if}
