<script lang="ts">
	import { onMount } from 'svelte';

	import { SITE_NAME } from '@ticksite/shared/constants';
	import DropDown from '../components/DropDown.svelte';
	import { ClimDivSummary } from '../lib/ClimDivSummary';

	let chartCount = 10;
	let plotType = 'Divisions';
	let source = 'any';
	let startYear = 2017;
	let endYear = 2019;
	let lifeStage = 'any';
	let pointsPerMonth = 1;

	let summaries: ClimDivSummary[];

	onMount(async () => {
		console.log('loading');
		summaries = await ClimDivSummary.load();
		console.log('loaded');
	});
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
				<DropDown label="Start" bind:value={startYear} options={[2017, 2018, 2019]} />
			</div>
			<div class="sm:w-28 px-3 mb-6">
				<DropDown label="End" bind:value={endYear} options={[2017, 2018, 2019]} />
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
		</div>
	</div>
{:else}
	No summaries
{/if}
