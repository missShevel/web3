import { writable } from 'svelte/store';

export const counter = writable(0);
export const errors = writable([]);
