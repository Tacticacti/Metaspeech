import { render, type RenderResult } from '@testing-library/svelte';
import sut from '$lib/graphs/table/Table.svelte';
import { describe, it, expect } from 'vitest';
import type { Column, DataType, Group, GroupBy, GroupedDataFrame } from '$lib/Types';
import userEvent, { type UserEvent } from '@testing-library/user-event';

function column(groupBy: GroupBy | undefined): Column {
	return {
		name: 'name',
		type: groupBy?.type === 'binned' ? 'number' : 'string',
		hasMissing: false,
		groupBy: groupBy
	};
}
function group(keys: DataType[], values: DataType[]): Group {
	return {
		keys,
		values
	};
}
function selectOption(r: RenderResult<sut>, user: UserEvent, option: string): Promise<void> {
	return user.selectOptions(r.getByTestId('aggregate'), r.getByTestId(option));
}

describe('When user views', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
});

describe('no aggregate', () => {
	it('should render count', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'specific' })],
			aggregateColumn: undefined,
			groups: [group(['a'], [undefined]), group(['b'], [undefined, undefined])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Count');

		r.getByTestId('cell-a');
		r.getByTestId('cell-b');
		r.getByTestId('cell-1');
		r.getByTestId('cell-2');
	});
	it('should render percentages', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'specific' })],
			aggregateColumn: undefined,
			groups: [group(['a'], [undefined]), group(['b'], [undefined, undefined])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Percentage');

		r.getByTestId('cell-a');
		r.getByTestId('cell-b');
		r.getByTestId('cell-33.33%');
		r.getByTestId('cell-66.67%');
	});
});

describe('with aggregate', () => {
	it('should render mean', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'specific' })],
			aggregateColumn: column(undefined),
			groups: [group(['a'], [1]), group(['b'], [2, 4])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Mean');

		r.getByTestId('cell-a');
		r.getByTestId('cell-b');
		r.getByTestId('cell-1');
		r.getByTestId('cell-3');
	});
	it('should render mean (sd)', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'specific' })],
			aggregateColumn: column(undefined),
			groups: [group(['a'], [1]), group(['b'], [2, 4])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Mean (SD)');

		r.getByTestId('cell-a');
		r.getByTestId('cell-b');
		r.getByTestId('cell-1 (0)');
		r.getByTestId('cell-3 (1)');
	});
	it('should render Mean ± SE', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'specific' })],
			aggregateColumn: column(undefined),
			groups: [group(['a'], [1]), group(['b'], [2, 4])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Mean ± SE');

		r.getByTestId('cell-a');
		r.getByTestId('cell-b');
		r.getByTestId('cell-1 ± 0');
		r.getByTestId('cell-3 ± 0.71');
	});
	it('should render min-max', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'specific' })],
			aggregateColumn: column(undefined),
			groups: [group(['a'], [1]), group(['b'], [2, 4])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Min-Max');

		r.getByTestId('cell-a');
		r.getByTestId('cell-b');
		r.getByTestId('cell-1-1');
		r.getByTestId('cell-2-4');
	});
});

describe('edge cases', () => {
	const options = ['Mean', 'Mean (SD)', 'Mean ± SE', 'Min-Max'];
	for (const option of options) {
		it('should render ' + option, async () => {
			const user = userEvent.setup();
			const df: GroupedDataFrame = {
				groupedColumns: [column({ type: 'specific' })],
				aggregateColumn: column(undefined),
				groups: [group(['a'], [undefined]), group(['b'], [2, 4])]
			};
			const r = render(sut, { props: { data: df } });
			await selectOption(r, user, option);
			r.getByTestId('cell--');
		});
	}

	it('should handle binning', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'binned', size: 10 })],
			aggregateColumn: column(undefined),
			groups: [group([1], [1]), group([2], [2, 4])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Mean');

		r.getByTestId('cell-[10-19)');
		r.getByTestId('cell-[20-29)');
		r.getByTestId('cell-1');
		r.getByTestId('cell-3');
	});
	it('should handle multiple', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'binned', size: 10 }), column({ type: 'specific' })],
			aggregateColumn: column(undefined),
			groups: [group([1, 'a'], [1]), group([2, 'b'], [2, 4]), group([2, 'a'], [3])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Mean');

		r.getByTestId('cell-[10-19)');
		r.getByTestId('cell-[20-29)');
		r.getByTestId('cell-a');
		r.getByTestId('cell-b');
	});
	it('should handle undefined key name', async () => {
		const user = userEvent.setup();
		const df: GroupedDataFrame = {
			groupedColumns: [column({ type: 'binned', size: 10 }), column({ type: 'specific' })],
			aggregateColumn: column(undefined),
			groups: [group([1, 'a'], [1]), group([2, 'b'], [2, 4]), group([2, 'a'], [3])]
		};
		const r = render(sut, { props: { data: df } });
		await selectOption(r, user, 'Mean');

		r.getByTestId('cell-[10-19)');
		r.getByTestId('cell-[20-29)');
		r.getByTestId('cell-a');
		r.getByTestId('cell-b');
	});
	it('should handle large df', async () => {
		const df: GroupedDataFrame = {
			groupedColumns: [
				column({ type: 'binned', size: 10 }),
				column({ type: 'specific' }),
				column({ type: 'specific' }),
				column({ type: 'specific' })
			],
			aggregateColumn: undefined,
			groups: [
				group([1, 'a', '1a', 'x'], Array(5)),
				group([2, 'b', '2b', 'y'], Array(20)),
				group([3, 'a', '1a', 'x'], Array(6))
			]
		};
		render(sut, { props: { data: df } });
	});
});
