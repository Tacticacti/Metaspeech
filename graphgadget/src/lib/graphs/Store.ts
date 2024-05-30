import { writable, type Writable } from 'svelte/store';
import Histogram from './histogram/Histogram.svelte';

// why don't we use the GraphMeta type here?
export const graph_name = writable('');
export const graph_description = writable('');
export const selected_graph: Writable<ConstructorOfATypedSvelteComponent> = writable(Histogram);
