import { handleData } from "$lib/graphs/histogram/helper";
import { DataFrame, fromText } from "$lib/dataframe/DataFrame";
import { calculateMean, calculateSum, calculateAbsoluteFrequency, calculateRelativeFrequency } from './__mocks__/calculations';

jest.mock('../sharedFunctions', () => ({
    calculateMean: calculateMean,
    calculateSum: calculateSum,
    calculateAbsoluteFrequency: calculateAbsoluteFrequency,
    calculateRelativeFrequency: calculateRelativeFrequency,
}));
describe('handleData tests', () => {
    it('should call calculateMean when selectedFunction is sum', () => {
        const df = new DataFrame();
		df.set(fromText('a,b\n1,2\n3,4'));
        const groupedDf = df.groupBy();
        handleData('sum', groupedDf);
        expect(calculateSum).toHaveBeenCalledTimes(1);
    });
});