<script lang="ts">
	import Counter from '../Counter.svelte';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { cacheUtil } from '$lib/utils/local-storage';
	import type { FoodItem } from '$lib/mockDB';
	import { browser } from '$app/environment';

	const DEFAULT_FOOD_ITEMS = [
		{
			name: 'Burger',
			price: 5.99
		},
		{
			name: 'Fries',
			price: 2.99
		},
		{
			name: 'Drink',
			price: 1.99
		}
	];

	export let data: PageData;

	function getFoodItems() {
		let foodItems = browser ? cacheUtil.get('foodItems') : null;
		if (!foodItems) {
			foodItems = data.foodItems || DEFAULT_FOOD_ITEMS;
			if (browser) cacheUtil.set('foodItems', foodItems);
		}
		return foodItems;
	}

	function getRestaurantData() {
		let restaurantData = browser ? cacheUtil.get('restaurant') : null;
		if (!restaurantData) {
			restaurantData = {
				lastOrder: {
					id: '0',
					foodItems: [],
					total: 0
				}
			};

			if (browser) cacheUtil.set('restaurant', restaurantData);
		}
		return restaurantData;
	}

	function getCurrentOrder() {
		const lastOrder = getRestaurantData().lastOrder;
		return {
			id: (+lastOrder.id + 1).toString(),
			foodItems: [] as [FoodItem['name'], number][],
			total: 0
		};
	}

	let foodItems = getFoodItems();
	let currentOrder = getCurrentOrder();
	let sum = 0;

	function updateCurrentOrder(foodItem: string, count: number, price: number) {
		sum += price * count;
		const index = currentOrder.foodItems.findIndex(([name]) => name === foodItem);
		if (index === -1) {
			currentOrder.foodItems.push([foodItem, count]);
		} else {
			currentOrder.foodItems[index][1] += count;
		}
		currentOrder = { ...currentOrder };
	}

	function saveOrder() {
		const restaurantData = getRestaurantData();
		currentOrder.total = sum;
		restaurantData.lastOrder = currentOrder;
		cacheUtil.set('restaurant', restaurantData);
		cacheUtil.set(currentOrder.id, currentOrder);
	}

	function onSubmit() {
		saveOrder();
		sum = 0;
		currentOrder = {
			id: (+currentOrder.id + 1).toString(),
			foodItems: [],
			total: 0
		};
	}

	function getQuantity(foodItem: string) {
		const index = currentOrder.foodItems.findIndex(([name]) => name === foodItem);
		if (index === -1) {
			return 0;
		} else {
			return currentOrder.foodItems[index][1];
		}
	}
</script>

{#if data.message}
	<div class="message">
		{data.message}
	</div>
{:else}
	<div class="flex justify-between">
		<button> Previous Order </button>
		<h1>{currentOrder.id}</h1>
        <button> Next Order </button>
	</div>
	<div>
		<div class="food-items">
			{#each foodItems as item}
				<div class="food-item">
					<h1>{item.name}</h1>
					<p class="price">{`$${item.price}`}</p>
					<Counter
						count={currentOrder.foodItems.find(([name]) => name === item.name)?.[1] || 0}
						label={item.name}
						increment={() => updateCurrentOrder(item.name, 1, item.price)}
						decrement={() => updateCurrentOrder(item.name, -1, item.price)}
					/>
				</div>
			{/each}
		</div>
		<div class="accumulate">
			<button type="submit" on:click={onSubmit}>Submit</button>
			<h1>Total:</h1>
			<input type="number" step="any" name="total" value={sum} class="hidden" />
			<h1 class="price-total">
				{`$${sum.toLocaleString()}`}
			</h1>
		</div>
	</div>
{/if}

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
    .flex {
        display: flex;
    }
    .justify-between {
        justify-content: space-between;
    }

	/* CSS */
	button {
		appearance: button;
		backface-visibility: hidden;
		background-color: #405cf5;
		border-radius: 6px;
		border-width: 0;
		box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset, rgba(50, 50, 93, 0.1) 0 2px 5px 0,
			rgba(0, 0, 0, 0.07) 0 1px 1px 0;
		box-sizing: border-box;
		color: #fff;
		cursor: pointer;
		font-family: -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
		font-size: 100%;
		height: 44px;
		line-height: 1.15;
		margin: 12px 0 0;
		outline: none;
		overflow: hidden;
		padding: 0 25px;
		position: relative;
		text-align: center;
		text-transform: none;
		transform: translateZ(0);
		transition: all 0.2s, box-shadow 0.08s ease-in;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
	}

	button:disabled {
		cursor: default;
	}

	button:focus {
		box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset, rgba(50, 50, 93, 0.2) 0 6px 15px 0,
			rgba(0, 0, 0, 0.1) 0 2px 2px 0, rgba(50, 151, 211, 0.3) 0 0 0 4px;
	}
</style>
