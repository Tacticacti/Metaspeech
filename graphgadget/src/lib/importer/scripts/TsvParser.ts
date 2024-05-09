import { DataFrame } from "dataframe-js";

export function ParseTsv(file: File): Promise<DataFrame> {
    return DataFrame.fromTSV(file);
}
