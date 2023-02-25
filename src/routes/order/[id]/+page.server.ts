import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { loadData, loadFoodItems, saveData, type Order } from '$lib/mockDB/index';

export const load = (async ({ params }) => {
	const { id } = params;
	const orders = loadData();
	const foodItems = loadFoodItems();
	let order = orders.find((order) => order.id === id);

	if (!order) {
		order = {
			id,
			...foodItems.reduce((acc, { name }) => {
				acc[name] = 0;
				return acc;
			}, {} as Record<string, string | number>)
		};
	}

	return {
		foodItems,
		order
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const orders = loadData();
		const orderItems = [...(await request.formData()).entries()].reduce((acc, [key, value]) => {
			acc[key] = (isNaN(+value) ? value : +value) as string | number;
			return acc;
		}, {} as Record<string, string | number>);

		const index = orders.findIndex((order) => order.id === id);
		if (index !== -1) {
			orders[index] = {
				id,
				...orderItems
			};
		} else {
			orders.push({
				id,
				...orderItems
			});
		}
		saveData(orders);

        const lastOrder = +(orders.at(-1)?.id || id);
		throw redirect(303, `/order/${lastOrder+1}`);
	}
} satisfies Actions;
