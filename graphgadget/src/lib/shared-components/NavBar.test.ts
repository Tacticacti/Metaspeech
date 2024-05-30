import { it, expect, describe } from 'vitest';
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

const checkButtonClass = (button: HTMLElement, isActive: boolean) => {
	if (isActive) {
		expect(button.className).to.include('font-bold');
		expect(button.className).to.include('md:text-offwhite');
	} else {
		expect(button.className).to.include('md:text-blue-400');
	}
};

describe('check links exist', () => {
	it('All buttons exist when defaulted to home', () => {
		const { container } = render(sut);
		checkAllButtonsExist(container);
	});

	it('All buttons exist when in home', () => {
		const { container } = render(sut, { currentPage: '' });
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

describe('check link classes', () => {
	it('Home button is active when in home', () => {
		const { container } = render(sut, { currentPage: '' });
		const home = getByText(container, 'HOME');
		checkButtonClass(home, true);
	});

	it('Data button is active when in modify', () => {
		const { container } = render(sut, { currentPage: 'modify' });
		const data = getByText(container, 'DATA');
		checkButtonClass(data, true);
	});

	it('Parameters button is active when in select', () => {
		const { container } = render(sut, { currentPage: 'select' });
		const parameters = getByText(container, 'PARAMETERS');
		checkButtonClass(parameters, true);
	});

	it('Visualizations button is active when in view', () => {
		const { container } = render(sut, { currentPage: 'view' });
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(visualizations, true);
	});

	it('Other buttons are inactive when in home', () => {
		const { container } = render(sut, { currentPage: '' });
		const data = getByText(container, 'DATA');
		const parameters = getByText(container, 'PARAMETERS');
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(data, false);
		checkButtonClass(parameters, false);
		checkButtonClass(visualizations, false);
	});

	it('Other buttons are inactive when in modify', () => {
		const { container } = render(sut, { currentPage: 'modify' });
		const home = getByText(container, 'HOME');
		const parameters = getByText(container, 'PARAMETERS');
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(home, false);
		checkButtonClass(parameters, false);
		checkButtonClass(visualizations, false);
	});

	it('Other buttons are inactive when in select', () => {
		const { container } = render(sut, { currentPage: 'select' });
		const home = getByText(container, 'HOME');
		const data = getByText(container, 'DATA');
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(home, false);
		checkButtonClass(data, false);
		checkButtonClass(visualizations, false);
	});

	it('Other buttons are inactive when in view', () => {
		const { container } = render(sut, { currentPage: 'view' });
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
		const { container } = render(sut, { currentPage: '' });
		const home = getByText(container, 'HOME');
		checkButtonClass(home, true);

		const { container: rootContainer } = render(sut, { currentPage: '/' });
		const homeRoot = getByText(rootContainer, 'HOME');
		checkButtonClass(homeRoot, true);
	});

	it('Data button has active class when currentPage is modify', () => {
		const { container } = render(sut, { currentPage: 'modify' });
		const data = getByText(container, 'DATA');
		checkButtonClass(data, true);
	});

	it('Parameters button has active class when currentPage is select', () => {
		const { container } = render(sut, { currentPage: 'select' });
		const parameters = getByText(container, 'PARAMETERS');
		checkButtonClass(parameters, true);
	});

	it('Visualizations button has active class when currentPage is view', () => {
		const { container } = render(sut, { currentPage: 'view' });
		const visualizations = getByText(container, 'VISUALIZATIONS');
		checkButtonClass(visualizations, true);
	});
});
