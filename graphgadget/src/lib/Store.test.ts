import { data } from '$lib/Store';
import { it, expect } from 'vitest';

it('should have data', () => {
	expect(data).toBeDefined();
});
