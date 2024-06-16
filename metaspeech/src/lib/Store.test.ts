import { expect, it, describe } from 'vitest';
import { df } from './Store';

describe('Store', () => {
	it('should have a data frame', () => {
		expect(df).toBeDefined();
	});
});
