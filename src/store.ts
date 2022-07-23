import { Writable, writable } from 'svelte/store';
import type { HarvestApiData, TimeEntry } from './models/harvest';

export const harvestData: Writable<HarvestApiData> = writable({
    token: '',
    accountId: ''
});

export const addToTeamdeck: Writable<boolean> = writable(false);

export const selectedDates: Writable<{from: Date, to: Date}> = writable({
    from: new Date(),
    to: new Date()
});

export const timeEntries: Writable<TimeEntry[]> = writable([]);

export const availableProviders: Writable<{ harvest: boolean, clockify: boolean }> = writable({
    harvest: false,
    clockify: false
})