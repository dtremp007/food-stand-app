export interface Order {
    id: string;
    foodItems: [FoodItem["name"], number][];
    total: number;
    notes?: string;
}

export interface FoodItem {
    name: string;
    price: number;
    variants?: string[];
}

export interface Restaurant {
    lastOrder: Order;
}



export type CacheKey = 'foodItems' | 'restaurant' | string;

type CacheValues<T extends CacheKey> = T extends 'foodItems' ? FoodItem[] : T extends 'restaurant' ? Restaurant : Order;

interface CacheUtil {
  set: <T extends CacheKey>(key: T, object: CacheValues<T>) => void;
  get: <T extends CacheKey>(key: T) => CacheValues<T>;
  remove: (key: CacheKey) => void;
  removeAll: () => void;
}

export const cacheUtil: CacheUtil = {
  set: (key, object) => {
    localStorage.setItem(key, JSON.stringify(object));
  },
  get: key => JSON.parse(localStorage.getItem(key) ?? 'null'),
  remove: (key) => localStorage.removeItem(key),
  removeAll: () => localStorage.clear(),
};
