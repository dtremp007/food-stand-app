import { readFileSync, writeFileSync } from 'fs';

export type FoodItem = {
    name: string;
    price: number;
};

export type Order = {
	id: string;
    [key: string]: string | number;
};

const path = process.cwd() + '/src/lib/mockDB/orders.json';

export function loadData(): Order[] {
	try {
		return JSON.parse(readFileSync(path, 'utf-8'));
	} catch (error) {
		return [];
	}
}

export function loadFoodItems(): FoodItem[] {
    try {
        return JSON.parse(readFileSync(process.cwd() + '/src/lib/mockDB/foodItems.json', 'utf-8'));
    } catch (error) {
        return [];
    }
}

export function saveData(data: Order[]) {
	writeFileSync(path, JSON.stringify(data, null, 2));
}
