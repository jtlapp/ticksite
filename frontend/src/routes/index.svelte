<script lang="ts">
	import { SITE_NAME } from '@ticksite/shared/constants';
</script>

<h1 class="font-medium mb-4 text-2xl">Welcome to {SITE_NAME}</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the SvelteKit documentation</p>

<div class="w-full">
	<div class="flex flex-wrap mb-2">
		<div class="w-full md:w-1/6 px-3 mb-6 md:mb-0">
			<label
				class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
				for="grid-city"
			>
				Source
			</label>
			<div class="relative">
				<select
					class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-state"
				>
					<option>any</option>
					<option>TickCheck</option>
					<option>TickReport</option>
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
				>
					<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
						><path
							d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
						/></svg
					>
				</div>
			</div>
		</div>
		<div class="w-full md:w-1/6 px-3 mb-6 md:mb-0">
			<label
				class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
				for="grid-city"
			>
				Start
			</label>
			<div class="relative">
				<select
					class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-state"
				>
					<option>2017</option>
					<option>2018</option>
					<option>2019</option>
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
				>
					<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
						><path
							d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
						/></svg
					>
				</div>
			</div>
		</div>
		<div class="w-full md:w-1/6 px-3 mb-6 md:mb-0">
			<label
				class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
				for="grid-city"
			>
				End
			</label>
			<div class="relative">
				<select
					class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-state"
				>
					<option>2017</option>
					<option>2018</option>
					<option>2019</option>
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
				>
					<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
						><path
							d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
						/></svg
					>
				</div>
			</div>
		</div>
		<div class="w-full md:w-1/6 px-3 mb-6 md:mb-0">
			<label
				class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
				for="grid-state"
			>
				Life Stage
			</label>
			<div class="relative">
				<select
					class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-state"
				>
					<option>any</option>
					<option>Larva</option>
					<option>Nymph</option>
					<option>Adult</option>
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
				>
					<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
						><path
							d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
						/></svg
					>
				</div>
			</div>
		</div>
		<div class="w-full md:w-1/6 px-3 mb-6 md:mb-0">
			<label
				class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
				for="grid-zip"
			>
				Points per Month
			</label>
			<div class="relative">
				<select
					class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-state"
				>
					<option>1</option>
					<option>2</option>
					<option>4</option>
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
				>
					<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
						><path
							d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
						/></svg
					>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="flex justify-center">
	<div class="mb-3 xl:w-96">
		<select
			class="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
			aria-label="Default select example"
		>
			<option selected>Open this select menu</option>
			<option value="1">One</option>
			<option value="2">Two</option>
			<option value="3">Three</option>
		</select>
	</div>
</div>
