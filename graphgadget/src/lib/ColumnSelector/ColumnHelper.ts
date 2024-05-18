export const SelectorType = {
	MULTI_SELECT: 'Multi_select'
};
export function getNumericalColumns(columnNames: string[], data): string[] {
	const columnTypes = new Map<string, boolean>(
		columnNames.map((name) => [name, !isNaN(Number(data.getRow(0).get(name)))])
	);
	const numericColumnNames = columnNames.filter((name) => columnTypes.get(name) == true);

	return numericColumnNames;
}
export function getNonNumericalColumns(columnNames: string[], data): string[] {
	const columnTypes = new Map<string, boolean>(
		columnNames.map((name) => [name, isNaN(Number(data.getRow(0).get(name)))])
	);

	const nonNumericColumnNames = columnNames.filter((name) => columnTypes.get(name) == true);

	return nonNumericColumnNames;
}
