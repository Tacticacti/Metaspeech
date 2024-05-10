import { writable } from 'svelte/store';
//import Histogram from './histogram/Histogram.svelte';
import Stem from './Stem/Stem.svelte';

// Create a type that only accepts the values of StateEnum

export const graph_name = writable('');
export const graph_description = writable('');
export const selected_graph = writable(Stem);
