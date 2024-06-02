import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/table/Table.svelte';

it('table wrapper exists', () => {
	const { getByTestId } = render(sut);
	const div = getByTestId('div-element');
	expect(div).to.exist;
});
