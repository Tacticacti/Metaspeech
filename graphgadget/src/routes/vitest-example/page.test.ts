import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import sut from './+page.svelte';

it('displays the currency with a $ in front of it', () => {
	const { getByTestId } = render(sut, { currency: 20 });

	expect(getByTestId('formatted-currency').innerHTML).toEqual('$20');
});

it('displays the default value of currency', () => {
	const { getByTestId, getByRole } = render(sut);

	expect(getByTestId('formatted-currency').innerHTML).toEqual('$0');

	expect(getByRole('textbox').innerHTML).toEqual('');
});

it('displays the default value of currency after input has changed', async () => {
	const user = userEvent.setup();

	const { getByRole, getByTestId } = render(sut);

	const formatted = getByTestId('formatted-currency');
	const input = getByRole('textbox');
	user.clear(input);
	await user.type(input, '50');

	expect(formatted.innerHTML).toEqual('$50');
});

it('displays the main heading', () => {
	const { getByRole } = render(sut, { currency: 10 });

	const text = 'Only meant to be used as example for testing purposes';
	const heading = getByRole('heading', { name: text });

	expect(heading).to.exist;
});

it('displays the h3 heading', () => {
	const { getByRole } = render(sut, { currency: 2 });

	const text = 'Either run "npm test" or "npm run test:unit" to unit test';
	const heading = getByRole('heading', { name: text, level: 3 });

	expect(heading).to.exist;
});

it('counter starts at 0', () => {
	const { getByTestId } = render(sut);

	const counter = getByTestId('counter');
	const doubled = getByTestId('doubled');

	expect(counter.innerHTML).toContain('0');
	expect(doubled.innerHTML).toContain('0');
});

it('counter starts at 0', async () => {
	const user = userEvent.setup();

	const { getByTestId, getByRole } = render(sut);

	const counter = getByTestId('counter');
	const doubled = getByTestId('doubled');
	const button = getByRole('button');

	await user.click(button);

	expect(counter.innerHTML).toContain('1');
	expect(doubled.innerHTML).toContain('2');
});
