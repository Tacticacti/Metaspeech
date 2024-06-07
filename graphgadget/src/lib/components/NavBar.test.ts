import { vi, it, expect, describe } from 'vitest';
import { getByText, render } from '@testing-library/svelte';
import sut from '$lib/components/NavBar.svelte';
import { get, writable } from 'svelte/store';
import type { Page } from '@sveltejs/kit';
import { page } from '$app/stores';

vi.mock('$app/stores', (og) => ({
	...og<typeof import('$app/stores')>(),
	page: writable<Page<Record<string, string>, string | null>>({
		params: {},
		url: new URL('http://localhost/'),
		route: { id: '/' },
		data: {},
		status: 200,
		error: null,
		state: {},
		form: {}
	})
}));

beforeEach(() => {
	const pageV = get(page);
	pageV.route.id = '/';
});

const checkAllButtonsExist = (container: HTMLElement) => {
	const home = getByText(container, 'HOME');
	expect(home).to.exist;

	const data = getByText(container, 'DATA');
	expect(data).to.exist;

	const parameters = getByText(container, 'PARAMETERS');
	expect(parameters).to.exist;

	const visualizations = getByText(container, 'VISUALIZATIONS');
	expect(visualizations).to.exist;
};

const checkButtonClass = (button: HTMLElement, isActive: boolean) => {
	if (isActive) {
		expect(button.className).to.include('font-bold');
		expect(button.className).to.include('md:text-offwhite');
	} else {
		expect(button.className).to.include('md:text-blue-400');
	}
};

describe('check links exist', () => {
	it('All buttons exist when in home', () => {
		const pageV = get(page);
		pageV.route.id = '/';
		const { container } = render(sut);
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in modify', () => {
		const pageV = get(page);
		pageV.route.id = '/modify';
		const { container } = render(sut);
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in select', () => {
		const pageV = get(page);
		pageV.route.id = '/select';
		const { container } = render(sut);
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in view', () => {
		const pageV = get(page);
		pageV.route.id = '/view';
		const { container } = render(sut);
		checkAllButtonsExist(container);
	});
});

describe('check link classes', () => {
	it('Home button is active when in home', () => {
		const pageV = get(page);
		pageV.route.id = '/';
		const { container } = render(sut);
		const home = getByText(container, 'HOME');
		checkButtonClass(home, true);
	});

	it('Data button is active when in modify', () => {
		const pageV = get(page);
		pageV.route.id = '/modify';
		const { container } = render(sut);
		const data = getByText(container, 'DATA');
		checkButtonClass(data, true);
	});

	it('Parameters button is active when in select', () => {
		const pageV = get(page);
		pageV.route.id = '/select';
		const { container } = render(sut);
		const parameters = getByText(container, 'PARAMETERS');
		checkButtonClass(parameters, true);
	});

	it('Visualizations button is active when in view', () => {
		const pageV = get(page);
		pageV.route.id = '/view';
		const { container } = render(sut);
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(visualizations, true);
	});

	it('Other buttons are inactive when in home', () => {
		const pageV = get(page);
		pageV.route.id = '/';
		const { container } = render(sut);
		const data = getByText(container, 'DATA');
		const parameters = getByText(container, 'PARAMETERS');
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(data, false);
		checkButtonClass(parameters, false);
		checkButtonClass(visualizations, false);
	});

	it('Other buttons are inactive when in modify', () => {
		const pageV = get(page);
		pageV.route.id = '/modify';
		const { container } = render(sut);
		const home = getByText(container, 'HOME');
		const parameters = getByText(container, 'PARAMETERS');
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(home, false);
		checkButtonClass(parameters, false);
		checkButtonClass(visualizations, false);
	});

	it('Other buttons are inactive when in select', () => {
		const pageV = get(page);
		pageV.route.id = '/select';
		const { container } = render(sut);
		const home = getByText(container, 'HOME');
		const data = getByText(container, 'DATA');
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(home, false);
		checkButtonClass(data, false);
		checkButtonClass(visualizations, false);
	});

	it('Other buttons are inactive when in view', () => {
		const pageV = get(page);
		pageV.route.id = '/';
		const { container } = render(sut);
		const home = getByText(container, 'HOME');
		const data = getByText(container, 'DATA');
		const parameters = getByText(container, 'PARAMETERS');
		checkButtonClass(home, false);
		checkButtonClass(data, false);
		checkButtonClass(parameters, false);
	});
});

describe('check currentPage conditions', () => {
	it('Home button has active class when currentPage is empty or root', () => {
		const pageV = get(page);
		pageV.route.id = '/';
		const { container } = render(sut);
		const home = getByText(container, 'HOME');
		checkButtonClass(home, true);
	});

	it('Data button has active class when currentPage is modify', () => {
		const pageV = get(page);
		pageV.route.id = '/modify';
		const { container } = render(sut);
		const data = getByText(container, 'DATA');
		checkButtonClass(data, true);
	});

	it('Parameters button has active class when currentPage is select', () => {
		const pageV = get(page);
		pageV.route.id = '/select';
		const { container } = render(sut);
		const parameters = getByText(container, 'PARAMETERS');
		checkButtonClass(parameters, true);
	});

	it('Visualizations button has active class when currentPage is view', () => {
		const pageV = get(page);
		pageV.route.id = '/view';
		const { container } = render(sut);
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(visualizations, true);
	});
});
