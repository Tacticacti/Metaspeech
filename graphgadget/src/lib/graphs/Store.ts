import { writable, type Writable } from 'svelte/store';
import Histogram from './histogram/Histogram.svelte';

// why don't we use the GraphMeta type here?
/**
 * The name of the graph that is currently selected.
 */
export const graph_name = writable('');
/**
 * The description of the graph that is currently selected.
 */
export const graph_description = writable('');
/**
 * The constructor of the graph that is currently selected.
 */
export const selected_graph: Writable<ConstructorOfATypedSvelteComponent> = writable(Histogram);
