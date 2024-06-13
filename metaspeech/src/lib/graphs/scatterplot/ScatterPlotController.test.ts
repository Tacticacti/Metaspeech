import { getXAxisCol, getLegendCol, getScatterDatasets } from '$lib/graphs/scatterplot/ScatterPlotController';
import { describe, it, expect } from 'vitest';
import type { Column } from '$lib/Types';

describe('get columns test', () => {
    const cols: Column[] = [
        {
            name: 'Column 1',
            hasMissing: false,
            type: 'string'
        },
        {
            name: 'Column 2',
            hasMissing: false,
            type: 'number'
        }
    ];

    describe('get x column test', () => {
        it('empty columns throws error', () => {
            expect(() => getXAxisCol([])).toThrow();
        });
    
        it('only string column throws error', () => {
            expect(() => getXAxisCol([cols[0]])).toThrow();
        });
    
        it('string and numeric column works', () => {
            expect(getXAxisCol(cols)).toEqual(cols[1]);
        });
    });
    
    describe('get legend column test', () => {
        it('empty columns returns undefined', () => {
            expect(getLegendCol([], cols[0])).toBeUndefined();
        });
    
        it('column is already in x-axis, return undefined', () => {
            expect(getLegendCol([cols[1]], cols[1])).toBeUndefined();
        });
    
        it('two column works', () => {
            expect(getLegendCol(cols, cols[1])).toEqual(cols[0]);
        });

        it('two column works different order', () => {
            expect(getLegendCol([cols[1], cols[0]], cols[1])).toEqual(cols[0]);
        });
    });
});

describe('get scatter datasets test', () => {
    
});