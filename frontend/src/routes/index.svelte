<script lang="ts">
	import { onMount } from 'svelte';
	import Line from 'svelte-chartjs/src/Line.svelte';

	import { SITE_NAME } from '@ticksite/shared/constants';
	import DropDown from '../components/DropDown.svelte';
	import { ClimDivSummary } from '../lib/ClimDivSummary';
	import { ChartSource } from '../lib/ChartSource';

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

	let chartCount = initialParams?.chartCount || 10;
	let plotType = initialParams?.plotType || 'Divisions';
	let source = initialParams?.source || 'any';
	let startYear = initialParams?.startYear || 0;
	let endYear = initialParams?.endYear || 4000;
	let lifeStage = initialParams?.lifeStage || 'any';
	let pointsPerMonth = initialParams?.pointsPerMonth || 1;
	let chartWidth = initialParams?.chartWidth || 300;

	let summaries: ClimDivSummary[];
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
		const chartsByRegion: Record<string | number, ChartSource> = {};
		for (const summary of summaries) {
			if (
				(source == 'any' || source == summary.source) &&
				startYear <= summary.year &&
				endYear >= summary.year &&
				(lifeStage == 'any' || lifeStage.toLowerCase() == summary.lifeStage)
			) {
				const region = plotType == 'States' ? summary.state : summary.climateDivision;
				let chart = chartsByRegion[region];
				if (!chart) {
					chart = new ChartSource(summary.climateDivision, summary.state);
					chartsByRegion[region] = chart;
				}
				chart.add(summary, pointsPerMonth);
			}
		}
		chartSources = Object.values(chartsByRegion);
		chartSources.sort((a, b) => b.total - a.total);
		chartSources = chartSources.slice(0, chartCount);

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
			chartWidth
		})
	);
</script>

{#if summaries}
	<h1 class="font-medium mt-4 mb-6 text-2xl text-center">Welcome to {SITE_NAME}</h1>

	<div class="mx-auto">
		<div class="flex flex-wrap justify-center mb-2 mx-auto">
			<div class="sm:w-24 px-3 mb-6">
				<DropDown label="Charts" bind:value={chartCount} options={[10, 20, 30, 40, 50]} />
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
					label="Width"
					bind:value={chartWidth}
					options={[200, 250, 300, 350, 400, 450, 500, 550, 600]}
				/>
			</div>
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
