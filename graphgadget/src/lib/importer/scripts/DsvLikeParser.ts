import { DataFrame } from 'dataframe-js';

export function ParseTsv(file: File): Promise<DataFrame> {
    return DataFrame.fromTSV(file);
}
export function ParseCsv(file: File): Promise<DataFrame> {
    return DataFrame.fromCSV(file);
}