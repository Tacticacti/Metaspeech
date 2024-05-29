import { it, expect } from 'vitest';
import { getByText, render } from '@testing-library/svelte';
import sut from '$lib/shared-components/NavBar.svelte';

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

describe('check links exist', () => {
	it('All buttons exist when defaulted to home', () => {
		const { container } = render(sut);
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in home', () => {
		const { container } = render(sut, { currentPage: 'home' });
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in home part 2', () => {
		const { container } = render(sut, { currentPage: '' });
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in modify', () => {
		const { container } = render(sut, { currentPage: 'modify' });
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in select', () => {
		const { container } = render(sut, { currentPage: 'select' });
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in view', () => {
		const { container } = render(sut, { currentPage: 'view' });
		checkAllButtonsExist(container);
	});
});
