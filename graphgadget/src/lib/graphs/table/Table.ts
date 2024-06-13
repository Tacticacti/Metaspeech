import type { GroupedDataFrame, Group } from "$lib/Types";

export type AggregateOption = {
    name: string;
    fn: (data: GroupedDataFrame, group: Group) => string;
    default: string;
};
export const aggregateOptions_none: AggregateOption[] = [
    {
        name: 'Count',
        fn: (_: GroupedDataFrame, group: Group) => {
            return group.values.length.toString();
        },
        default: '0'
    },
    {
        name: 'xxx.xx%',
        fn: (data: GroupedDataFrame, group: Group) => {
            const n = getSum(data.groups.map(g => g.values.length));
            const groupCount = group.values.length;
            const p = groupCount / n;
            return `${to2Decimal(p * 100)}%`
        },
        default: '0.00%'
    }
];
export const aggregateOptions_single: AggregateOption[] = [
    {
        name: 'Mean',
        fn: (_: GroupedDataFrame, group: Group) => {
            const filtered = group.values.filter((v) => typeof v === 'number') as number[];
            const mean = getMean(filtered);
            return to2Decimal(mean);
        },
        default: '-'
    },
    {
        name: 'Mean (SD)',
        fn: (_: GroupedDataFrame, group: Group) => {
            const filtered = group.values.filter((v) => typeof v === 'number') as number[];
            if (filtered.length === 0) return '-';

            const mean = getMean(filtered)
            const sd = Math.sqrt(
                filtered.reduce((acc, v) => acc + (v - mean) ** 2, 0) / filtered.length
            );
            return `${to2Decimal(mean)} (${to2Decimal(sd)})`;
        },
        default: '-'
    }
];

function getSum(values: number[]): number {
    return values.reduce((acc, v) => acc + v, 0);
}

function getMean(values: number[]): number {
    return getSum(values) / values.length;
}

function to2Decimal(num: number): string {
    return num.toFixed(2).replace('.00', '');
}