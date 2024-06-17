export const tsvTestData = `Id\tLanguage\tAge\tGender\tDuration(seconds)
1\tEN\t19\tM\t100
2\tPT\t21\tF\t200
3\tES\t50\tM\t140`;

export const tsvTestDataTwo = `Column_1\tColumn_2
1\tcell_2
2\tcell_4
3\tcell_6`;

export const tsvTestDataThree = `Id\tGroup\tAge\tGender\tDuration(seconds)
1\t1\t19\tM\t100
2\t1\t46\tF\t300
3\t2\t59\tF\t400
4\t2\t19\tM\t400
5\t2\t49\tM\t100
6\t3\t47\tF\t300
7\t3\t53\tM\t100
8\t1\t59\tM\t400
9\t1\t44\tF\t500
10\t2\t38\tM\t140`;

export const tsvCorruptedTestData = `Id\tLanguage\tAge\tGender\tDuration(seconds)
1EN\t19\tM\t100\t 
2\tPT21F\t200\t \t 
3\tES\t50\tM\t140`;

export const jsonTestData = `
{
	"Row_1": {
		"Column_1": "1",
		"Column_2": "2"
	},
	"Row_2": {
		"Column_1": "3",
		"Column_2": "4"
	},
	"Row_3": {
		"Column_1": "5",
		"Column_2": "6"
	}
}
`;

export const jsonCorruptedTestData = `
{
	"Row_1": {
		"Column_1": "1",
		"Column_2": ""
	},
	"Row_2": {
		"Column_1": "3",
		"Column_2": "4"
	},
	"Row_3": {
		"Column_1": "5",
		"Column_2": ""
	}
}
`;
