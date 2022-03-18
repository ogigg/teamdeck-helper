import { Writable, writable } from 'svelte/store';
import type { HarvestApiData } from './models/harvest';

export const harvestData: Writable<HarvestApiData> = writable({
    token: '',
    accountId: ''
});