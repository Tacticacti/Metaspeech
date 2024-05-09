// test-setup.ts
import { expect } from 'vitest';
import * as customMatchers from '@testing-library/jest-dom/matchers';

Object.entries(customMatchers).forEach(([name, matcher]) => {
	expect.extend({ [name]: matcher });
});
