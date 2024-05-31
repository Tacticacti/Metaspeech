import type { Grouper, Aggregator } from './DataFrame';

// #region Grouping

/**
 * Groups by a specific value.
 * @param index The index of the column to group by.
 * @returns A Grouper.
 */
export function Specific(index: number): Grouper {
	return (row) => row[index]?.toString() ?? '';
}

/**
 * Groups by a range of values.
 * @param index The index of the column to group by.
 * @param size The size of the range.
 * @returns A Grouper.
 */
export function Bins(index: number, size: number): Grouper {
	return (row) => {
		const value = row[index] as number;
		const binIndex = Math.floor(value / size);
		return binIndex.toString();
	};
}

// #endregion

// #region Aggregators

/**
 * Counts the number of rows in a bucket.
 * @param name The name of the new column.
 * @returns An Aggregator.
 */
export function Count(name: string): Aggregator {
	return {
		name,
		fn: (bucket) => bucket.length
	};
}

/**
 * Calculates the percentage of a column in a bucket. It will produce results between 0 and 1.
 * @param name The name of the new column.
 * @param index The index of the column to calculate the percentage of.
 * @param total The total value to calculate the percentage of.
 * @returns An Aggregator.
 */
export function Percent(name: string, index: number, total: number): Aggregator {
	return {
		name,
		fn: (bucket) => bucket.reduce((sum, row) => sum + (row[index] as number), 0) / total
	};
}

/**
 * Sums a column in a bucket.
 * @param name The name of the new column.
 * @param index The index of the column to sum.
 * @returns An Aggregator.
 */
export function Sum(name: string, index: number): Aggregator {
	return {
		name,
		fn: (bucket) => bucket.reduce((sum, row) => sum + (row[index] as number), 0)
	};
}

/**
 * Averages a column in a bucket.
 * @param name The name of the new column.
 * @param index The index of the column to average.
 * @returns An Aggregator.
 */
export function Mean(name: string, index: number): Aggregator {
	return {
		name,
		fn: (bucket) => {
			const sum = bucket.reduce((sum, row) => sum + (row[index] as number), 0);
			return sum / bucket.length;
		}
	};
}

/**
 * Finds the minimum value in a column in a bucket.
 * @param name The name of the new column.
 * @param index The index of the column to find the minimum of.
 * @returns An Aggregator.
 */
export function Min(name: string, index: number): Aggregator {
	return {
		name,
		fn: (bucket) => Math.min(...bucket.map((row) => row[index] as number))
	};
}

/**
 * Finds the maximum value in a column in a bucket.
 * @param name The name of the new column.
 * @param index The index of the column to find the maximum of.
 * @returns An Aggregator.
 */
export function Max(name: string, index: number): Aggregator {
	return {
		name,
		fn: (bucket) => Math.max(...bucket.map((row) => row[index] as number))
	};
}

/**
 * Finds the median value in a column in a bucket.
 * @param name The name of the new column.
 * @param index The index of the column to find the median of.
 * @returns An Aggregator.
 */
export function Median(name: string, index: number): Aggregator {
	return {
		name,
		fn: (bucket) => {
			const values = bucket.map((row) => row[index] as number).sort((a, b) => a - b);
			const mid = Math.floor(values.length / 2);
			return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
		}
	};
}

/**
 * Finds the standard deviation of a column in a bucket.
 * @param name The name of the new column.
 * @param index The index of the column to find the standard deviation of.
 * @returns An Aggregator.
 */
export function Std(name: string, index: number): Aggregator {
	return {
		name,
		fn: (bucket) => {
			const values = bucket.map((row) => row[index] as number);
			const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
			return Math.sqrt(
				values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length
			);
		}
	};
}

/**
 * Finds the variance of a column in a bucket.
 * @param name The name of the new column.
 * @param index The index of the column to find the variance of.
 * @returns An Aggregator.
 */
export function Var(name: string, index: number): Aggregator {
	return {
		name,
		fn: (bucket) => {
			const values = bucket.map((row) => row[index] as number);
			const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
			return values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
		}
	};
}

// #endregion
