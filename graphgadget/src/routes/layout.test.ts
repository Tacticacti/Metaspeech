import sut from './+layout.svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, type RenderResult } from '@testing-library/svelte';
import { df } from '$lib/Store';
import { fromText } from '$lib/dataframe/DataFrame';

vi.mock('$components/Footer.svelte');
vi.mock('$components/Navbar.svelte');
vi.mock('$app/stores', async (og) => ({
	...(await og<typeof import('$app/stores')>()),
	navigating: {
		subscribe: (fn: () => void) => (navFunction = fn)
	}
}));
vi.mock('svelte', async (og) => ({
	...(await og<typeof import('svelte')>()),
	onMount: (fn: () => void) => (mountFunction = fn)
}));

let navFunction: () => void;
let mountFunction: () => void;

let layout: RenderResult<sut>;

beforeEach(() => {
	layout = render(sut);
});
afterEach(() => {
	sessionStorage.clear();
});

describe('contains elements', () => {
	it('should have a navbar', () => {
		const navbar = layout.getByTestId('navbar');
		expect(navbar).toBeInTheDocument();
	});
	it('should have a footer', () => {
		const footer = layout.getByTestId('footer');
		expect(footer).toBeInTheDocument();
	});
});

describe('session storage', () => {
	it('should save data to session storage on navigation', async () => {
		const data = fromText('a,b\n1,2\n3,4\n5,6\n');
		df.set(data);
		navFunction();
		expect(sessionStorage.getItem('current-df')).toEqual(JSON.stringify(data));
	});

	it('should load data from session storage on mount', async () => {
		const data = fromText('a,b\n1,2\n3,4\n5,6\n');
		sessionStorage.setItem('current-df', JSON.stringify(data));
		mountFunction();
		expect(df.get()).toEqual(data);
	});
});
