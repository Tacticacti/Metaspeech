import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import sut from './+page.svelte';

it('right side says nothing', () => {
	const { getByTestId } = render(sut);

	expect(getByTestId('name-chart').innerHTML).toEqual('nothing');
    expect(getByTestId('description-chart').innerHTML).toEqual('nothing');
});
it('hover histogram', async () => {
    const user = userEvent.setup();
	const { getByTestId } = render(sut);

    const hist = getByTestId('histogram')

    await user.hover(hist)
	expect(getByTestId('name-chart').innerHTML).toEqual('Histogram');
    expect(getByTestId('description-chart').innerHTML).toEqual('Histogram description');
});
it('unhover histogram', async () => {
    const user = userEvent.setup();
	const { getByTestId } = render(sut);

    const hist = getByTestId('histogram')

    await user.hover(hist)
	expect(getByTestId('name-chart').innerHTML).toEqual('Histogram');
    expect(getByTestId('description-chart').innerHTML).toEqual('Histogram description');

    await user.unhover(hist)

    expect(getByTestId('name-chart').innerHTML).toEqual('nothing');
    expect(getByTestId('description-chart').innerHTML).toEqual('nothing');
});


