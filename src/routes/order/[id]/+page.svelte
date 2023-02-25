<script lang="ts">
	import Counter from '../../Counter.svelte';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';

	export let data: PageData;
	let { foodItems, order } = data;
	let sum = 0;
</script>

<h1>{order.id}</h1>
<form method="POST">
    <div class="food-items">
	{#each foodItems as item}
		<div class="food-item">
			<h1>{item.name}</h1>
			<p class="price">{`$${item.price}`}</p>
			<Counter
				count={+order[item.name]}
				label={item.name}
				increment={() => {
					sum += item.price;

					order = {
						...order,
						[item.name]: +order[item.name] + 1
					};
				}}
				decrement={() => {
					sum -= item.price;

					order = {
						...order,
						[item.name]: +order[item.name] - 1
					};
				}}
			/>
		</div>
	{/each}
    </div>
	<div class="accumulate">
		<button type="submit">Submit</button>
		<p>Total:</p>
		<input type="number" step="any" name="total" value={sum} class="hidden"/>
		<p class="price-total">
			{sum}
		</p>
	</div>
</form>

<style>
	.food-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.price {
		font-size: 2rem;
		margin-left: auto;
		margin-right: 1rem;
	}

	.accumulate {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}

	.food-items {
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	.hidden {
		display: none;
		user-select: none;
	}
</style>
