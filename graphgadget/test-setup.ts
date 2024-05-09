// test-setup.ts
import { expect, vi } from 'vitest';
import * as customMatchers from '@testing-library/jest-dom/matchers';

import 'vitest-canvas-mock'

// @ts-expect-error: Global type missing
global.jest = vi

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
  
// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

Object.entries(customMatchers).forEach(([name, matcher]) => {
  expect.extend({ [name]: matcher });
});
