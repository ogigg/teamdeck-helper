import Settings from './modules/settings/Settings.svelte';
import Home from './modules/home/Home.svelte';

export const routes = {
    '/': Home,
    '/settings': Settings,
    '*': Settings,
}